import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';
import ReproductiveDisclaimer from '@/components/ReproductiveDisclaimer';
import TermsCheckbox from '@/components/TermsCheckbox';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const itemCount = items?.length || 0;

  if (itemCount === 0) {
    return (
      <>
        <Helmet>
          <title>Carrito de Compras - Criadero Paso Real</title>
          <meta name="description" content="Tu carrito de compras está vacío. Explora nuestros productos y servicios." />
        </Helmet>

        <Header />

        <div className="min-h-screen premium-page-bg pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="font-playfair text-4xl font-bold text-[#0B0B0B] mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Explora nuestra selección de animales y servicios reproductivos.
            </p>
            <Button
              onClick={() => navigate('/venta')}
              className="bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-white font-bold rounded-lg px-8 py-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Explorar productos
            </Button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Carrito de Compras (${itemCount}) - Criadero Paso Real`}</title>
        <meta name="description" content={`Tienes ${itemCount} producto${itemCount !== 1 ? 's' : ''} en tu carrito de compras.`} />
      </Helmet>

      <Header />

      <div className="min-h-screen premium-page-bg pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-playfair text-5xl font-bold text-[#C8A94B] mb-12">
              Mi Carrito
            </h1>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}

                {/* Reproductive Disclaimer */}
                <div className="mt-8">
                  <ReproductiveDisclaimer />
                </div>

                {/* Terms Checkbox */}
                <div className="mt-6">
                  <TermsCheckbox 
                    isChecked={termsAccepted} 
                    onChange={setTermsAccepted} 
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <OrderSummary items={items} total={getTotal} />

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => navigate('/checkout')}
                    disabled={!termsAccepted || items.length === 0}
                    className="w-full bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-white font-bold rounded-lg py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceder al pago
                  </Button>

                  <Button
                    onClick={() => navigate('/venta')}
                    variant="outline"
                    className="w-full border-[#6B7280] text-[#6B7280] hover:bg-gray-50 font-medium rounded-lg py-6 text-lg"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Continuar comprando
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;