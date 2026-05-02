import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DEFAULT_ROLE } from '@/constants/roles';
import { getSiteUrl } from '@/lib/siteUrl';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState('');
  const siteUrl = getSiteUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorState('');

    try {
      // Authenticate user
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        setErrorState(error.message);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setErrorState('Error al iniciar sesión. Por favor, intenta de nuevo.');
        setLoading(false);
        return;
      }

      // Fetch user profile and role from user_profiles table
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setErrorState('Error al cargar el perfil de usuario.');
        setLoading(false);
        return;
      }

      // If no profile exists, create default profile
      if (!profile) {
        const defaultProfile = {
          id: data.user.id,
          nombre: data.user.email?.split('@')[0] || 'Usuario',
          apellidos: '',
          teléfono: '',
          ciudad: '',
          rol: DEFAULT_ROLE
        };

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([defaultProfile]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          setErrorState('Error al crear el perfil de usuario.');
          setLoading(false);
          return;
        }

        // Default role is 'user', redirect to account page
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        navigate('/cuenta');
        return;
      }

      // Role-based redirection
      const userRole = profile.rol?.toLowerCase();

      if (userRole === 'admin') {
        toast({
          title: "¡Bienvenido, Administrador!",
          description: "Redirigiendo al panel de administración...",
        });
        
        // Check if there's a "from" location to return to
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        
        // Redirect to user account or previous location
        const from = location.state?.from?.pathname || '/cuenta';
        navigate(from, { replace: true });
      }

    } catch (err) {
      console.error('Login error:', err);
      setErrorState(err.message || 'Error inesperado al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Criadero Paso Real</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Criadero Paso Real." />
        <link rel="canonical" href={`${siteUrl}/login`} />
        <meta property="og:url" content={`${siteUrl}/login`} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen premium-page-bg pt-32 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-[#0B0B0B] text-center pb-8 pt-10 rounded-t-xl">
                <CardTitle className="font-playfair text-[32px] text-[#C8A94B] mb-2">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-gray-400 font-inter text-sm">
                  Accede a tu cuenta de Criadero Paso Real
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {errorState && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {errorState}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#374151] font-semibold">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-[#0B0B0B]"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#374151] font-semibold">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-[#0B0B0B]"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all rounded-lg mt-4"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner className="w-5 h-5" />
                        <span>Ingresando...</span>
                      </div>
                    ) : (
                      'Ingresar'
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 font-inter">
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => navigate('/signup')}
                      className="text-[#C8A94B] hover:text-[#B8941B] font-semibold transition-smooth"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default LoginPage;
