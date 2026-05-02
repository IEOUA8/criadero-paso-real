import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Camera, Save, Lock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { getSiteUrl } from '@/lib/siteUrl';

const AdminProfile = () => {
  const { currentUser, user, updateProfile } = useAuth();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || '',
    apellidos: currentUser?.apellidos || '',
    teléfono: currentUser?.teléfono || '',
    ciudad: currentUser?.ciudad || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.nombre.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre es obligatorio.",
      });
      setLoading(false);
      return;
    }

    if (formData.teléfono && !validatePhone(formData.teléfono)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El teléfono debe tener 10 dígitos.",
      });
      setLoading(false);
      return;
    }

    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todos los campos de contraseña son obligatorios.",
      });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La nueva contraseña debe tener al menos 8 caracteres.",
      });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Las contraseñas no coinciden.",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente.",
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    toast({
      title: "🚧 Función en desarrollo",
      description: "La carga de fotos estará disponible próximamente.",
    });
  };

  const getInitials = () => {
    if (!currentUser?.nombre) return 'U';
    const names = currentUser.nombre.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.nombre.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Mi Perfil - Admin | Criadero Paso Real</title>
        <meta name="description" content="Gestiona tu perfil de administrador" />
        <link rel="canonical" href={`${siteUrl}/admin/perfil`} />
        <meta property="og:url" content={`${siteUrl}/admin/perfil`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">Gestiona tu información personal y configuración</p>
        </div>

        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-playfair">Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-[#C8A94B]">
                <AvatarImage src={currentUser?.foto_perfil} alt={currentUser?.nombre} />
                <AvatarFallback className="bg-[#C8A94B] text-white font-bold text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <Button onClick={handlePhotoUpload} className="bg-[#C8A94B] hover:bg-[#B8941B]">
                  <Camera className="w-4 h-4 mr-2" />
                  Cambiar Foto
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Formatos aceptados: JPG, PNG. Tamaño máximo: 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-playfair">Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Tu nombre"
                    required
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    placeholder="Tus apellidos"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teléfono">Teléfono</Label>
                  <Input
                    id="teléfono"
                    name="teléfono"
                    value={formData.teléfono}
                    onChange={handleInputChange}
                    placeholder="3001234567"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    placeholder="Tu ciudad"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Solo lectura)</Label>
                  <Input
                    id="email"
                    name="email"
                    value={user?.email || ''}
                    disabled
                    className="admin-input bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rol">Rol (Solo lectura)</Label>
                  <Input
                    id="rol"
                    name="rol"
                    value={currentUser?.rol === 'admin' ? 'Administrador' : currentUser?.rol || 'Usuario'}
                    disabled
                    className="admin-input bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="admin-button admin-button-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-playfair">Cambiar Contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual *</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña * (mínimo 8 caracteres)</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="admin-button admin-button-secondary"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {passwordLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
