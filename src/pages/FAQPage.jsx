import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import { getSiteUrl } from '@/lib/siteUrl';

const buyingSteps = [
  {
    title: '1. Contáctanos y cuéntanos qué estás buscando',
    body: 'Cuéntanos tu objetivo para orientarte hacia los ejemplares más adecuados.',
    items: [
      'cría de mulas',
      'producción asinina',
      'burros de silla',
      'burras reproductoras',
      'caballos funcionales',
      'crías para formar tu propio hato',
    ],
  },
  {
    title: '2. Revisa las opciones disponibles en la sección de venta',
    body: 'Allí encontrarás fotos, videos de manejo y desplazamiento, información de edad, alzada y condición corporal, genealogía, líneas de sangre, historial sanitario y características relevantes según tu propósito. Cada animal se presenta con datos verificables para que puedas evaluar con confianza.',
  },
  {
    title: '3. Recibe asesoría técnica personalizada',
    body: 'Tomamos en cuenta tu objetivo de producción y tu experiencia previa para ayudarte a escoger el animal que realmente corresponde a tu proyecto.',
  },
  {
    title: '4. Programa tu visita al criadero',
    body: 'La visita es opcional y se agenda con anticipación para que recibas atención exclusiva.',
    items: [
      'manejo',
      'temperamento',
      'movimientos',
      'instalaciones y potreros',
      'madres, crías y reproductores',
    ],
  },
  {
    title: '5. Selecciona el animal y formaliza la compra',
    body: 'Una vez elijas el ejemplar, acordamos el precio final, definimos las condiciones de entrega, firmamos la reserva si aplica y preparamos el certificado veterinario y los documentos ICA. El proceso es claro y completamente transparente.',
  },
  {
    title: '6. Coordinamos el transporte seguro hasta tu finca',
    body: 'Podemos gestionar el transporte con profesionales especializados en movilización equina y asinina, bienestar durante el viaje, rutas rurales y largas distancias. También te acompañamos en el proceso de guías sanitarias y permisos necesarios.',
  },
  {
    title: '7. Acompañamiento post-compra',
    body: 'Una vez el animal llegue a tu finca, seguimos contigo con recomendaciones de manejo en los primeros días, adaptación al potrero, alimentación, sal mineral, revisión del entorno y soporte en caso de dudas.',
  },
];

