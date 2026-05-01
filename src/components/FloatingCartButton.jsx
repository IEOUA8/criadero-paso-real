import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const FloatingCartButton = ({ onClick }) => {
  const { cartCount } = useCart();

  if (cartCount === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-[#C8A94B] text-[#0B0B0B] p-4 rounded-full shadow-2xl hover:shadow-[#C8A94B]/50 transition-shadow duration-300"
      title="Ver carrito"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </div>
    </motion.button>
  );
};

export default FloatingCartButton;