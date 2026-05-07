import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dna, TableProperties, ArrowLeft, BadgeCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeReproductor } from '@/lib/contentAdapters';
import { getSiteUrl } from '@/lib/siteUrl';

const ReproductorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [reproductor, setReproductor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReproductor = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reproductores')
          .select('*')
          .eq('id', id)
          .eq('estado_publicacion', true)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/reproductores');
          return;
        }

        setReproductor(normalizeReproductor(data));
      } catch (error) {
        console.error('Error loading reproductor detail:', error);
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el reproductor',
          description: 'Intenta nuevamente en unos segundos.',
        });
        navigate('/reproductores');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadReproductor();
  }, [id, navigate, toast]);

  const technicalRows = useMemo(() => {
    if (!reproductor) return [];
    return [
      ['Nombre', reproductor.nombre],
      ['Raza', reproductor.raza || 'No registrada'],
      ['Edad', reproductor.edad ? `${reproductor.edad} años` : 'No registrada'],
      ['Estado', reproductor.estado || 'Activo'],
      ['Descripción', reproductor.descripcion || 'Sin descripción'],
    ];
  }, [reproductor]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen premium-page-bg flex items-center justify-center pt-24">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!reproductor) return null;

  return (
    <>
      <Helmet>
        <title>{reproductor.nombre} - Criadero Paso Real</title>
        <meta
          name="description"
          content={`Conoce a ${reproductor.nombre}, reproductor disponible en Criadero Paso Real.`}
        />
        <link rel="canonical" href={`${siteUrl}/reproductor/${reproductor.id}`} />
        <meta property="og:url" content={`${siteUrl}/reproductor/${reproductor.id}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <section className="relative h-[62vh] min-h-[420px] overflow-hidden pt-20">
        <img
          src={reproductor.fotos[0]}
          alt={reproductor.nombre}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/45 border border-white/30 text-white mb-4">
              <BadgeCheck className="w-4 h-4 text-[#C8A94B]" />
              <span className="text-xs uppercase tracking-[0.14em]">Reproductor</span>
            </div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-3">{reproductor.nombre}</h1>
            <p className="text-white/85 text-lg md:text-xl max-w-3xl">{reproductor.descripcion}</p>
          </div>
        </div>
      </section>

      <section className="premium-page-bg pb-24 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/reproductores')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8A94B] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a reproductores
          </button>

          <div className="grid lg:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 border border-[#cdbb91] bg-[#fffdf7] p-4 md:p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reproductor.fotos.map((foto, idx) => (
                  <div key={`${foto}-${idx}`} className="aspect-[4/3] overflow-hidden">
                    <img
                      src={foto}
                      alt={`${reproductor.nombre} foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="border border-[#cdbb91] bg-[#fffdf7] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Dna className="w-6 h-6 text-[#C8A94B]" />
                  <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B]">Perfil Genético</h2>
                </div>
                <p className="premium-description leading-relaxed">
                  {reproductor.descripcion}
                </p>
              </div>

              <div className="border border-[#cdbb91] bg-[#fffdf7] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TableProperties className="w-6 h-6 text-[#C8A94B]" />
                  <h3 className="font-playfair text-2xl font-bold text-[#0B0B0B]">Ficha Técnica</h3>
                </div>
                <div className="space-y-3">
                  {technicalRows.map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 border-b border-gray-200 pb-2">
                      <span className="font-semibold text-[#0B0B0B]">{label}</span>
                      <span className="text-right text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => navigate('/contacto')}
                className="w-full py-6 text-base"
              >
                Solicitar asesoría de cruce
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ReproductorDetailPage;
