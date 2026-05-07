import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeReproductor } from '@/lib/contentAdapters';
import { getSiteUrl } from '@/lib/siteUrl';

const ReproductoresPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [reproductores, setReproductores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReproductores = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reproductores')
          .select('*')
          .eq('estado_publicacion', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReproductores((data || []).map(normalizeReproductor));
      } catch (error) {
        console.error('Error loading reproductores:', error);
        toast({
          variant: 'destructive',
          title: 'Error al cargar reproductores',
          description: 'No se pudo conectar con la base de datos en este momento.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadReproductores();
  }, [toast]);

  const reproductoresActivos = useMemo(
    () => reproductores.filter((animal) => animal.estado !== 'retirado'),
    [reproductores]
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const handleBuyClick = (reproductor) => {
    addToCart({
      ...reproductor,
      tipo: 'Reproductor',
      precio: reproductor.precio || 0,
      imagen: reproductor.fotos?.[0],
    });
    navigate('/carrito');
  };

  return (
    <>
      <Helmet>
        <title>Reproductores - Criadero Paso Real</title>
        <meta name="description" content="Genética de campeones del burro criollo colombiano de silla. Conoce a nuestros reproductores." />
        <link rel="canonical" href={`${siteUrl}/reproductores`} />
        <meta property="og:url" content={`${siteUrl}/reproductores`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <div className="pt-20">
        <HeroSection
          title="Reproductores de Excelencia"
          description="Ejemplares seleccionados para programas de reproducción de alto rendimiento"
          buttonText="Ver reproductores"
          buttonLink="#reproductores"
          backgroundImage="https://images.unsplash.com/photo-1695331326719-3d12cd513167"
          textColor="white"
          overlayOpacity={0.5}
        />
      </div>

      {/* Cards Section */}
      <div id="reproductores" className="premium-page-bg py-8 md:py-14 min-h-[50vh] max-[389px]:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10 text-center border-y border-[#cdbb91] py-6 md:py-8 max-[389px]:py-5">
            <p className="premium-kicker mb-3 max-[389px]:!text-[10px] max-[389px]:!tracking-[0.09em]">Sementales Paso Real</p>
            <h2 className="premium-title text-2xl md:text-4xl font-bold mb-4 max-[389px]:text-[1.55rem]">
              Reproductores con respaldo genético
            </h2>
            <p className="premium-description text-justify-desktop max-w-3xl mx-auto max-[389px]:text-[0.95rem] max-[389px]:leading-[1.6]">
              Cada ejemplar ha sido seleccionado por conformación, nobleza y consistencia reproductiva. Aquí encuentras animales listos para elevar el nivel de tu programa de cría.
            </p>
          </div>

          {loading ? (
            <div className="min-h-[280px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : reproductoresActivos.length === 0 ? (
            <div className="glass-card rounded-md p-10 text-center">
              <h3 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-2">Próximamente nuevos reproductores</h3>
              <p className="premium-description">Estamos actualizando la información desde el panel administrativo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-[389px]:gap-5">
            {reproductoresActivos.map((rep, index) => (
              <motion.div
                key={rep.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col border-[#cdbb91] bg-[#fffdf7] shadow-none">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={rep.fotos?.[0]}
                      alt={rep.nombre}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#fffdf7] border border-[#cdbb91] flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-[#C8A94B]" />
                      <span className="text-xs font-semibold text-[#514638]">Linea seleccionada</span>
                    </div>
                  </div>
                  <CardContent className="p-6 sm:p-7 md:p-8 flex flex-col flex-grow max-[389px]:p-4">
                    <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#0B0B0B] mb-2 max-[389px]:text-[1.45rem]">{rep.nombre}</h2>
                    <p className="text-[#7b5d22] font-semibold mb-1 text-lg">{rep.raza}</p>
                    <p className="text-gray-500 text-sm mb-4 uppercase tracking-wide">
                      Edad: {rep.edad ? `${rep.edad} años` : 'No registrada'}
                    </p>
                    <p className="premium-description text-justify-desktop font-inter mb-6 flex-grow max-[389px]:text-[0.92rem]">{rep.descripcion}</p>
                    
                    <div className="space-y-3 max-[389px]:space-y-2.5">
                      <Button
                        onClick={() => handleBuyClick(rep)}
                        className="w-full px-6 py-3 max-[389px]:py-2.5 max-[389px]:text-sm"
                      >
                        Comprar salto
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/reproductor/${rep.id}`)}
                        variant="outline"
                        className="w-full px-6 py-3 max-[389px]:py-2.5 max-[389px]:text-sm"
                      >
                        Ver ficha técnica
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReproductoresPage;
