import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  BadgeCheck,
  ClipboardCheck,
  Dna,
  FileCheck,
  Handshake,
  MapPinned,
  Route,
  Sprout,
  Stethoscope,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import HeroSlider from '@/components/HeroSlider';
import NewsletterForm from '@/components/NewsletterForm';
import BlogCard from '@/components/BlogCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import YouTubeSection from '@/components/YouTubeSection';
import InstagramSection from '@/components/InstagramSection';
import ReviewsSection from '@/components/ReviewsSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getSiteUrl } from '@/lib/siteUrl';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const siteUrl = getSiteUrl();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const candidatoProduct = {
    id: 'candidato',
    nombre: 'Salto de Candidato',
    tipo: 'Reproductor',
    precio: 400000,
    fotos: ['https://images.unsplash.com/photo-1689973846749-bf16930637e4'],
    descripcion: 'Genética de campeones. Candidato, nuestro reproductor estrella, ofrece saltos de excepcional calidad genética para tu programa de cría.'
  };

  const handleBuyClick = () => {
    addToCart(candidatoProduct);
    navigate('/carrito');
  };

  const featuredBlogPosts = [{
    slug: 'cuidado-burro-criollo',
    título: 'Cuidado del Burro Criollo Colombiano',
    extracto: 'Descubre los cuidados esenciales para mantener a tu burro criollo en óptimas condiciones de salud y bienestar.',
    imagen_portada: 'https://images.unsplash.com/photo-1554145726-b87aa584c850',
    autor: 'Equipo Paso Real',
    created_at: new Date().toISOString()
  }, {
    slug: 'historia-burro-silla',
    título: 'Historia del Burro de Silla en Colombia',
    extracto: 'Un viaje por la historia del burro criollo colombiano de silla, desde los caminos reales hasta nuestros días.',
    imagen_portada: 'https://images.unsplash.com/photo-1544355051-09eb1746a606',
    autor: 'Equipo Paso Real',
    created_at: new Date().toISOString()
  }];

  const qualityBadges = [{
    icon: Stethoscope,
    title: 'Manejo veterinario',
    description: 'Seguimiento sanitario, vacunación, desparasitación y revisión de condición corporal.'
  }, {
    icon: Dna,
    title: 'Selección genética',
    description: 'Criterios de cruce basados en rusticidad, estructura, temperamento y valor reproductivo.'
  }, {
    icon: Heart,
    title: 'Bienestar animal',
    description: 'Crianza en pasturas abiertas, respeto por los ciclos naturales y manejo tranquilo.'
  }];

  const animalQualityItems = [
    {
      icon: Sprout,
      title: 'Crianza en pasturas',
      description: 'Animales levantados en espacios abiertos, con movimiento natural y adaptación al terreno.'
    },
    {
      icon: Dna,
      title: 'Selección genética',
      description: 'Cruces revisados por rusticidad, temperamento, estructura y valor reproductivo.'
    },
    {
      icon: Stethoscope,
      title: 'Manejo veterinario',
      description: 'Seguimiento sanitario, desparasitación, vacunación y revisión de condición corporal.'
    },
    {
      icon: ClipboardCheck,
      title: 'Manejo reproductivo',
      description: 'Control de vientres, reproductores, genealogías y objetivos de producción mular o asinina.'
    }
  ];

  const shippingTrustItems = [
    {
      icon: BadgeCheck,
      title: 'Selección acompañada',
      description: 'Te orientamos según tu objetivo: cría, silla, trabajo, vientres o formación de hato.'
    },
    {
      icon: FileCheck,
      title: 'Documentos al día',
      description: 'Preparamos certificado veterinario, historial sanitario y documentos requeridos para movilización.'
    },
    {
      icon: Route,
      title: 'Transporte seguro',
      description: 'Coordinamos rutas y transportadores con experiencia en movilización equina y asinina.'
    },
    {
      icon: MapPinned,
      title: 'Entrega coordinada',
      description: 'Acompañamos la llegada a finca y las primeras recomendaciones de adaptación.'
    },
    {
      icon: Handshake,
      title: 'Seguimiento post-compra',
      description: 'Seguimos disponibles para manejo, alimentación, potrero y dudas después de la entrega.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Criadero Paso Real - Burro Criollo Colombiano de Silla</title>
        <meta name="description" content="Criadero Paso Real: crianza responsable de burro criollo colombiano de silla. Genética de campeones, criados en libertad. Venta de saltos y animales." />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Philosophy Section */}
      <section className="section-padding premium-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="relative max-w-4xl mx-auto border-y border-[#cdbb91] py-10 md:py-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
              className="relative px-2 md:px-12"
          >
              <div className="max-w-3xl mx-auto">
                <p className="font-inter mb-5 text-[11px] md:text-sm uppercase tracking-[0.14em] text-[#7b5d22] font-semibold">
                  Tradición y excelencia
                </p>
                <blockquote className="font-playfair text-[1.35rem] md:text-[2.65rem] text-[#0f1115] mb-4 md:mb-5 italic leading-[1.2]">
                  “Criados en libertad, respetando sus ciclos, son hechos para trascender”
                </blockquote>
                <p className="premium-description text-justify-desktop font-inter text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
                  En Paso Real, cada burro nace en pasturas abiertas, donde la naturaleza moldea su carácter, su resistencia y la genética que dará vida a animales de alto valor para cualquier actividad.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="section-padding premium-page-bg">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-[#cdbb91] bg-[#fffdf7] shadow-none">
              <div className="grid md:grid-cols-2">
                <div className="relative h-96 md:h-auto">
                  <img src="https://images.unsplash.com/photo-1689973846749-bf16930637e4" alt="Salto de Candidato" className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                  <p className="premium-kicker mb-3">Reproductor destacado</p>
                  <h2 className="premium-title text-4xl font-bold mb-4">
                    Salto de Candidato
                  </h2>
                  <p className="premium-description mb-4">
                    Genética de campeones. Candidato, nuestro reproductor estrella, ofrece saltos de 
                    excepcional calidad genética para tu programa de cría.
                  </p>
                  <p className="text-[#936f2d] font-bold text-3xl mb-6">
                    $400.000 COP
                  </p>
                  <Button 
                    onClick={handleBuyClick}
                    className="w-full md:w-auto px-6 py-3"
                  >
                    Comprar salto
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quality Infographic */}
      <section className="section-padding premium-section">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-10 md:mb-16"
          >
            <p className="premium-kicker mb-3">Calidad y manejo</p>
            <h2 className="premium-title text-4xl font-bold mb-4">
              Nuestro Compromiso con la Calidad
            </h2>
            <div className="premium-divider"></div>
          </motion.div>

          <div className="border border-[#cdbb91] bg-[#fffdf7] divide-y md:divide-y-0 md:divide-x divide-[#ded2b8] md:grid md:grid-cols-3">
            {qualityBadges.map((badge, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1 }} 
                className="text-center p-6 md:p-8"
              >
                <div className="premium-icon-chip mx-auto mb-4">
                  <badge.icon className="w-8 h-8 text-[#C8A94B]" />
                </div>
                <h3 className="font-playfair font-bold text-xl text-[#0B0B0B] mb-2">{badge.title}</h3>
                <p className="text-[#514638] text-sm leading-relaxed">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Instagram Section */}
      <InstagramSection />

      {/* Animal Quality Infographic */}
      <section className="premium-page-bg py-[42px] md:py-[56px] lg:py-[70px] border-y border-[#d7c79f]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-start">
            <div>
              <p className="premium-kicker mb-3">Calidad animal</p>
              <h2 className="premium-title text-3xl md:text-4xl font-bold mb-4">
                Manejo técnico con criterio de campo
              </h2>
              <p className="premium-description text-justify-desktop">
                La calidad de un ejemplar no depende solo de su apariencia. En Paso Real revisamos crianza, salud, línea genética, temperamento y capacidad funcional antes de recomendar un animal.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {animalQualityItems.map((item) => (
                <div key={item.title} className="border border-[#cdbb91] bg-[#fffdf7] p-5">
                  <item.icon className="w-8 h-8 text-[#936f2d] mb-4" />
                  <h3 className="font-playfair text-xl font-bold text-[#18140e] mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#514638]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Blog Preview */}
      <section className="section-padding premium-page-bg">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <h2 className="premium-title text-4xl font-bold mb-4">
              Blog
            </h2>
            <div className="premium-divider"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {featuredBlogPosts.map((post, index) => (
              <BlogCard key={index} post={post} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/blog')} 
              variant="outline" 
              className="px-8 py-6 text-lg font-medium"
            >
              Ver todas las publicaciones
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter / MultiStep Form */}
      <section className="py-[42px] md:py-[56px] lg:py-[70px] relative overflow-hidden bg-[#0B0B0B]">
        <div className="absolute inset-0 bg-iron-pattern opacity-5 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-4xl font-bold text-[#C8A94B] mb-4">
              Reciba noticias del criadero
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Déjenos su correo para avisarle sobre novedades, disponibilidad y noticias de Paso Real.
            </p>
          </motion.div>
          <NewsletterForm />
        </div>
      </section>

      {/* Shipping and Trust Infographic */}
      <section className="py-[42px] md:py-[56px] lg:py-[70px] bg-[#0B0B0B] text-white border-t border-[#C8A94B]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-iron-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-9">
            <p className="premium-kicker text-[#E9D498] mb-2">Envío y confianza</p>
            <p className="text-white/75 mt-3 max-w-2xl mx-auto">
              Un proceso claro desde la elección del animal hasta su llegada a finca.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {shippingTrustItems.map((item, index) => (
              <div key={item.title} className="border border-[#C8A94B]/35 bg-[#101010] p-5">
                <div className="flex items-center justify-between mb-4">
                  <item.icon className="w-7 h-7 text-[#C8A94B]" />
                  <span className="text-xs text-[#E9D498] tracking-[0.16em]">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h4 className="font-playfair text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-white/75 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