const frequentQuestions = [
  {
    question: '1. ¿Qué características debo evaluar antes de comprar un burro criollo colombiano?',
    answer: 'Se recomienda analizar genética, estructura, aplomos, movimiento, temperamento y ascendencia. En Paso Real ofrecemos asesoría técnica.',
  },
  {
    question: '2. ¿Cómo sé si un burro es un buen reproductor para producir mulas?',
    answer: 'Debe tener líneas probadas, dorsos fuertes, extremidades correctas, nobleza y descendencia con características consistentes. En nuestro criadero priorizamos reproductores con genética funcional y comprobada.',
  },
  {
    question: '3. ¿Las burras del criadero están criadas en libertad y con alimentación natural?',
    answer: 'Sí. Nuestras burras se crían en libertad, con pasto, sal mineralizada y agua, lo que garantiza vientres sanos, longevos y fértiles.',
  },
  {
    question: '4. ¿Los animales se entregan con valoración veterinaria?',
    answer: 'Sí. Todos los animales se entregan con certificado veterinario, historial sanitario actualizado y revisión completa de condición corporal y movilidad.',
  },
  {
    question: '5. ¿Puedo conocer las líneas de sangre y genealogía de los animales disponibles?',
    answer: 'Claro. Contamos con registros de ascendencia, campeones relacionados y análisis de características heredables.',
  },
  {
    question: '6. ¿Cómo garantizan el temperamento de los animales?',
    answer: 'Seleccionamos machos y hembras por docilidad y disposición al trabajo. Nuestros ejemplares son manejados desde temprana edad bajo prácticas que fomentan nobleza y equilibrio.',
  },
  {
    question: '7. ¿El criadero ayuda a escoger el animal adecuado para mis necesidades?',
    answer: 'Sí. Ofrecemos asesoría personalizada para identificar el ejemplar ideal según si buscas cría de mulas, silla recreativa, trabajo, genética o reproducción.',
  },
  {
    question: '8. ¿Ofrecen transporte o apoyo logístico?',
    answer: 'Sí. Trabajamos con transportadores especializados y orientamos en trámites ICA, guías sanitarias y requisitos de movilización.',
  },
  {
    question: '9. ¿Cuáles son las formas de pago permitidas?',
    answer: 'Aceptamos transferencias, pagos electrónicos y opciones seguras acordadas previamente. También manejamos reservas formales.',
  },
  {
    question: '10. ¿Puedo visitar el criadero antes de comprar?',
    answer: 'Sí. Recibimos visitas programadas para que el comprador evalúe los animales y conozca nuestras prácticas de crianza natural y genética.',
  },
  {
    question: '11. ¿Qué ventajas ofrece un burro criollo colombiano sobre burros importados?',
    answer: 'Mayor adaptación al clima, rusticidad probada, resistencia, fertilidad y mejor transmisión de cualidades funcionales para la producción de mulas colombianas.',
  },
  {
    question: '12. ¿Qué tipo de mulas puedo producir con burros del criadero?',
    answer: 'Mulas para trabajo agrícola, montaña, silla recreativa, trocha, transporte rural y labores de finca, con temperamento firme y gran resistencia.',
  },
  {
    question: '13. ¿Qué edad es ideal para comprar un burro reproductor?',
    answer: 'Entre los 3 y 5 años, cuando ya existe desarrollo físico completo y se pueden evaluar mejor los aplomos, movimiento y temperamento.',
  },
  {
    question: '14. ¿Qué edad es adecuada para comprar una burra reproductora?',
    answer: 'La mayoría de las burras están listas para reproducir entre los 3 y 4 años, con ciclos fértiles estables y madurez corporal.',
  },
  {
    question: '15. ¿Qué tipo de alimentación reciben los animales jóvenes?',
    answer: 'Cría 100% a pasto, con sal mineralizada y agua. No utilizamos concentrados, lo que garantiza animales rústicos y con desarrollo natural.',
  },
  {
    question: '16. ¿Puedo solicitar videos de los animales antes de visitar el criadero?',
    answer: 'Sí. Enviaremos videos de desplazamiento, manejo, temperamento y vista general para facilitar tu evaluación preliminar.',
  },
  {
    question: '17. ¿Qué razas de caballos tienen disponibles para la producción de mulas?',
    answer: 'Contamos con yeguas criollas colombianas, yeguas de silla, paso fino, trocha y ejemplares funcionales ideales para la mularía.',
  },
  {
    question: '18. ¿Los burros del criadero están domados o requieren adiestramiento?',
    answer: 'Manejamos animales dóciles y acostumbrados a contacto humano, pero dependiendo del ejemplar puede requerirse un adiestramiento adicional.',
  },
  {
    question: '19. ¿Cuánto tiempo se demora la entrega del animal después de la compra?',
    answer: 'Depende de la logística y la distancia, pero normalmente entre 3 y 7 días después de formalizar la venta y los trámites.',
  },
  {
    question: '20. ¿Qué tipo de garantías ofrece el criadero?',
    answer: 'Garantizamos animales sanos, funcionales, con historial veterinario y manejo adecuado. También ofrecemos seguimiento post-compra.',
  },
  {
    question: '21. ¿Puedo comprar una burra gestante?',
    answer: 'Sí. A menudo contamos con burras preñadas con machos de excelente línea genética.',
  },
  {
    question: '22. ¿Los animales están registrados o cuentan con documentos ICA?',
    answer: 'Sí. Todos los animales se entregan con sus respectivas guías sanitarias y documentos requeridos para su movilización dentro de Colombia.',
  },
  {
    question: '23. ¿Qué debo considerar al comprar una cría o un desteto?',
    answer: 'Es clave analizar la madre, la línea paterna y la rusticidad. Recomendamos elegir crías de madres rústicas criadas en libertad, como las nuestras.',
  },
  {
    question: '24. ¿Qué diferencia hay entre un burro de silla y un burro de trabajo?',
    answer: 'El burro de silla tiene mejor conformación, dorso más fuerte, mejor cuello, mayor equilibrio y funcionalidad para producir mulas de desempeño superior.',
  },
  {
    question: '25. ¿Qué tipo de entrenamiento reciben los animales jóvenes?',
    answer: 'Manejo básico: cabresteo, baño, revisión veterinaria y habituación al contacto humano. El entrenamiento adicional depende del comprador.',
  },
  {
    question: '26. ¿Pueden asesorarme en planes de cría y selección genética?',
    answer: 'Sí. Ofrecemos asesoría en planes mulares, selección asinina, cruzamientos y mejoramiento del hato, basados en experiencia real.',
  },
  {
    question: '27. ¿Qué tipo de instalaciones requiere un burro o una burra comprada en el criadero?',
    answer: 'Terreno amplio, potreros rotativos, agua permanente, sal mineralizada y sombra natural. Recomendamos manejo en libertad o semi-libertad.',
  },
  {
    question: '28. ¿Los burros criollos colombianos conviven bien con caballos o ganado?',
    answer: 'Sí. Son animales sociales, inteligentes y adaptables. La convivencia con bovinos y equinos suele ser armónica y estable.',
  },
  {
    question: '29. ¿Qué tamaño o alzada tienen los burros del criadero?',
    answer: 'La mayoría está dentro del estándar del burro criollo colombiano de silla, con alzadas funcionales ideales para la producción de mulas equilibradas.',
  },
  {
    question: '30. ¿Puedo recibir acompañamiento después de la compra?',
    answer: 'Sí. Ofrecemos seguimiento técnico, recomendaciones de manejo y apoyo para garantizar una adaptación adecuada del animal en su nuevo entorno.',
  },
];

