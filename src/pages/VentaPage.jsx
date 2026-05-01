import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import IndicatorsSection from '@/components/IndicatorsSection';
import AnimalCarousel from '@/components/AnimalCarousel';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { normalizeCategory, normalizeProduct } from '@/lib/contentAdapters';

const VentaPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('categories')
            .select('*')
            .eq('tipo', 'producto')
            .eq('activa', true)
            .order('orden', { ascending: true })
            .order('nombre', { ascending: true }),
        ]);

        if (productsResponse.error) throw productsResponse.error;
        if (categoriesResponse.error) {
          console.warn('Categories table not ready or unavailable:', categoriesResponse.error.message);
        }

        const activeCategories = (categoriesResponse.data || []).map(normalizeCategory);
        const categoryMap = new Map(activeCategories.map((category) => [category.id, category]));

        const normalizedProducts = (productsResponse.data || []).map((item) => {
          const product = normalizeProduct(item);
          const category = categoryMap.get(product.categoria_id);
          return {
            ...product,
            categoria_nombre: category?.nombre || product.categoria_nombre || null,
            categoria_slug: category?.slug || product.categoria_slug || '',
          };
        });

        setProducts(normalizedProducts);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          variant: 'destructive',
          title: 'Error al cargar ventas',
          description: 'No se pudo conectar con la base de datos en este momento.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndCategories();
  }, [toast]);

  const availableProducts = useMemo(
    () =>
      products.filter((product) => {
        if (product.estado === 'sold') return false;
        if (selectedCategory === 'all') return true;
        return (
          product.categoria_id === selectedCategory ||
          product.categoria_slug === selectedCategory
        );
      }),
    [products, selectedCategory]
  );

  const filterCategories = useMemo(() => {
    if (categories.length > 0) return categories;

    const map = new Map();
    products.forEach((product) => {
      if (!product.categoria_slug) return;
      if (!map.has(product.categoria_slug)) {
        map.set(product.categoria_slug, {
          id: product.categoria_slug,
          nombre: product.categoria_nombre || product.categoria_slug,
          color: '#C8A94B',
        });
      }
    });
    return Array.from(map.values());
  }, [categories, products]);

  return (
    <>
      <Helmet>
        <title>Animales Disponibles para Venta - Criadero Paso Real</title>
        <meta name="description" content="Explora nuestro catálogo de burros criollos colombianos de silla disponibles para venta. Genética superior, salud garantizada y asesoría completa." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <div className="pt-20">
        <HeroSection
          title="Eleve la Genética de su Criadero"
          description="Burros, burras y crías con genética sólida para programas de reproducción de alto rendimiento."
          buttonText="Contáctenos"
          buttonLink="https://wa.me/573001234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20burros%20disponibles%20para%20venta%20en%20Criadero%20Paso%20Real.%20%C2%BFPodr%C3%ADan%20proporcionarme%20m%C3%A1s%20informaci%C3%B3n%3F"
          buttonTarget="_blank"
          isWhatsApp={true}
          backgroundImage="https://images.unsplash.com/photo-1638683586061-22afe102f28f"
          textColor="white"
          overlayOpacity={0.5}
        />
      </div>

      {/* Main Content */}
      <div className="premium-page-bg py-10 md:py-16 lg:py-20 px-4 sm:px-6 md:px-10 lg:px-16 max-[389px]:px-3 max-[389px]:py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Introduction Section */}
          <div className="text-center mb-10 md:mb-16 premium-glass rounded-3xl p-6 md:p-12 max-[389px]:rounded-2xl max-[389px]:p-4">
            <p className="premium-kicker mb-3 max-[389px]:text-[10px] max-[389px]:tracking-[0.16em]">Venta especializada</p>
            <h2 className="premium-title text-2xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-6 max-w-4xl mx-auto max-[389px]:text-[1.55rem] max-[389px]:mb-4">
              Tradición y Excelencia Genética
            </h2>
            <p className="premium-description text-justify-desktop font-inter text-base md:text-lg max-w-3xl mx-auto max-[389px]:text-[0.95rem] max-[389px]:leading-[1.6]">
              En Criadero Paso Real, cada animal es el resultado de generaciones de selección cuidadosa 
              y dedicación a la preservación del burro criollo colombiano de silla. Nuestro compromiso 
              con la excelencia genética, el bienestar animal y la satisfacción del cliente nos posiciona 
              como líderes en la cría de estos magníficos ejemplares.
            </p>
            <div className="premium-divider"></div>
          </div>

          {/* Indicators Section */}
          <div className="mb-10 md:mb-20">
            <IndicatorsSection />
          </div>

          {/* Animals Carousel */}
          <div className="mb-12">
            <h3 className="premium-title text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4 max-[389px]:text-[1.45rem]">
              Animales Destacados
            </h3>
            <p className="premium-description text-center max-w-2xl mx-auto mb-7 md:mb-10 max-[389px]:text-[0.92rem]">
              Selección curada de ejemplares con trazabilidad genética, temperamento equilibrado y preparación para reproducción o trabajo de silla.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8 max-[389px]:gap-1.5 max-[389px]:mb-6">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm border transition max-[389px]:px-2.5 max-[389px]:text-[11px] ${
                  selectedCategory === 'all'
                    ? 'bg-[#C8A94B] text-white border-[#C8A94B]'
                    : 'bg-white/80 text-gray-700 border-white hover:border-[#C8A94B]/60'
                }`}
              >
                Todas
              </button>
              {filterCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm border transition max-[389px]:px-2.5 max-[389px]:text-[11px] ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'bg-white/80 text-gray-700 border-white hover:border-[#C8A94B]/60'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined,
                    borderColor: selectedCategory === category.id ? category.color : undefined,
                  }}
                >
                  {category.nombre}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="min-h-[280px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <h3 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-2">No hay animales publicados aún</h3>
                <p className="premium-description">Publica productos desde el panel de administrador para verlos aquí.</p>
              </div>
            ) : (
              <AnimalCarousel animals={availableProducts} />
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default VentaPage;
