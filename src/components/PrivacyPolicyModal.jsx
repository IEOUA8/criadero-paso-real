import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#0B0B0B] text-white">
            <h2 className="font-playfair text-2xl font-bold text-[#C8A94B]">
              Política de Privacidad
            </h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto text-[#0B0B0B] font-inter space-y-6">
            <p>
              En Criadero Paso Real protegemos tu información personal y la usamos únicamente
              para gestionar tu cuenta, responder tus solicitudes y procesar pedidos.
            </p>
            <p>
              Los datos que ingresas en formularios de contacto, registro y compra se
              almacenan de forma segura y no se comparten con terceros fuera de los
              servicios necesarios para operar la plataforma.
            </p>
            <p>
              Si deseas actualizar, corregir o eliminar tus datos, puedes solicitarlo
              a través de nuestros canales oficiales de contacto.
            </p>
            <p>
              Esta política puede actualizarse periódicamente para reflejar mejoras
              de seguridad o cambios normativos.
            </p>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <Button onClick={onClose} className="px-8">
              Cerrar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;
