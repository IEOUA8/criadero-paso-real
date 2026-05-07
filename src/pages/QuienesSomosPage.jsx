import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PawPrint, Sprout, HeartHandshake, Target, Microscope, Gem, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import ExpandableModal from '@/components/ExpandableModal';
import { getSiteUrl } from '@/lib/siteUrl';

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: 'easeOut' } },
};

const IMAGE_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8e2d4"/><stop offset="100%" stop-color="#bca36a"/></linearGradient></defs><rect width="1400" height="900" fill="url(#g)"/><text x="50%" y="50%" text-anchor="middle" font-size="42" fill="#2d2a23" font-family="Georgia, serif">Criadero Paso Real</text></svg>`
)}`;

const onImageError = (event) => {
  if (event.currentTarget.src !== IMAGE_FALLBACK) {
    event.currentTarget.src = IMAGE_FALLBACK;
  }
};

const QuienesSomosPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const siteUrl = getSiteUrl();

  const openModal = (title, content) => setActiveModal({ title, content });
  const closeModal = () => setActiveModal(null);

  const nombreCorto =
    'Nuestra finca se encuentra ubicada en el cañón del rio Cauca, en el municipio de Santa Fe de Antioquia. En la época de la colonia, a los caminos por donde transitaban las personas y equinos se les llamaba Caminos Reales. A los cruces de caminos, se les llamaba el Paso. En el lugar donde se encuentra nuestro criadero se encontraban diferentes Caminos Reales, que se dirigían desde Santa Fe de Antioquia hacia Cativo y hacia Valdivia...';

  const nombreCompleto = `Nuestra finca se encuentra ubicada en el cañón del rio Cauca, en el municipio de Santa Fe de Antioquia. En la época de la colonia, a los caminos por donde transitaban las personas y equinos se les llamaba Caminos Reales. A los cruces de caminos, se les llamaba el Paso. En el lugar donde se encuentra nuestro criadero se encontraban diferentes Caminos Reales, que se dirigían desde Santa Fe de Antioquia hacia Cativo y hacia Valdivia, ambas rutas utilizadas por las famosas recuas de mulas y arrieros que transportaban las cargas de oro hacia el puerto de Urabá, en la época de la colonia, en donde lo embarcaron para enviarlo a Europa. El nombre Paso Real, es una forma de honrar esa memoria de arrieros, mulas y tradición cultural equina en Colombia.

En Criadero Paso Real somos un proyecto familiar dedicado con pasión, rigor y carácter a la cría, selección y preservación del burro criollo colombiano de silla, una de las razas más nobles, resistentes y funcionales del país.

Desde nuestros inicios, nos hemos comprometido con el fortalecimiento de este patrimonio genético que representa historia, trabajo, versatilidad y belleza en los andes colombianos.

Nuestro propósito es formar ejemplares de alto desempeño, dóciles, fuertes, equilibrados y con las mejores líneas de sangre, capaces de sobresalir tanto en la labor diaria como en actividades recreativas, deportivas y de exposición. En nuestras instalaciones trabajamos con disciplina, conocimiento y amor por la especie, garantizando prácticas responsables de manejo, bienestar animal, nutrición y reproducción.`;

  const historiaCompleta = `Criadero Paso Real nace del sueño de consolidar un programa genético sólido y sostenible del burro criollo colombiano de silla, basado en la experiencia de más de 14 años en manejo de hatos.

Nuestro trabajo inició con un pequeño grupo de reproductoras, cuidadosamente seleccionadas por su estructura, temperamento y capacidad funcional. Con el tiempo, y gracias a un manejo disciplinado, el hato creció, incorporando nuevas líneas de sangre y adoptando prácticas de reproducción responsables.

