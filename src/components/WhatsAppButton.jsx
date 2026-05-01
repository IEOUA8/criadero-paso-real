import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/573208909198"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-smooth group animate-pulse-gentle"
      aria-label="Contáctenos por WhatsApp"
      title="Contáctenos por WhatsApp"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      
      {/* Tooltip - Desktop only */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#0B0B0B] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-smooth whitespace-nowrap pointer-events-none hidden md:block shadow-lg">
        Contáctenos por WhatsApp
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;