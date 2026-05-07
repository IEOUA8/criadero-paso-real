import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TableProperties, Dna, ArrowLeft, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeVientre } from '@/lib/contentAdapters';
import { getSiteUrl } from '@/lib/siteUrl';

const VientrDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const siteUrl = getSiteUrl();
  const [vientre, setVientre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVientre = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vientres')
          .select('*')
          .eq('id', id)
          .eq('estado_publicacion', true)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/vientres');
          return;
        }

        setVientre(normalizeVientre(data));
      } catch (error) {
        console.error('Error loading vientre detail:', error);
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el vientre',
          description: 'Intenta nuevamente en unos segundos.',
        });
        navigate('/vientres');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadVientre();
  }, [id, navigate, toast]);

  const statusLabel = useMemo(() => {
    if (!vientre) return '';
    if (vientre.estado_reproductivo === 'activo') return 'Disponible';
    if (vientre.estado_reproductivo === 'en_descanso') return 'En descanso';
    return 'Retirada';
  }, [vientre]);

  const technicalRows = useMemo(() => {
    if (!vientre) return [];
    return [
      ['Nombre', vientre.nombre],
      ['Raza', vientre.raza || 'No registrada'],
      ['Edad', vientre.edad ? `${vientre.edad} años` : 'No registrada'],
      ['Estado reproductivo', statusLabel],
      ['Descripción', vientre.descripcion || 'Sin descripción'],
    ];
  }, [vientre, statusLabel]);

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

  if (!vientre) return null;

  return (
    <>
      <Helmet>
        <title>{vientre.nombre} - Vientres | Criadero Paso Real</title>
        <meta
          name="description"
          content={`Conoce a ${vientre.nombre}, vientre disponible en Criadero Paso Real.`}
        />
        <link rel="canonical" href={`${siteUrl}/vientres/${vientre.id}`} />
        <meta property="og:url" content={`${siteUrl}/vientres/${vientre.id}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <section className="relative h-[60vh] min-h-[420px] overflow-hidden pt-20">
        <img
          src={vientre.fotos[0]}
          alt={vientre.nombre}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/45 border border-white/30 text-white mb-4">
              <ShieldCheck className="w-4 h-4 text-[#C8A94B]" />
              <span className="text-xs uppercase tracking-[0.14em]">Vientre {statusLabel}</span>
            </span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-3">{vientre.nombre}</h1>
            <p className="text-white/85 text-lg md:text-xl max-w-3xl">{vientre.descripcion}</p>
          </div>
        </div>
      </section>

      <section className="premium-page-bg pb-24 pt-12">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/vientres')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8A94B] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a vientres
          </button>

          <div className="grid lg:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 border border-[#cdbb91] bg-[#fffdf7] p-4 md:p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vientre.fotos.map((foto, idx) => (
                  <div key={`${foto}-${idx}`} className="aspect-[4/3] overflow-hidden">
                    <img
                      src={foto}
                      alt={`${vientre.nombre} foto ${idx + 1}`}
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
                  <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B]">Perfil Reproductivo</h2>
                </div>
                <p className="premium-description leading-relaxed">{vientre.descripcion}</p>
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

              <Button onClick={() => navigate('/contacto')} className="w-full py-6 text-base">
                Contactar asesor reproductivo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default VientrDetailPage;
