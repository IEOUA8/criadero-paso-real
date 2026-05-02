import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Package, MapPin, Download, User, Loader2, Database } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { VALID_ROLES, DEFAULT_ROLE } from '@/constants/roles';
import { getSiteUrl } from '@/lib/siteUrl';

const AccountPage = () => {
  const { userProfile: authProfile, signOut, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  
  const [profileData, setProfileData] = useState(authProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user?.id) {
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setErrorState(null);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          if (isMounted) setProfileData({ ...data, email: user.email });
        } else {
          const defaultProfile = {
            id: user.id,
            nombre: user.email?.split('@')[0] || 'Usuario',
            apellidos: '',
            teléfono: '',
            ciudad: '',
            rol: DEFAULT_ROLE // lowercase 'user'
          };

          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert([defaultProfile])
            .select()
            .single();

          if (insertError) throw insertError;
          if (isMounted) setProfileData({ ...newProfile, email: user.email });
        }
      } catch (err) {
        console.error('Error fetching/creating profile:', err);
        if (isMounted) {
          setErrorState("No se pudo cargar la información del perfil.");
          toast({
            title: "Error de conexión",
            description: err.message || "No se pudo cargar la información del perfil.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, [user, toast]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setErrorState(null);
      
      if (!profileData.nombre?.trim()) {
        throw new Error("El nombre es requerido");
      }

      // Prepare update payload
      const updatePayload = {
        nombre: profileData.nombre,
        apellidos: profileData.apellidos,
        teléfono: profileData.teléfono,
        ciudad: profileData.ciudad
      };

      // Normalize and validate rol if provided
      if (profileData.rol) {
        const normalizedRole = profileData.rol.toLowerCase();
        if (VALID_ROLES.includes(normalizedRole)) {
          updatePayload.rol = normalizedRole;
        }
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido guardados correctamente.",
      });
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrorState(err.message || "Hubo un problema actualizando tus datos.");
      toast({
        title: "Error al guardar",
        description: err.message || "Hubo un problema actualizando tus datos.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center premium-page-bg">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8A94B] mb-4" />
        <p className="text-[#374151] font-inter">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mi Cuenta - Criadero Paso Real</title>
        <link rel="canonical" href={`${siteUrl}/cuenta`} />
        <meta property="og:url" content={`${siteUrl}/cuenta`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <div className="min-h-screen premium-page-bg pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 space-y-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-4 text-center">
                <div className="w-16 h-16 bg-[#C8A94B]/20 rounded-full flex items-center justify-center mx-auto mb-3 text-[#C8A94B]">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0B0B0B] truncate px-2">{profileData?.nombre || 'Usuario'}</h3>
                <p className="text-xs text-gray-500 truncate px-2">{profileData?.email || user?.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">Administrador</span>
                )}
              </div>
              
              <div className="bg-white p-2 rounded-2xl shadow-sm space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#556B2F] text-white font-medium transition-colors">
                  <User className="w-5 h-5" /> Perfil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  <Package className="w-5 h-5" /> Mis Pedidos
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={() => navigate('/admin/ventas')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#C8A94B] hover:bg-[#C8A94B]/10 transition-colors font-medium border border-transparent hover:border-[#C8A94B]/30 mt-2"
                  >
                    <Database className="w-5 h-5" /> Gestión Inventario
                  </button>
                )}
                
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 mt-4 border-t border-gray-100 rounded-t-none transition-colors">
                  <LogOut className="w-5 h-5" /> Cerrar sesión
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm p-8 md:p-10">
              <h2 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-6 border-b pb-4">
                Información de Perfil
              </h2>

              {errorState && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                  {errorState}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[#374151] font-semibold">Nombre *</Label>
                    <Input 
                      name="nombre"
                      value={profileData?.nombre || ''} 
                      onChange={handleChange}
                      required
                      className="rounded-lg mt-1 border-gray-300 focus:border-[#C8A94B] focus:ring-[#C8A94B] text-gray-900" 
                    />
                  </div>
                  <div>
                    <Label className="text-[#374151] font-semibold">Apellidos</Label>
                    <Input 
                      name="apellidos"
                      value={profileData?.apellidos || ''} 
                      onChange={handleChange}
                      className="rounded-lg mt-1 border-gray-300 focus:border-[#C8A94B] focus:ring-[#C8A94B] text-gray-900" 
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#374151] font-semibold">Correo electrónico</Label>
                  <Input 
                    disabled 
                    value={profileData?.email || user?.email || ''} 
                    className="rounded-lg mt-1 bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" 
                  />
                  <p className="text-xs text-gray-400 mt-1">El correo electrónico no se puede cambiar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[#374151] font-semibold">Teléfono</Label>
                    <Input 
                      name="teléfono"
                      value={profileData?.teléfono || ''} 
                      onChange={handleChange}
                      className="rounded-lg mt-1 border-gray-300 focus:border-[#C8A94B] focus:ring-[#C8A94B] text-gray-900" 
                    />
                  </div>
                  <div>
                    <Label className="text-[#374151] font-semibold">Ciudad</Label>
                    <Input 
                      name="ciudad"
                      value={profileData?.ciudad || ''} 
                      onChange={handleChange}
                      className="rounded-lg mt-1 border-gray-300 focus:border-[#C8A94B] focus:ring-[#C8A94B] text-gray-900" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="bg-[#C8A94B] text-[#0B0B0B] font-bold hover:bg-[#C8A94B]/90 rounded-lg py-6 px-8 shadow-md hover:shadow-lg transition-all w-full md:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AccountPage;
