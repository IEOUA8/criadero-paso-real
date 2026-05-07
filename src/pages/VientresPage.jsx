import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeVientre } from '@/lib/contentAdapters';
import { getSiteUrl } from '@/lib/siteUrl';

const VientresPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [vientres, setVientres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVientres = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vientres')
          .select('*')
          .eq('estado_publicacion', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVientres((data || []).map(normalizeVientre));
      } catch (error) {
        console.error('Error loading vientres:', error);
        toast({
          variant: 'destructive',
          title: 'Error al cargar vientres',
          description: 'No se pudo conectar con la base de datos en este momento.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadVientres();
  }, [toast]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const handleContact = () => {
    toast({
      title: "Función en desarrollo",
      description: "Pronto podrás contactarnos directamente. Síguenos en nuestras redes.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Vientres - Criadero Paso Real</title>
        <meta name="description" content="Burras criollas colombianas criadas en libertad, fuertes, nobles y 100% funcionales." />
        <link rel="canonical" href={`${siteUrl}/vientres`} />
        <meta property="og:url" content={`${siteUrl}/vientres`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <div className="pt-20">
          <HeroSection
            title="Vientres Productivos"
            description="Burras seleccionadas para programas de reproducción con excelente historial productivo"
          buttonText="Ver vientres"
          buttonLink="#vientres"
          backgroundImage="https://images.unsplash.com/photo-1673872800723-df87b2c829d1"
          textColor="white"
          overlayOpacity={0.5}
        />
      </div>

      {/* Main Content */}
      <div className="premium-page-bg pb-10 md:pb-14 max-[389px]:pb-8">
        
        {/* Editorial Intro */}
        <div id="vientres" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-[389px]:px-3 max-[389px]:py-7">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border-y border-[#cdbb91] py-6 md:py-8 max-[389px]:py-5"
          >
            <p className="premium-kicker mb-4 max-[389px]:!text-[10px] max-[389px]:!tracking-[0.09em]">Programa de vientres</p>
            <p className="font-inter text-base md:text-lg premium-description text-justify-desktop mb-6 max-[389px]:text-[0.95rem]">
              En Criadero Paso Real entendemos que la grandeza de cualquier programa asinino comienza en un solo lugar: los vientres. Nuestras burras criollas colombianas representan la esencia de nuestra filosofía de cría: animales criados en libertad, desarrollados exclusivamente a pasto, sal mineralizada y agua, con una rusticidad que se hereda generación tras generación.
            </p>
            <ul className="space-y-3 md:space-y-4 font-inter text-base md:text-lg text-[#374151] mt-6 md:mt-8 max-[389px]:text-[0.95rem]">
              {[
                "Adaptabilidad y resistencia en potrero abierto.",
                "Conformación pélvica amplia para partos seguros.",
                "Temperamento dócil e instinto materno sobresaliente.",
                "Excelente producción lechera para el levante.",
                "Genética comprobada libre de defectos hereditarios."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-[#C8A94B] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 md:space-y-4 font-inter text-base md:text-lg text-[#374151] mt-6 md:mt-8 max-[389px]:text-[0.95rem]">
              {[
                "Vientres probados con historial reproductivo impecable.",
                "Yeguas jóvenes con gran proyección genética.",
                "Asesoría técnica para cruces asnales y mulares."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-[#C8A94B] flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10 max-[389px]:px-3">
          
          {/* Mares Grid */}
          <div>
            <h2 className="premium-title text-2xl md:text-[40px] font-bold mb-4 text-center max-[389px]:text-[1.55rem]">
              Nuestros Vientres Élite
            </h2>
            <p className="premium-description text-center max-w-3xl mx-auto mb-10 max-[389px]:text-[0.92rem] max-[389px]:mb-7">
              Hembras seleccionadas por fertilidad, estructura funcional y comportamiento materno, listas para programas reproductivos con visión de largo plazo.
            </p>
            {loading ? (
              <div className="min-h-[260px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : vientres.length === 0 ? (
              <div className="glass-card rounded-md p-10 text-center">
                <h3 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-2">No hay vientres publicados aún</h3>
                <p className="premium-description">Puedes administrarlos desde el panel de `Vientres`.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-[389px]:gap-5">
              {vientres.map((vientre, index) => (
                <motion.div
                  key={vientre.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-[#cdbb91] bg-[#fffdf7] shadow-none rounded-md flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={vientre.fotos[0]}
                        alt={vientre.nombre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-4 py-1.5 text-sm font-bold border ${
                          vientre.estado_reproductivo === 'activo'
                            ? 'bg-[#365b38] text-white border-[#365b38]'
                            : vientre.estado_reproductivo === 'en_descanso'
                            ? 'bg-[#936f2d] text-white border-[#936f2d]'
                            : 'bg-[#514638] text-white border-[#514638]'
                        }`}>
                          {vientre.estado_reproductivo === 'activo'
                            ? 'Disponible'
                            : vientre.estado_reproductivo === 'en_descanso'
                            ? 'En descanso'
                            : 'Retirada'}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 sm:p-7 md:p-8 flex flex-col flex-grow max-[389px]:p-4">
                      <h3 className="font-playfair text-2xl md:text-[28px] font-bold text-[#0B0B0B] mb-1 max-[389px]:text-[1.45rem]">{vientre.nombre}</h3>
                      <p className="text-[#7b5d22] font-semibold mb-4 text-sm uppercase tracking-wide">
                        Edad: {vientre.edad ? `${vientre.edad} años` : 'No registrada'}
                      </p>
                      <p className="font-inter premium-description text-justify-desktop mb-6 md:mb-8 flex-grow max-[389px]:text-[0.92rem]">{vientre.descripcion}</p>

                      <Button
                        onClick={() => navigate(`/vientres/${vientre.id}`)}
                        className="w-full py-3 md:py-6 flex items-center justify-center gap-2 max-[389px]:py-2.5 max-[389px]:text-sm"
                      >
                        Ver ficha <ChevronRight className="w-5 h-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            )}
          </div>

          {/* Closing Section */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border border-[#cdbb91] bg-[#fffdf7] p-6 md:p-16 text-center max-[389px]:p-4"
          >
            <h2 className="premium-title text-2xl md:text-[40px] font-bold mb-5 md:mb-6 max-[389px]:text-[1.5rem]">
              El corazón genético de nuestra cría
            </h2>
            <p className="font-inter text-base md:text-lg premium-description text-justify-desktop max-w-3xl mx-auto mb-7 md:mb-10 max-[389px]:text-[0.95rem]">
              Nuestras burras no son solo animales reproductores: Son el fruto de años de selección, pasión y respeto por el burro criollo colombiano. Ya sea que busques refrescar la genética de tu criadero o producir mulares de campeonato, en Paso Real encontrarás el vientre ideal.
            </p>
            <Button
              onClick={handleContact}
              variant="secondary"
              className="py-3 md:py-6 px-8 md:px-12 text-base md:text-lg max-[389px]:py-2.5 max-[389px]:px-6 max-[389px]:text-sm"
            >
              Contactar Asesor
            </Button>
          </motion.div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default VientresPage;
