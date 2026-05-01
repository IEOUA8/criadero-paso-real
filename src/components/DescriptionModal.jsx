import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DescriptionModal = ({ isOpen, onClose, animal }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!animal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="glass-modal w-full max-w-[600px] max-h-[80vh] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="font-inter text-xl font-bold text-white">
                  Descripción Completa
                </h2>
                <button
                  onClick={onClose}
                  className="text-[#C8A94B] hover:text-[#B8941B] transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] scrollbar-hide">
                <h3 className="font-playfair text-2xl font-bold text-white mb-4">
                  {animal.nombre}
                </h3>
                <p className="font-inter text-base text-white/90 leading-relaxed whitespace-pre-line">
                  {animal.descripcionCompleta || animal.descripcionDetallada || animal.descripcion}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/20">
                <Button
                  onClick={onClose}
                  className="w-full bg-[#6B7280] hover:bg-[#6B7280]/90 text-white font-bold rounded-lg py-3"
                >
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DescriptionModal;