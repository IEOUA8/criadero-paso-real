import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const FloatingCartPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate('/carrito');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/venta');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#C8A94B]" />
                Tu carrito
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
                  <Button 
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="border-[#C8A94B] text-[#C8A94B] hover:bg-[#C8A94B] hover:text-white mt-4"
                  >
                    Explorar productos
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id || item.product_id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#C8A94B]/30 transition-colors shadow-sm"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.products?.imagen_url || item.products?.fotos?.[0] ? (
                          <img 
                            src={item.products.imagen_url || item.products.fotos[0]} 
                            alt={item.products.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-[#0B0B0B] line-clamp-2 text-sm">
                            {item.products?.nombre}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id || item.product_id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-[#C8A94B] font-bold text-sm">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.products?.precio || 0)}
                          </p>
                          
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                            <button
                              onClick={() => updateQuantity(item.id || item.product_id, Math.max(1, item.cantidad - 1))}
                              className="p-1 hover:bg-white rounded shadow-sm text-gray-500 hover:text-[#0B0B0B] transition-colors"
                              disabled={item.cantidad <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.id || item.product_id, item.cantidad + 1)}
                              className="p-1 hover:bg-white rounded shadow-sm text-gray-500 hover:text-[#0B0B0B] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#0B0B0B] pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#C8A94B]">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cartTotal)}
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Ir al carrito
                  </Button>
                  <Button 
                    onClick={handleContinueShopping}
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-[#0B0B0B]"
                  >
                    Agregar más productos
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartPanel;