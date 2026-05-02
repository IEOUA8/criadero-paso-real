import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { DEFAULT_ROLE } from '@/constants/roles';
import { getSiteUrl } from '@/lib/siteUrl';

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    ciudad: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState('');
  const siteUrl = getSiteUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorState('');

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // Create user profile with lowercase 'user' role
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            teléfono: formData.telefono,
            ciudad: formData.ciudad,
            rol: DEFAULT_ROLE // lowercase 'user'
          }]);

        if (profileError) throw profileError;

        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada. Por favor revisa tu correo para confirmar.",
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrorState(err.message || 'Error al crear la cuenta');
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: err.message || 'Hubo un problema al crear tu cuenta.',
      });
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
        <title>Crear Cuenta - Criadero Paso Real</title>
        <meta name="description" content="Crea tu cuenta en Criadero Paso Real para acceder a todas las funcionalidades." />
        <link rel="canonical" href={`${siteUrl}/signup`} />
        <meta property="og:url" content={`${siteUrl}/signup`} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen premium-page-bg pt-32 pb-16 flex items-center justify-center">
        <div className="w-full max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-[#0B0B0B] text-center pb-8 pt-10 rounded-t-xl">
                <CardTitle className="font-playfair text-[32px] text-[#C8A94B] mb-2">
                  Crear Cuenta
                </CardTitle>
                <CardDescription className="text-gray-400 font-inter text-sm">
                  Únete a la comunidad de Criadero Paso Real
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {errorState && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {errorState}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-[#374151] font-semibold">Nombre *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-gray-900"
                        placeholder="Juan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos" className="text-[#374151] font-semibold">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-gray-900"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#374151] font-semibold">Correo electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-gray-900"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#374151] font-semibold">Contraseña *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-gray-900"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-[#374151] font-semibold">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-gray-900"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ciudad" className="text-[#374151] font-semibold">Ciudad</Label>
                      <Input
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        className="border-gray-300 focus:ring-[#C8A94B] focus:border-[#C8A94B] text-gray-900"
                        placeholder="Medellín"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all rounded-lg mt-4"
                  >
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>
                </form>
                
                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 font-inter">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-[#C8A94B] hover:underline font-semibold"
                    >
                      Inicia sesión aquí
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

export default SignupPage;
