import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';

const FAQPage = () => {
  const [isMainAccordionOpen, setIsMainAccordionOpen] = useState(true);

  const burrosCriollosFaqs = [
    {
      question: '¿Qué es un burro criollo colombiano de silla?',
      answer: 'Es una raza autóctona colombiana, catalogada como patrimonio cultural de la nación, criada tradicionalmente para la silla de montar. Se caracteriza por su trote fino, resistencia, docilidad y adaptación al trópico colombiano.'
    },
    {
      question: '¿Cuál es la diferencia entre un burro criollo y otras razas?',
      answer: 'El burro criollo colombiano destaca por su trote suave y cómodo (paso fino), temperamento noble, alzada media (120-140 cm), y una genética adaptada a climas tropicales. Además, tiene un reconocimiento cultural e histórico único en Colombia.'
    },
    {
      question: '¿Los burros criollos son aptos para personas sin experiencia?',
      answer: 'Sí. Su carácter dócil y tranquilo los hace ideales para principiantes, niños y jinetes recreativos. Sin embargo, siempre recomendamos asesoría y entrenamiento básico.'
    },
    {
      question: '¿Qué documentación entrega el criadero al comprar un burro?',
      answer: 'Se entrega: certificado de origen genético, documentación de trazabilidad, historial veterinario completo (vacunas, desparasitaciones), certificado de movilización del ICA, y contrato de compra con garantía escrita.'
    },
    {
      question: '¿Cuál es el rango de precios de un burro criollo en Paso Real?',
      answer: 'Los precios varían según edad, sexo, entrenamiento, línea genética y condición morfológica. Un animal joven puede partir desde $2.500.000 COP, mientras que ejemplares con pedigree superior y entrenamiento avanzado pueden superar los $10.000.000 COP.'
    },
    {
      question: '¿Puedo visitar el criadero antes de comprar?',
      answer: 'Sí, las visitas son bienvenidas con cita previa. Durante la visita podrás conocer nuestras instalaciones, ver los animales en libertad, recibir asesoría técnica y evaluar personalmente el ejemplar que te interesa.'
    },
    {
      question: '¿Ofrecen financiación para la compra de burros?',
      answer: 'Sí, ofrecemos planes de pago acordados según el monto de compra y perfil del cliente. Consulta nuestras opciones de financiación directa o con aliados bancarios.'
    },
    {
      question: '¿Cómo se transporta un burro comprado fuera de la región?',
      answer: 'Coordinamos el transporte con empresas especializadas certificadas en transporte de équidos. El vehículo cumple normas de bienestar animal, incluye compartimentos individuales, ventilación, y seguimiento GPS.'
    },
    {
      question: '¿Los burros criollos requieren cuidados especiales?',
      answer: 'No requieren cuidados extremos, pero sí atención básica: vacunación semestral, desparasitación trimestral, herraje cada 6-8 semanas (si se monta), alimentación balanceada, y revisión dental anual.'
    },
    {
      question: '¿Qué garantía tiene la compra de un burro criollo?',
      answer: 'Garantizamos la autenticidad genética del animal, su salud certificada al momento de la entrega, y un periodo de garantía de 30 días contra vicios ocultos. Además, ofrecemos asesoría post-venta de por vida.'
    },
    {
      question: '¿Los burros criollos pueden vivir en clima frío?',
      answer: 'Aunque están adaptados al trópico, pueden vivir en climas templados y fríos con adecuación del ambiente (cobertizos, alimentación reforzada). No recomendamos alturas extremas sin supervisión veterinaria.'
    },
    {
      question: '¿Se pueden entrenar para trabajos específicos (carga, paseos, terapia)?',
      answer: 'Sí, son versátiles. Se pueden entrenar para silla de paseo, trabajo agrícola ligero, terapias ecuestres (equinoterapia), y actividades recreativas. Su temperamento facilita el entrenamiento.'
    }
  ];

  const burrasReproductorasFaqs = [
    {
      question: '¿Qué características debe tener una burra reproductora de calidad?',
      answer: 'Una burra reproductora superior debe tener: conformación morfológica correcta, línea genética certificada, historial reproductivo comprobado, edad reproductiva óptima (3-12 años), salud reproductiva certificada, y temperamento equilibrado.'
    },
    {
      question: '¿A qué edad puede comenzar a reproducirse una burra?',
      answer: 'Las burras alcanzan madurez sexual entre 12-24 meses, pero recomendamos la primera monta o inseminación a partir de los 3 años, cuando su desarrollo físico y reproductivo está completo.'
    },
    {
      question: '¿Cuántas crías puede tener una burra en su vida reproductiva?',
      answer: 'Una burra bien cuidada puede reproducirse hasta los 15-18 años de edad, con un intervalo de 12-13 meses entre partos. En promedio, puede tener entre 8-12 crías durante su vida reproductiva.'
    },
    {
      question: '¿Cuánto dura la gestación de una burra?',
      answer: 'La gestación de una burra dura aproximadamente 12 meses (365 días), pudiendo variar entre 360-375 días. Es importante el seguimiento veterinario durante todo el proceso.'
    },
    {
      question: '¿Qué incluye el precio de una burra reproductora?',
      answer: 'El precio incluye: certificado genético, historial reproductivo completo, certificado veterinario de salud reproductiva, vacunaciones al día, desparasitación reciente, certificado de movilización ICA, y garantía escrita de fertilidad.'
    },
    {
      question: '¿Ofrecen servicios de inseminación artificial?',
      answer: 'Sí, ofrecemos servicio de inseminación artificial con semen fresco refrigerado de nuestros reproductores elite. Incluye protocolo de sincronización, seguimiento ecográfico, y garantía de preñez.'
    },
    {
      question: '¿Qué garantía tiene la compra de una burra reproductora?',
      answer: 'Garantizamos la fertilidad certificada del animal mediante examen reproductivo veterinario, salud general certificada, y garantía de 60 días contra vicios ocultos reproductivos. Si la burra no queda preñada en dos ciclos consecutivos bajo manejo adecuado, se evalúa reposición.'
    },
    {
      question: '¿Puedo comprar una burra preñada?',
      answer: 'Sí, ocasionalmente tenemos burras preñadas disponibles. El precio es superior y se certifica la gestación mediante ecografía. Se entrega con seguimiento veterinario completo.'
    },
    {
      question: '¿Cómo se maneja el parto de una burra?',
      answer: 'El parto debe ser supervisado por personal capacitado o veterinario. Ofrecemos asesoría técnica 24/7 durante el periodo de gestación y parto para nuestros clientes.'
    },
    {
      question: '¿Las burras reproductoras requieren alimentación especial?',
      answer: 'Sí, especialmente durante gestación y lactancia. Recomendamos suplementación proteica, minerales específicos (calcio, fósforo), y forraje de calidad superior. Proporcionamos plan nutricional personalizado con la compra.'
    }
  ];

  const pollinosFaqs = [
    {
      question: '¿A qué edad se desteta un pollino o pollina?',
      answer: 'El destete se realiza entre los 6-8 meses de edad, cuando el potrillo ya consume alimento sólido de forma independiente y su sistema digestivo está desarrollado.'
    },
    {
      question: '¿Puedo comprar un pollino recién nacido?',
      answer: 'No recomendamos separar pollinos antes de los 6 meses. La lactancia materna es crucial para su desarrollo inmunológico, nutricional y conductual. Ofrecemos pollinos destetados a partir de los 6 meses.'
    },
    {
      question: '¿Cuál es el precio de un pollino?',
      answer: 'Los pollinos destetados (6-12 meses) tienen un precio desde $1.800.000 COP, dependiendo de su genética, conformación, sexo y línea de sangre. Los pollinos de líneas elite pueden alcanzar precios superiores.'
    },
    {
      question: '¿Qué cuidados especiales requiere un pollino?',
      answer: 'Los pollinos requieren: vacunación completa según edad, desparasitación trimestral, alimentación balanceada con concentrado juvenil, socialización temprana, espacios amplios para ejercicio, y revisión veterinaria mensual.'
    },
    {
      question: '¿A qué edad se puede comenzar a entrenar un pollino?',
      answer: 'El entrenamiento básico de manejo (cabezada, cepillado, levantamiento de patas) comienza desde los 6 meses. La doma formal para silla se inicia a partir de los 2.5-3 años, cuando su estructura ósea está consolidada.'
    },
    {
      question: '¿Es mejor comprar un pollino o un animal adulto?',
      answer: 'Depende del objetivo. Comprar un pollino permite formarlo según tus necesidades y crear vínculo desde joven, pero requiere paciencia y entrenamiento. Un adulto entrenado está listo para montar de inmediato.'
    },
    {
      question: '¿Los pollinos se entregan con certificado de nacimiento?',
      answer: 'Sí, todos nuestros pollinos se entregan con certificado de nacimiento que incluye: fecha de parto, identificación de padre y madre, registro genealógico, y marca de hierro del criadero.'
    },
    {
      question: '¿Puedo reservar un pollino antes de que nazca?',
      answer: 'Sí, aceptamos reservas de pollinos por nacer de burras gestantes mediante pago de anticipo del 30%. Una vez nacido, se confirma sexo y características, y se completa el pago antes de la entrega (6 meses mínimo).'
    }
  ];

  const geneticaMulasFaqs = [
    {
      question: '¿Qué es una mula y cómo se produce?',
      answer: 'Una mula es el híbrido resultante del cruce entre un burro (macho) y una yegua (hembra). Hereda la resistencia y rusticidad del burro, con el tamaño y fuerza del caballo. Son estériles debido a su carga cromosómica impar.'
    },
    {
      question: '¿Venden mulas en el criadero?',
      answer: 'No producimos mulas directamente, pero ofrecemos servicio de salto de nuestros reproductores burros criollos de élite para yeguas, específicamente orientado a la producción de mulas de trabajo y silla de alta calidad.'
    },
    {
      question: '¿Qué ventajas tiene una mula sobre un caballo o burro?',
      answer: 'Las mulas combinan lo mejor de ambos: resistencia superior a caballos, menor mantenimiento, mayor longevidad (25-30 años productivos), menor consumo de alimento, patas más fuertes, carácter equilibrado, y mejor adaptación a terrenos difíciles.'
    },
    {
      question: '¿Qué tipo de burro es mejor para producir mulas de calidad?',
      answer: 'Los burros criollos colombianos de silla, como nuestros reproductores, son ideales para mulas de silla y trabajo fino. Su trote cómodo y conformación armónica se transmiten a las mulas. Para mulas de carga pesada, se usan burros de mayor alzada.'
    },
    {
      question: '¿Cuál es el precio de un salto para producir mulas?',
      answer: 'El salto de nuestros reproductores elite tiene un precio desde $400.000 COP, con garantía de fertilidad. Incluye certificado genético del reproductor, asesoría técnica en el proceso de monta o inseminación, y seguimiento.'
    },
    {
      question: '¿Las mulas heredan el paso fino del burro criollo?',
      answer: 'Sí, las mulas producto de burros criollos de paso fino tienden a heredar su trote suave y cómodo, lo que las hace muy apreciadas para silla de paseo y trabajo rural ligero.'
    },
    {
      question: '¿Qué documentación se entrega al comprar un salto para mulas?',
      answer: 'Se entrega: contrato de salto con garantía de fertilidad, certificado genealógico del reproductor burro, protocolo veterinario recomendado para la yegua, y seguimiento técnico post-servicio.'
    },
    {
      question: '¿Cómo se realiza el servicio de salto para mulas?',
      answer: 'Ofrecemos dos modalidades: 1) Monta natural directa en nuestras instalaciones, 2) Inseminación artificial con semen fresco refrigerado enviado a la ubicación de la yegua. Ambas con protocolo veterinario y garantía de preñez.'
    },
    {
      question: '¿Las mulas de burro criollo son aptas para cabalgatas turísticas?',
      answer: 'Absolutamente. Son ideales para ecoturismo y cabalgatas por su resistencia, paso cómodo, seguridad en terrenos montañosos, y temperamento equilibrado. Son muy valoradas en zonas cafeteras y ecoturísticas de Colombia.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes - Criadero Paso Real</title>
        <meta name="description" content="Encuentra respuestas sobre burros criollos colombianos, burras reproductoras, pollinos y genética para producción de mulas. Proceso de compra paso a paso." />
      </Helmet>

      <Header />

      <div className="min-h-screen premium-page-bg pt-[86px] md:pt-[90px] max-[389px]:pt-[82px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 max-[389px]:px-3">
          {/* Header */}
          <div className="text-center faq-header-padding premium-glass rounded-3xl p-6 md:p-10 mb-8 md:mb-10 max-[389px]:rounded-2xl max-[389px]:p-4">
            <p className="premium-kicker mb-3 max-[389px]:text-[10px] max-[389px]:tracking-[0.09em]">Centro de ayuda</p>
            <h1 className="premium-title text-2xl md:text-4xl lg:text-5xl font-bold mb-4 max-[389px]:text-[1.55rem]">
              Preguntas Frecuentes
            </h1>
            <p className="premium-description text-justify-desktop text-base md:text-lg max-w-3xl mx-auto max-[389px]:text-[0.95rem]" style={{ lineHeight: '1.8' }}>
              Todo lo que necesitas saber sobre nuestro criadero, procesos de compra, burros criollos colombianos, burras reproductoras y genética para producción de mulas.
            </p>
          </div>

          {/* Main Accordion - How to Buy */}
          <div className="mb-12 md:mb-16">
            <div className="glass-card rounded-2xl p-4 md:p-6 max-[389px]:p-3.5">
              <button
                onClick={() => setIsMainAccordionOpen(!isMainAccordionOpen)}
                className="w-full flex items-start justify-between gap-4 text-left hover:bg-white/70 rounded-xl transition-accordion cursor-pointer p-2"
              >
                <h2 className="font-playfair text-xl md:text-3xl font-bold text-[#0B0B0B] flex-1 max-[389px]:text-[1.2rem]">
                  ¿Cómo comprar? – Paso a paso
                </h2>
                <motion.div
                  animate={{ rotate: isMainAccordionOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 mt-1"
                >
                  <ChevronDown className="w-6 h-6 text-[#C8A94B]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isMainAccordionOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="space-y-4" style={{ lineHeight: '1.8' }}>
                      <p className="text-[#374151] text-sm md:text-base">
                        <strong>Proceso claro, seguro y acompañado</strong> para adquirir burros criollos, burras reproductoras, caballos y crías en el Criadero Paso Real.
                      </p>

                      <p className="text-[#374151] text-sm md:text-base">
                        En Criadero Paso Real entendemos que adquirir un animal de raza es una decisión importante, tanto emocional como económicamente. Por eso, hemos diseñado un proceso de compra estructurado, transparente y profesional, que garantiza tu satisfacción y el bienestar del animal desde el primer contacto hasta su entrega final.
                      </p>

                      {/* Step 1 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          1) Contacto inicial
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base">
                          El proceso inicia cuando nos contactas a través de nuestro sitio web, WhatsApp, correo electrónico o redes sociales. En esta primera interacción, te solicitaremos información básica sobre tus necesidades: tipo de animal que buscas (burro criollo, burra reproductora, pollino), uso previsto (silla, reproducción, trabajo), experiencia previa con equinos, ubicación geográfica y presupuesto aproximado. Esta información nos permite orientarte de manera personalizada hacia el ejemplar que mejor se ajuste a tus expectativas.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          2) Asesoría personalizada
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base">
                          Nuestro equipo técnico, conformado por zootecnistas, veterinarios y especialistas en burro criollo colombiano, te brindará una asesoría completa. Te explicaremos las características de cada línea genética, diferencias entre machos y hembras, edades recomendadas según tu experiencia, costos de mantenimiento, cuidados básicos, y te resolveremos todas tus dudas técnicas. Esta etapa es crucial para que tomes una decisión informada y consciente. No tenemos afán comercial; nuestro objetivo es que adquieras el animal correcto para ti.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          3) Selección del animal
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base mb-3">
                          Una vez definido el perfil del animal que buscas, procederemos a presentarte los ejemplares disponibles que se ajusten a tus criterios. Puedes elegir de tres formas:
                        </p>
                        <ul className="list-none space-y-2 text-[#374151] text-sm md:text-base ml-4">
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Visita presencial al criadero:</strong> Agendas una cita, visitas nuestras instalaciones, conoces a los animales en libertad, los ves moverse, interactúas con ellos, y recibes explicación técnica in situ.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Videollamada en vivo:</strong> Si estás lejos, coordinamos una videollamada para mostrarte los animales en tiempo real, sus movimientos, condición física, y responder tus preguntas.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Portafolio digital:</strong> Te enviamos fichas técnicas completas con fotografías profesionales, videos, datos genealógicos, medidas, y toda la información relevante del animal.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Step 4 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          4) Evaluación veterinaria (opcional pero recomendada)
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base">
                          Si lo deseas, puedes solicitar un examen veterinario de pre-compra realizado por un profesional externo de tu confianza (los costos corren por tu cuenta). Nosotros facilitamos el acceso y proporcionamos todo el historial médico del animal. En caso de que prefieras nuestro servicio veterinario interno, te entregamos un certificado de salud completo que incluye: revisión clínica general, estado reproductivo (en burras), evaluación morfológica, historial de vacunación y desparasitación actualizado.
                        </p>
                      </div>

                      {/* Step 5 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          5) Acuerdo comercial y formalización
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base mb-3">
                          Una vez seleccionado el animal, procedemos a formalizar el acuerdo comercial. Este incluye:
                        </p>
                        <ul className="list-none space-y-2 text-[#374151] text-sm md:text-base ml-4">
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Contrato de compraventa:</strong> Documento legal que especifica características del animal, precio, condiciones de entrega, garantías, y obligaciones de ambas partes.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Certificado de origen y genealogía:</strong> Documento que acredita la pureza genética del animal, línea de sangre, y registro en asociaciones oficiales (si aplica).</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Certificado veterinario:</strong> Historial completo de salud, vacunas, desparasitaciones, y condición física al momento de la entrega.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Guía de movilización ICA:</strong> Documento obligatorio expedido por el Instituto Colombiano Agropecuario para el transporte legal del animal.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Opciones de pago:</strong> Ofrecemos pago en una sola exhibición (transferencia bancaria o consignación), pago con tarjeta de crédito mediante pasarela segura, o planes de financiación acordados previamente (aplica según monto y condiciones).</span>
                          </li>
                        </ul>
                      </div>

                      {/* Step 6 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          6) Preparación y transporte
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base mb-3">
                          Previo a la entrega, preparamos al animal para su viaje o traslado:
                        </p>
                        <ul className="list-none space-y-2 text-[#374151] text-sm md:text-base ml-4">
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Revisión veterinaria final:</strong> Aseguramos que el animal esté en óptimas condiciones de salud para el traslado.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Herraje (si aplica):</strong> Animales de silla se entregan herrados profesionalmente.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Desparasitación y vacunación final:</strong> Aplicadas días previos al viaje.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Transporte profesional:</strong> Coordinamos el transporte con empresas especializadas en movilización de équidos, que cumplen con todas las normativas de bienestar animal. El vehículo cuenta con compartimentos individuales, ventilación adecuada, suspensión especial, y rastreo GPS. Los costos de transporte corren por cuenta del comprador, pero nosotros gestionamos todo el proceso.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Retiro en criadero:</strong> Si prefieres recoger el animal personalmente, coordinamos fecha y hora, y te proporcionamos orientación para el transporte seguro.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Step 7 */}
                      <div className="mb-6">
                        <h3 className="font-playfair text-base font-bold text-[#C8A94B] mb-2">
                          7) Entrega y seguimiento
                        </h3>
                        <p className="text-[#374151] text-sm md:text-base mb-3">
                          La relación con nuestros clientes no termina con la entrega del animal. Ofrecemos:
                        </p>
                        <ul className="list-none space-y-2 text-[#374151] text-sm md:text-base ml-4">
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Acompañamiento post-venta:</strong> Asesoría técnica permanente vía WhatsApp, correo o llamada para resolver dudas sobre alimentación, manejo, salud, reproducción, etc.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Garantía de satisfacción:</strong> 30 días de garantía contra vicios ocultos o problemas de salud no declarados. Si en este periodo se detecta alguna anomalía médica grave no informada previamente, se evalúa reposición o devolución.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Seguimiento del animal:</strong> Nos interesa saber cómo evoluciona tu animal. Solicitamos actualizaciones periódicas (fotos, videos) y estamos disponibles para visitas de seguimiento si lo requieres.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#C8A94B] mt-1.5">•</span>
                            <span><strong>Comunidad Paso Real:</strong> Te integramos a nuestra red de propietarios, donde compartimos experiencias, organizamos eventos, cabalgatas, y fomentamos el intercambio de conocimientos sobre burro criollo colombiano.</span>
                          </li>
                        </ul>
                      </div>

                      <p className="text-[#374151] text-sm md:text-base">
                        <strong>En Criadero Paso Real, comprar un animal es el inicio de una relación a largo plazo.</strong> No solo vendemos genética superior, vendemos acompañamiento, conocimiento, y compromiso con el bienestar animal y la satisfacción de nuestros clientes.
                      </p>

                      <p className="text-[#374151] text-sm md:text-base">
                        <strong>¿Listo para comenzar?</strong> Contáctanos hoy y da el primer paso hacia adquirir tu burro criollo colombiano, burra reproductora o pollino de élite.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="pb-16">
            <FAQSection 
              title="Burros criollos Colombianos" 
              faqs={burrosCriollosFaqs} 
              isFirstSection={true}
            />
            
            <FAQSection 
              title="Burras Reproductoras" 
              faqs={burrasReproductorasFaqs}
            />
            
            <FAQSection 
              title="Pollinos y Pollinas" 
              faqs={pollinosFaqs}
            />
            
            <FAQSection 
              title="Genética para producción de mulas" 
              faqs={geneticaMulasFaqs}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQPage;
