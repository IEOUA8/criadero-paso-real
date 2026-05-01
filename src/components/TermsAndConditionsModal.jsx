import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#0B0B0B] text-white">
            <h2 className="font-playfair text-2xl font-bold text-[#C8A94B]">
              Términos y Condiciones
            </h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body - Scrollable Content */}
          <div className="p-6 md:p-8 overflow-y-auto text-gray-700 space-y-6" style={{ lineHeight: '1.8' }}>
            
            {/* Section 1 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                1. Identificación del responsable
              </h3>
              <p className="text-sm md:text-base mb-3">
                <strong>Razón Social:</strong> Criadero Paso Real
              </p>
              <p className="text-sm md:text-base mb-3">
                <strong>Sitio web:</strong> www.criaderopasoreal.com
              </p>
              <p className="text-sm md:text-base mb-3">
                <strong>Correo electrónico de contacto:</strong> hola@criaderopasoreal.com
              </p>
              <p className="text-sm md:text-base">
                Criadero Paso Real es una marca dedicada a la crianza responsable del burro criollo colombiano de silla, bajo estándares de bienestar animal, selección genética y excelencia reproductiva.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                2. Objeto
              </h3>
              <p className="text-sm md:text-base mb-3">
                Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web www.criaderopasoreal.com, así como la adquisición de productos y servicios ofrecidos a través de esta plataforma.
              </p>
              <p className="text-sm md:text-base">
                Al utilizar este sitio web o realizar una compra, el usuario acepta de manera expresa e inequívoca los presentes Términos y Condiciones.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                3. Naturaleza de los servicios reproductivos
              </h3>
              <p className="text-sm md:text-base mb-3">
                Los servicios reproductivos que ofrece Criadero Paso Real (saltos, material genético, programas de reproducción) están sujetos a la biología natural de los animales, por lo que no pueden garantizarse resultados de preñez o nacimientos exitosos al 100%.
              </p>
              <p className="text-sm md:text-base mb-3">
                El cliente reconoce que contrata un servicio profesional, basado en trayectoria, buenas prácticas veterinarias y calidad genética, mas no un resultado específico garantizado.
              </p>
              <p className="text-sm md:text-base">
                Cualquier acuerdo de garantía o reposición debe estar explícitamente detallado por escrito en el contrato de servicio específico.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                4. Proceso de compra
              </h3>
              <p className="text-sm md:text-base mb-3">
                El usuario podrá adquirir productos y servicios directamente a través del sitio web o mediante coordinación directa con Criadero Paso Real.
              </p>
              <p className="text-sm md:text-base mb-3">
                Al formalizar la compra, el usuario recibirá:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base mb-3">
                <li>Confirmación del pedido vía correo electrónico</li>
                <li>Detalle del producto o servicio adquirido</li>
                <li>Condiciones específicas de entrega o ejecución</li>
                <li>Información de seguimiento (cuando aplique)</li>
              </ul>
              <p className="text-sm md:text-base">
                El usuario se compromete a proporcionar información veraz y actualizada durante el proceso de compra.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                5. Precios y pagos
              </h3>
              <p className="text-sm md:text-base mb-3">
                Todos los precios están expresados en pesos colombianos (COP) y pueden estar sujetos a cambios sin previo aviso.
              </p>
              <p className="text-sm md:text-base mb-3">
                Los métodos de pago aceptados incluyen:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base mb-3">
                <li>Transferencias bancarias</li>
                <li>Pasarelas de pago certificadas</li>
                <li>Acuerdos comerciales previamente coordinados</li>
              </ul>
              <p className="text-sm md:text-base">
                La disponibilidad del producto o servicio queda sujeta a la confirmación del pago.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                6. Condiciones de envío
              </h3>
              <p className="text-sm md:text-base mb-3">
                <strong>Servicios reproductivos:</strong> No implican envío tradicional. Se coordina directamente con el cliente según disponibilidad y naturaleza del servicio.
              </p>
              <p className="text-sm md:text-base mb-3">
                <strong>Productos físicos:</strong> Enviados a todo el territorio colombiano mediante transportadoras autorizadas. Tiempos de entrega:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base mb-3">
                <li>Ciudades principales: 2 a 5 días hábiles</li>
                <li>Zonas rurales o especiales: sujeto a operador logístico</li>
              </ul>
              <p className="text-sm md:text-base">
                Criadero Paso Real no se hace responsable por retrasos imputables a terceros (transportadoras, condiciones climáticas, fuerza mayor).
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                7. Política de garantías
              </h3>
              <p className="text-sm md:text-base mb-3">
                <strong>Servicios reproductivos:</strong> Respaldados por la trayectoria y seriedad del criadero. Cualquier garantía específica debe estar por escrito en el contrato de servicio.
              </p>
              <p className="text-sm md:text-base mb-3">
                <strong>Productos físicos:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base mb-3">
                <li>Garantía por defectos de fabricación</li>
                <li>Reposición en caso de daño comprobado durante el transporte</li>
                <li>Las reclamaciones deben realizarse dentro de las 48 horas posteriores a la recepción</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                8. Política de cancelaciones y devoluciones
              </h3>
              <p className="text-sm md:text-base mb-3">
                <strong>Servicios reproductivos:</strong> Dado su naturaleza biológica y coordinación personalizada, las cancelaciones deben comunicarse con al menos 72 horas de anticipación. Las devoluciones monetarias estarán sujetas a evaluación caso por caso.
              </p>
              <p className="text-sm md:text-base mb-3">
                <strong>Productos físicos:</strong> El cliente tiene derecho de retracto según la legislación colombiana, siempre que el producto no haya sido usado, esté en su empaque original y dentro del plazo legal establecido.
              </p>
              <p className="text-sm md:text-base">
                Las solicitudes de devolución deben realizarse al correo hola@criaderopasoreal.com, adjuntando evidencia fotográfica y número de pedido.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                9. Responsabilidad del usuario
              </h3>
              <p className="text-sm md:text-base mb-3">
                El usuario se compromete a:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base mb-3">
                <li>Utilizar el sitio web de manera lícita y conforme a estos Términos</li>
                <li>Proporcionar información veraz y actualizada</li>
                <li>No realizar actividades que puedan dañar, inutilizar o sobrecargar el sitio web</li>
                <li>Respetar los derechos de propiedad intelectual de Criadero Paso Real</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                10. Propiedad intelectual
              </h3>
              <p className="text-sm md:text-base mb-3">
                Todos los contenidos del sitio web (textos, imágenes, logotipos, videos, diseños, código fuente) son propiedad exclusiva de Criadero Paso Real o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual.
              </p>
              <p className="text-sm md:text-base">
                Queda prohibida la reproducción, distribución, modificación o uso comercial sin autorización expresa y por escrito.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                11. Protección de datos personales
              </h3>
              <p className="text-sm md:text-base mb-3">
                Criadero Paso Real se compromete a proteger la privacidad y confidencialidad de los datos personales de sus usuarios, conforme a la Ley 1581 de 2012 y demás normativa aplicable.
              </p>
              <p className="text-sm md:text-base">
                Para mayor información, consultar la Política de Privacidad disponible en el sitio web.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                12. Limitación de responsabilidad
              </h3>
              <p className="text-sm md:text-base mb-3">
                Criadero Paso Real no será responsable por:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base mb-3">
                <li>Daños derivados del uso indebido del sitio web</li>
                <li>Interrupciones del servicio por causas técnicas o de fuerza mayor</li>
                <li>Errores u omisiones en los contenidos del sitio</li>
                <li>Acciones de terceros (hackers, virus informáticos)</li>
              </ul>
            </div>

            {/* Section 13 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                13. Modificaciones
              </h3>
              <p className="text-sm md:text-base">
                Criadero Paso Real se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio web. Se recomienda a los usuarios revisar periódicamente estos términos.
              </p>
            </div>

            {/* Section 14 */}
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#C8A94B] mb-3">
                14. Legislación aplicable
              </h3>
              <p className="text-sm md:text-base mb-3">
                Estos Términos y Condiciones se rigen por la legislación de la República de Colombia.
              </p>
              <p className="text-sm md:text-base">
                Cualquier controversia será sometida a los tribunales competentes de Colombia.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <p className="text-sm md:text-base font-medium text-[#0B0B0B] mb-2">
                Para consultas o aclaraciones sobre estos Términos y Condiciones:
              </p>
              <p className="text-sm md:text-base text-gray-700">
                <strong>Correo:</strong> <a href="mailto:hola@criaderopasoreal.com" className="text-[#C8A94B] hover:underline">hola@criaderopasoreal.com</a>
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

export default TermsAndConditionsModal;
