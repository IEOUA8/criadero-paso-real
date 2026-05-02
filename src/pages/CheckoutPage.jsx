import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeOrderStatus } from '@/lib/orderStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSummary from '@/components/OrderSummary';
import ReproductiveDisclaimer from '@/components/ReproductiveDisclaimer';
import TermsCheckbox from '@/components/TermsCheckbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSiteUrl } from '@/lib/siteUrl';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: user?.email || '',
    telefono: '',
    ciudad: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});

  const safeNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const createOrderWithFallbacks = async (basePayload) => {
    const attempts = [
      {
        user_id: basePayload.user_id,
        total: basePayload.total,
        estado: basePayload.estado,
        comprador_nombre: basePayload.comprador_nombre,
        comprador_email: basePayload.comprador_email,
        comprador_teléfono: basePayload.comprador_teléfono,
        ciudad: basePayload.ciudad,
        dirección: basePayload.direccion,
        teléfono: basePayload.telefono,
      },
      {
        user_id: basePayload.user_id,
        total: basePayload.total,
        estado: basePayload.estado,
        comprador_nombre: basePayload.comprador_nombre,
        comprador_email: basePayload.comprador_email,
        comprador_teléfono: basePayload.comprador_teléfono,
        ciudad: basePayload.ciudad,
        direccion: basePayload.direccion,
        telefono: basePayload.telefono,
      },
      {
        user_id: basePayload.user_id,
        total: basePayload.total,
        estado: basePayload.estado,
        comprador_nombre: basePayload.comprador_nombre,
        comprador_email: basePayload.comprador_email,
        comprador_teléfono: basePayload.comprador_teléfono,
        ciudad: basePayload.ciudad,
      },
    ];

    let lastError = null;
    for (const payload of attempts) {
      const { data, error } = await supabase
        .from('orders')
        .insert(payload)
        .select()
        .single();

      if (!error && data) return data;
      lastError = error;
    }

    throw lastError || new Error('No se pudo crear la orden');
  };

  const createOrderItemsWithFallbacks = async (orderId) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const primaryPayload = items.map((item) => ({
      order_id: orderId,
      product_id: uuidRegex.test(String(item.id)) ? item.id : null,
      cantidad: item.cantidad,
      precio: safeNumber(item.precio),
    }));

    const secondaryPayload = items.map((item) => ({
      order_id: orderId,
      cantidad: item.cantidad,
      precio: safeNumber(item.precio),
    }));

    const firstTry = await supabase.from('order_items').insert(primaryPayload);
    if (!firstTry.error) return;

    const secondTry = await supabase.from('order_items').insert(secondaryPayload);
    if (!secondTry.error) return;

    throw secondTry.error || firstTry.error || new Error('No se pudieron guardar los ítems de la orden');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar.",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Términos no aceptados",
        description: "Debes aceptar los términos y condiciones para continuar.",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrito vacío",
        description: "No hay productos en tu carrito.",
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Inicia sesión para continuar",
        description: "Debes iniciar sesión para registrar el pedido y continuar con la compra.",
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setLoading(true);

    try {
      const totalAmount = safeNumber(getTotal);
      const normalizedStatus = normalizeOrderStatus('pending');

      const orderPayload = {
        user_id: user.id,
        total: totalAmount,
        estado: normalizedStatus,
        comprador_nombre: `${formData.nombre} ${formData.apellidos}`.trim(),
        comprador_email: formData.email.trim(),
        comprador_teléfono: formData.telefono.trim(),
        ciudad: formData.ciudad.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
      };

      const orderData = await createOrderWithFallbacks(orderPayload);

      console.log('Order created:', orderData);

      await createOrderItemsWithFallbacks(orderData.id);

      // Clear cart
      clearCart();

      toast({
        title: "¡Compra exitosa!",
        description: "Tu pedido ha sido procesado. Recibirás un correo con los detalles.",
      });

      // Redirect to account page or success page
      setTimeout(() => {
        navigate('/cuenta');
      }, 1500);

    } catch (error) {
      console.error('Checkout error:', error);
      const rlsError = String(error?.message || '').toLowerCase().includes('row-level security');
      toast({
        variant: "destructive",
        title: "Error al procesar la compra",
        description: rlsError
          ? "Tu usuario no tiene permisos para crear pedidos en Supabase. Revisa políticas RLS de orders/order_items."
          : (error.message || "Hubo un problema al procesar tu pedido. Por favor intenta nuevamente."),
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Finalizar Compra - Criadero Paso Real</title>
          <meta name="description" content="Completa tu compra de forma segura en Criadero Paso Real." />
          <link rel="canonical" href={`${siteUrl}/checkout`} />
          <meta property="og:url" content={`${siteUrl}/checkout`} />
          <meta property="og:type" content="website" />
        </Helmet>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center premium-page-bg pt-32 pb-16">
          <h2 className="font-playfair text-3xl font-bold mb-4 text-[#0B0B0B]">No hay productos para pagar</h2>
          <Button onClick={() => navigate('/venta')} className="bg-[#C8A94B] rounded-lg text-white font-bold px-8 py-6">
            Volver a la tienda
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Finalizar Compra - Criadero Paso Real</title>
        <meta name="description" content="Completa tu compra de forma segura en Criadero Paso Real." />
        <link rel="canonical" href={`${siteUrl}/checkout`} />
        <meta property="og:url" content={`${siteUrl}/checkout`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <div className="min-h-screen premium-page-bg pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-playfair text-5xl font-bold text-[#C8A94B] mb-12">
              Finalizar Compra
            </h1>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm space-y-8">
                  <div>
                    <h2 className="font-inter text-xl font-bold text-[#0B0B0B] mb-6 border-b pb-3">
                      Información de comprador
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div>
                        <Label htmlFor="nombre" className="font-medium">
                          Nombre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="mt-2 text-gray-900"
                          placeholder="Juan"
                        />
                        {errors.nombre && (
                          <p className="text-[#EF4444] text-sm mt-1">{errors.nombre}</p>
                        )}
                      </div>

                      {/* Apellidos */}
                      <div>
                        <Label htmlFor="apellidos" className="font-medium">
                          Apellidos <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="apellidos"
                          name="apellidos"
                          value={formData.apellidos}
                          onChange={handleChange}
                          className="mt-2 text-gray-900"
                          placeholder="Pérez García"
                        />
                        {errors.apellidos && (
                          <p className="text-[#EF4444] text-sm mt-1">{errors.apellidos}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="font-medium">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-2 text-gray-900"
                          placeholder="juan@ejemplo.com"
                        />
                        {errors.email && (
                          <p className="text-[#EF4444] text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div>
                        <Label htmlFor="telefono" className="font-medium">
                          Teléfono <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="mt-2 text-gray-900"
                          placeholder="+57 300 123 4567"
                        />
                        {errors.telefono && (
                          <p className="text-[#EF4444] text-sm mt-1">{errors.telefono}</p>
                        )}
                      </div>

                      {/* Ciudad */}
                      <div>
                        <Label htmlFor="ciudad" className="font-medium">
                          Ciudad <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="ciudad"
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleChange}
                          className="mt-2 text-gray-900"
                          placeholder="Medellín"
                        />
                        {errors.ciudad && (
                          <p className="text-[#EF4444] text-sm mt-1">{errors.ciudad}</p>
                        )}
                      </div>

                      {/* Dirección */}
                      <div>
                        <Label htmlFor="direccion" className="font-medium">
                          Dirección <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          className="mt-2 text-gray-900"
                          placeholder="Calle 123 #45-67"
                        />
                        {errors.direccion && (
                          <p className="text-[#EF4444] text-sm mt-1">{errors.direccion}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reproductive Disclaimer */}
                  <ReproductiveDisclaimer />

                  {/* Terms Checkbox */}
                  <TermsCheckbox 
                    isChecked={termsAccepted} 
                    onChange={setTermsAccepted} 
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={() => navigate('/carrito')}
                      variant="outline"
                      className="flex-1 border-[#6B7280] text-[#6B7280] hover:bg-gray-50 font-medium rounded-lg py-6 text-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Volver al carrito
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading || !termsAccepted}
                      className="flex-1 bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-white font-bold rounded-lg py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Procesando...' : 'Completar compra'}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <OrderSummary items={items} total={getTotal} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