Hoy, Paso Real es un proyecto que combina tradición rural con visión moderna, uniendo conocimiento, disciplina y profundo respeto por la especie. Nuestro compromiso es seguir fortaleciendo esta raza única, contribuyendo a su conservación y promoviendo su valor en el campo colombiano y más allá.`;

  const pilares = [
    {
      icon: PawPrint,
      title: 'Tradición, genética y selección con criterio',
      shortText:
        'Cada ejemplar que nace en Paso Real es el resultado de años de experiencia en manejo de hatos, combinado con una visión moderna de la cría equina y asinina. Nos enfocamos en ...',
      fullText:
        'Cada ejemplar que nace en Paso Real es el resultado de años de experiencia en manejo de hatos, combinado con una visión moderna de la cría equina y asinina. Nos enfocamos en potenciar la funcionalidad, el temperamento, la estructura y la resistencia, características que han convertido al burro criollo colombiano en un aliado indispensable para el campo y en un compañero ideal para quienes buscan animales nobles y confiables.',
    },
    {
      icon: Sprout,
      title: 'Un criadero con propósito',
      shortText:
        'Creemos profundamente en el valor cultural y productivo del burro criollo. Por eso, nuestro trabajo trasciende la cría: buscamos proteger, promover y posicionar esta raza ...',
      fullText:
        'Creemos profundamente en el valor cultural y productivo del burro criollo. Por eso, nuestro trabajo trasciende la cría: buscamos proteger, promover y posicionar esta raza a nivel nacional e internacional. Cada avance, cada cruce y cada logro es compartido con nuestra comunidad, especialmente a través de nuestro Instagram @criaderopasoreal, donde mostramos el día a día del hato, la evolución de nuestras crías y el compromiso que nos mueve.',
    },
    {
      icon: HeartHandshake,
      title: 'Compromiso con Colombia y su biodiversidad',
      shortText:
        'En Paso Real honramos la tradición ganadera del país y aportamos a la conservación de una especie emblemática. Nuestro trabajo se sustenta en prácticas responsables ...',
      fullText:
        'En Paso Real honramos la tradición ganadera del país y aportamos a la conservación de una especie emblemática. Nuestro trabajo se sustenta en prácticas responsables, sostenibles y respetuosas del entorno, con la convicción de que criar es más que producir: es preservar, evolucionar y dejar legado.',
    },
  ];

  const enfoqueCards = [
    {
      icon: Target,
      title: 'Misión',
      text: 'Preservar, fortalecer y potenciar la raza del burro criollo colombiano de silla con selección genética responsable, bienestar animal y manejo profesional.',
    },
    {
      icon: Microscope,
      title: 'Visión',
      text: 'Ser referente en Colombia y Latinoamérica por excelencia genética, ética en el manejo animal y aporte real a la conservación de esta raza única.',
    },
    {
      icon: Gem,
      title: 'Valores',
      text: 'Pasión por la especie, bienestar animal, excelencia genética, integridad, transparencia, tradición y legado en cada decisión del criadero.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Quiénes Somos - Criadero Paso Real</title>
        <meta
          name="description"
          content="Criadero Paso Real – Excelencia en la cría del burro criollo colombiano de silla, en libertad y pastoreo."
        />
        <link rel="canonical" href={`${siteUrl}/quienes-somos`} />
        <meta property="og:url" content={`${siteUrl}/quienes-somos`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <div className="pt-20">
        <HeroSection
          title="Quiénes Somos"
          description="Criadero Paso Real – Excelencia en la cría del burro criollo colombiano de silla, en libertad y pastoreo."
          buttonText="Nuestra historia"
          buttonLink="#origen"
          backgroundImage="https://images.unsplash.com/photo-1695331326719-3d12cd513167?auto=format&fit=crop&w=2200&q=80"
          textColor="white"
          overlayOpacity={0.56}
        />
      </div>

      <section id="origen" className="relative premium-page-bg py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto">
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative border-y border-[#cdbb91] px-5 py-8 md:px-16 md:py-14 text-center overflow-hidden"
            >
              <div className="max-w-3xl mx-auto">
                <p className="font-inter text-[11px] md:text-sm tracking-[0.14em] uppercase text-[#7b5d22] font-semibold mb-6">
                  Tradición y excelencia
                </p>
                <h2 className="font-playfair text-[1.35rem] md:text-[2.75rem] italic leading-[1.2] text-[#111318] mb-5 md:mb-6">
                  “Criados en libertad, respetando sus ciclos, son hechos para trascender”
                </h2>
                <p className="premium-description text-justify-desktop font-inter text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
                  Desde nuestros inicios, nos hemos comprometido con el fortalecimiento de este patrimonio genético que
                  representa historia, trabajo, versatilidad y belleza en los andes colombianos.
                </p>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f5] py-9 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="border border-[#cdbb91] bg-[#fffdf7] p-7 md:p-10"
            >
              <h3 className="font-playfair text-3xl md:text-5xl leading-tight font-bold text-[#c6a540] mb-5">
                ¿Por qué el nombre PASO REAL?
              </h3>
              <p className="font-inter text-justify-desktop text-[#364152] text-base md:text-lg leading-relaxed">{nombreCorto}</p>
              <Button
                className="mt-7 bg-[#c8a94b] hover:bg-[#b99735] text-black font-semibold"
                onClick={() => openModal('¿Por qué el nombre PASO REAL?', nombreCompleto)}
              >
                Leer más
              </Button>
            </motion.article>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.52 }}
              className="overflow-hidden border border-[#cdbb91] min-h-[300px]"
            >
              <img
                src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1800&q=80"
                alt="Criadero de caballos"
                className="w-full h-full object-cover min-h-[300px]"
                onError={onImageError}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-14">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=2300"
            alt="Caballo cafe en campo"
            className="w-full h-full object-cover"
            onError={onImageError}
          />
          <div className="absolute inset-0 bg-[#121313]/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-10 md:mb-14"
          >
            <p className="font-inter uppercase tracking-[0.28em] text-xs md:text-sm text-[#dfc16d] mb-3">Identidad Paso Real</p>
            <h3 className="font-playfair text-3xl md:text-5xl text-white font-bold">Tradición que evoluciona con criterio</h3>
          </motion.div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {pilares.map((card, index) => (
              <motion.article
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.08 }}
                className="border border-white/30 bg-black/45 p-5 md:p-7 text-white flex flex-col md:min-h-[560px]"
              >
                <card.icon className="w-9 h-9 md:w-10 md:h-10 text-[#d7b24a] mb-4 md:mb-5" />
                <h3 className="font-playfair text-[1.8rem] md:text-[2.5rem] leading-[1.14] font-bold mb-4 md:min-h-[190px]">
                  {card.title}
                </h3>
                <p className="font-inter text-justify-desktop text-base md:text-lg leading-relaxed text-white/[0.94] md:min-h-[210px]">
                  {card.shortText}
                </p>
                <Button
                  className="mt-6 md:mt-auto bg-[#c8a94b] hover:bg-[#b99735] text-black font-semibold self-center md:self-start"
                  onClick={() => openModal(card.title, card.fullText)}
                >
                  Leer más
                </Button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f3f1] py-9 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8 md:mb-12"
          >
            <p className="font-inter uppercase tracking-[0.28em] text-xs md:text-sm text-[#b9993e] mb-3">Fundamentos</p>
            <h3 className="font-playfair text-3xl md:text-5xl font-bold text-[#101114]">Misión, visión y valores</h3>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {enfoqueCards.map((item, index) => (
              <motion.article
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.08 }}
                className="border border-[#ddcfaa] bg-[#fffdf7] p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <item.icon className="w-8 h-8 text-[#c8a94b]" />
                  <h3 className="font-playfair text-4xl font-bold text-[#111317]">{item.title}</h3>
                </div>
                <div className="h-px bg-[#e7dcc1] mb-5" />
                <p className="font-inter text-justify-desktop text-[#354052] text-base md:text-lg leading-relaxed">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f6] py-9 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="w-full max-w-[560px] lg:aspect-square border border-[#ddd2b5] bg-[#fffdf7] p-6 md:p-10 lg:p-12 flex flex-col justify-center items-center text-center"
            >
              <h3 className="font-playfair text-3xl md:text-5xl font-bold text-[#111317] mb-5 md:mb-6">Historia</h3>
              <p className="font-inter text-justify-desktop text-[#364152] text-base md:text-lg leading-relaxed max-w-[460px]">
                Criadero Paso Real nace del sueño de consolidar un programa genético sólido y sostenible del burro
                criollo colombiano de silla, con más de 14 años de experiencia en manejo de hatos.
              </p>
              <Button
                className="mt-8 bg-[#c8a94b] hover:bg-[#b99735] text-black font-semibold"
                onClick={() => openModal('Historia', historiaCompleta)}
              >
                Leer más
              </Button>
            </motion.article>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.52 }}
              className="relative w-full max-w-[560px] lg:justify-self-end aspect-[4/3] sm:aspect-square overflow-hidden border border-[#e9debf]"
            >
              <img
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=80"
                alt="Historia del criadero"
                className="w-full h-full object-cover"
                onError={onImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 border border-white/30 bg-black/55 p-3 md:p-4 text-white">
                <p className="font-playfair text-2xl md:text-3xl font-bold">Tradición viva en el Cañón del Cauca</p>
                <p className="font-inter text-sm md:text-base text-white/90 mt-2">14+ años de selección, disciplina y legado.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b0b0d] py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="border border-white/15 bg-black/35 p-6 md:p-10"
          >
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-7 lg:gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <MapPin className="w-8 h-8 text-[#d3b04e]" />
                  <h3 className="font-playfair text-3xl md:text-5xl font-bold text-[#d3b04e]">Ubicación y microclima</h3>
                </div>
                <p className="font-inter text-justify-desktop text-white/[0.92] text-base md:text-xl leading-relaxed">
                  El criadero se ubica en el cañón del río Cauca, Antioquia - Colombia. Es un bosque tropical seco,
                  con un microclima muy especial. La temperatura es muy alta durante el día y desciende en la noche,
                  permitiendo que los grados brix se fijen en las hojas de los pastos, que logran concentrar mayor
                  cantidad de micro y fitonutrientes.
                </p>
              </div>

              <div className="overflow-hidden border border-white/20 bg-black/20">
                <iframe
                  title="Mapa Santa Fe de Antioquia"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-75.93%2C6.47%2C-75.72%2C6.64&layer=mapnik&marker=6.5564%2C-75.8278"
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <ExpandableModal
        isOpen={Boolean(activeModal)}
        onClose={closeModal}
        title={activeModal?.title}
        content={activeModal?.content}
      />
    </>
  );
};

export default QuienesSomosPage;