const FAQPage = () => {
  const [isMainAccordionOpen, setIsMainAccordionOpen] = useState(true);
  const siteUrl = getSiteUrl();

  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes - Criadero Paso Real</title>
        <meta
          name="description"
          content="Burros criollos colombianos, burras reproductoras, pollinos y pollinas, y genética para producción de mulas."
        />
        <link rel="canonical" href={`${siteUrl}/faq`} />
        <meta property="og:url" content={`${siteUrl}/faq`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <div className="min-h-screen premium-page-bg pt-[86px] md:pt-[90px] max-[389px]:pt-[82px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 max-[389px]:px-3">
          <div className="text-center faq-header-padding border-y border-[#cdbb91] py-7 md:py-8 mb-7 md:mb-8 max-[389px]:py-6">
            <p className="premium-kicker mb-3 max-[389px]:text-[10px] max-[389px]:tracking-[0.09em]">Centro de ayuda</p>
            <h1 className="premium-title text-2xl md:text-4xl lg:text-5xl font-bold mb-4 max-[389px]:text-[1.55rem]">
              Preguntas Frecuentes
            </h1>
            <p className="premium-description text-justify-desktop text-base md:text-lg max-w-3xl mx-auto max-[389px]:text-[0.95rem]" style={{ lineHeight: '1.8' }}>
              Burros criollos colombianos, burras reproductoras, pollinos y pollinas, y genética para producción de mulas.
            </p>
          </div>

          <div className="mb-10 md:mb-12">
            <div className="border border-[#cdbb91] bg-[#fffdf7] p-4 md:p-6 max-[389px]:p-3.5">
              <button
                onClick={() => setIsMainAccordionOpen(!isMainAccordionOpen)}
                className="w-full flex items-start justify-between gap-4 text-left hover:bg-[#f4efe4] transition-accordion cursor-pointer p-2"
              >
                <div>
                  <h2 className="font-playfair text-xl md:text-3xl font-bold text-[#0B0B0B] flex-1 max-[389px]:text-[1.2rem]">
                    ¿Cómo comprar? – Paso a paso
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-[#514638]">
                    Proceso claro, seguro y acompañado para adquirir burros criollos, burras reproductoras, caballos y crías en el Criadero Paso Real.
                  </p>
                </div>
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
                    animate={{ opacity: 1, height: 'auto', marginTop: 22 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="space-y-5" style={{ lineHeight: '1.8' }}>
                      <p className="text-[#374151] text-sm md:text-base">
                        Comprar un animal en el Criadero Paso Real es un proceso transparente, guiado y diseñado para que ganaderos, criadores y amantes de los burros y caballos puedan tomar la mejor decisión según sus necesidades.
                      </p>

                      {buyingSteps.map((step) => (
                        <div key={step.title} className="border-t border-[#ded2b8] pt-4">
                          <h3 className="font-playfair text-lg font-bold text-[#936f2d] mb-2">{step.title}</h3>
                          <p className="text-[#374151] text-sm md:text-base">{step.body}</p>
                          {step.items && (
                            <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-1 mt-3 text-[#374151] text-sm md:text-base">
                              {step.items.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                  <span className="text-[#936f2d] mt-1">✔</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      <div className="border-t border-[#ded2b8] pt-5">
                        <p className="text-[#374151] text-sm md:text-base mb-3">
                          Queremos que cada compra sea el inicio de una relación de largo plazo.
                        </p>
                        <p className="text-[#374151] text-sm md:text-base">
                          <strong>Tu próximo gran animal está aquí.</strong> En el Criadero Paso Real, comprar es más que una transacción: es sumar genética, conocimiento y confianza a tu proyecto ganadero. Estamos listos para ayudarte a elegir el animal perfecto para tu hato.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pb-12">
            <FAQSection
              title="Otras preguntas frecuentes"
              faqs={frequentQuestions}
              isFirstSection={true}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQPage;
