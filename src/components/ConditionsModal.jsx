import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#0B0B0B] text-white">
            <h2 className="font-playfair text-2xl font-bold text-[#C8A94B]">
              Condiciones de Envío – Garantía de Compra
            </h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto text-[#0B0B0B] font-inter space-y-6">
            <p>
              En Criadero Paso Real cuidamos cada detalle para garantizar que nuestros servicios y productos lleguen de forma segura, clara y oportuna a cada cliente.
            </p>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Servicios de reproducción – Saltos de Candidato</h3>
              <p className="mb-2">
                Los servicios asociados a Candidato (saltos, material reproductivo o acuerdos de monta) no implican envío físico tradicional, sino un proceso coordinado y personalizado:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Coordinación directa con el cliente después de la compra</li>
                <li>Programación según disponibilidad reproductiva</li>
                <li>Acompañamiento técnico durante todo el proceso</li>
                <li>Posibilidad de envío de material (según modalidad acordada)</li>
                <li>Pago por colecta y envio, aparte del valor del costo del salto</li>
              </ul>
              <p>Cobertura: Nacional (Colombia) y procesos internacionales bajo coordinación previa.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Envío de productos físicos</h3>
              <p className="mb-2">Para productos del criadero (merchandising, dotación, gorras, textiles, galletas.):</p>
              <ul className="space-y-1 mb-2">
                <li>🚚 Envíos a todo Colombia</li>
                <li>📍 Entregas en ciudades principales entre 2 a 5 días hábiles</li>
                <li>📦 Zonas especiales o rurales: tiempos sujetos a operador logístico</li>
                <li>📩 Número de guía enviado al cliente para seguimiento</li>
              </ul>
              <p>Trabajamos con transportadoras confiables para asegurar la integridad de cada envío.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Compra Segura – Tu confianza es nuestra prioridad</h3>
              <p className="mb-2">
                En Criadero Paso Real entendemos que estás invirtiendo en genética, experiencia y marca. Por eso, garantizamos un proceso de compra transparente y seguro.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Métodos de pago seguros</h3>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Pasarelas de pago certificadas</li>
                <li>Transferencias bancarias verificadas</li>
                <li>Confirmación de pago antes de cualquier proceso</li>
              </ul>
              <p>Toda la información es manejada bajo estándares de seguridad digital.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Transparencia en cada compra</h3>
              <p className="mb-2">Al realizar tu compra recibirás:</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Confirmación inmediata del pedido</li>
                <li>Detalle del servicio o producto adquirido</li>
                <li>Condiciones específicas según el tipo de servicio (especialmente en reproducción)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Garantías – Respaldo Criadero Paso Real</h3>
            </div>

            <div>
              <h3 className="font-bold text-md mb-2">Servicios reproductivos</h3>
              <p className="mb-2">Nuestros servicios están respaldados por la seriedad y trayectoria del criadero.</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Acompañamiento durante el proceso</li>
                <li>Claridad en condiciones desde el inicio</li>
                <li>Soporte directo ante cualquier inquietud</li>
              </ul>
              <p>Cada caso es tratado de forma personalizada, entendiendo la naturaleza biológica del proceso.</p>
            </div>

            <div>
              <h3 className="font-bold text-md mb-2">Productos físicos</h3>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Garantía por defectos de fabricación</li>
                <li>Reposición en caso de daño comprobado en transporte</li>
                <li>Atención directa para soluciones ágiles</li>
              </ul>
              <p className="font-medium">
                Importante: cualquier novedad debe ser reportada dentro de las primeras 48 horas después de recibido el producto.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Compromiso Paso Real</h3>
              <p className="mb-2">Más que una compra, estás accediendo a una experiencia construida con:</p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Selección genética</li>
                <li>Trayectoria en el mundo equino</li>
                <li>Estándares de calidad en cada detalle</li>
              </ul>
              <p>
                Nuestro objetivo es que cada cliente sienta respaldo, confianza y orgullo de hacer parte de la familia Paso Real.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-[#C8A94B]">Soporte y contacto</h3>
              <p>
                Si tienes dudas sobre envíos, disponibilidad o condiciones. Escríbenos directamente:{' '}
                <a href="mailto:hola@criaderopasoreal.com" className="text-[#C8A94B] hover:underline">
                  hola@criaderopasoreal.com
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <Button
              onClick={onClose}
              className="px-8"
            >
              Cerrar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConditionsModal;
