import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Heart, Leaf, Users, Award, Sparkles } from 'lucide-react';
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

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
    icon: Leaf,
    title: 'Crianza en libertad',
    description: 'Espacios amplios y naturales'
  }, {
    icon: Award,
    title: 'Selección genética',
    description: 'Líneas de sangre superiores'
  }, {
    icon: Heart,
    title: 'Bienestar animal',
    description: 'Respeto por sus ciclos naturales'
  }, {
    icon: Shield,
    title: 'Manejo veterinario',
    description: 'Atención profesional constante'
  }, {
    icon: Truck,
    title: 'Envíos y trazabilidad',
    description: 'A toda Colombia'
  }, {
    icon: Users,
    title: 'Compra segura',
    description: 'Garantía y transparencia'
  }];

  return (
    <>
      <Helmet>
        <title>Criadero Paso Real - Burro Criollo Colombiano de Silla</title>
        <meta name="description" content="Criadero Paso Real: crianza responsable de burro criollo colombiano de silla. Genética de campeones, criados en libertad. Venta de saltos y animales." />
      </Helmet>

      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Philosophy Section */}
      <section className="section-padding premium-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="relative max-w-4xl mx-auto">
            <div className="pointer-events-none absolute -inset-x-8 -top-5 -bottom-7 rounded-[44px] bg-[#d8bd76]/16 blur-3xl" />
            <div className="pointer-events-none absolute left-12 right-12 -bottom-8 h-16 rounded-full bg-black/20 blur-2xl opacity-35" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
              className="relative rounded-[30px] md:rounded-[34px] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.90),rgba(255,255,255,0.78))] backdrop-blur-[20px] px-5 py-7 md:px-12 md:py-11 overflow-hidden"
              style={{
                borderRadius: '34px',
                boxShadow:
                  '0 32px 84px rgba(20,16,8,0.16), 0 12px 28px rgba(20,16,8,0.09), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
          >
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="max-w-3xl mx-auto">
                <p className="font-inter mb-5 text-[11px] md:text-sm uppercase tracking-[0.24em] text-[#b89334] font-semibold">
                  Tradición y excelencia
                </p>
                <blockquote className="font-playfair text-[1.35rem] md:text-[2.65rem] text-[#0f1115] mb-4 md:mb-5 italic leading-[1.2]">
                  “Criados en libertad, respetando sus ciclos, son hechos para trascender”
                </blockquote>
                <p className="premium-description text-justify-desktop font-inter text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
                  En Criadero Paso Real nos dedicamos a la crianza responsable del burro criollo colombiano de silla,
                  preservando su genética excepcional y garantizando su bienestar en cada etapa.
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
            <Card className="overflow-hidden glass-card border border-white/70 shadow-xl transition-smooth">
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
                  <p className="text-[#C8A94B] font-bold text-3xl mb-6">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 border border-white/70 backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-[#C8A94B]" />
              <span className="premium-kicker !text-[0.72rem] !tracking-[0.12em] !mb-0">Calidad certificada</span>
            </div>
            <h2 className="premium-title text-4xl font-bold mb-4">
              Nuestro Compromiso con la Calidad
            </h2>
            <div className="premium-divider"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            {qualityBadges.map((badge, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.1 }} 
                className="text-center premium-glass rounded-2xl p-6"
              >
                <div className="premium-icon-chip mx-auto mb-4 transition-smooth hover:scale-110">
                  <badge.icon className="w-8 h-8 text-[#C8A94B]" />
                </div>
                <h3 className="font-bold text-lg text-[#0B0B0B] mb-2">{badge.title}</h3>
                <p className="premium-description">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <YouTubeSection />

      {/* Instagram Section */}
      <InstagramSection />

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
      <section className="py-[60px] md:py-[80px] lg:py-[100px] relative overflow-hidden bg-[#0B0B0B]">
        <div className="absolute inset-0 bg-iron-pattern opacity-5 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-4xl font-bold text-[#C8A94B] mb-4">
              Sé parte de nuestra comunidad
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Únete y sé el primero en conocer sobre disponibilidad de saltos, nuevos vientres y noticias de nuestro criadero.
            </p>
          </motion.div>
          <NewsletterForm />
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-[#0B0B0B] text-white border-t border-[#C8A94B]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-iron-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <p className="premium-kicker text-[#E9D498] mb-2">Respaldo Paso Real</p>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-white">
              Compra con confianza
            </h3>
            <p className="text-white/75 mt-3 max-w-2xl mx-auto">
              Acompañamiento real, trazabilidad y protocolos claros para cada cliente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 text-center">
              <div className="premium-icon-chip mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#C8A94B]" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Compra 100% Segura</h4>
              <p className="text-white/75 text-sm">Proceso transparente, soporte y garantía de atención.</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 text-center">
              <div className="premium-icon-chip mx-auto mb-4">
                <Truck className="w-8 h-8 text-[#C8A94B]" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Envíos a Toda Colombia</h4>
              <p className="text-white/75 text-sm">Logística especializada y seguimiento en cada etapa.</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 text-center">
              <div className="premium-icon-chip mx-auto mb-4">
                <Award className="w-8 h-8 text-[#C8A94B]" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Genética Certificada</h4>
              <p className="text-white/75 text-sm">Trazabilidad completa y criterios técnicos de selección.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
