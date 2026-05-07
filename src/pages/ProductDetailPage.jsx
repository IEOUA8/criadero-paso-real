import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import DescriptionModal from '@/components/DescriptionModal';
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { normalizeProduct } from '@/lib/contentAdapters';
import { getSiteUrl } from '@/lib/siteUrl';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const siteUrl = getSiteUrl();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setAnimal(data ? normalizeProduct(data) : null);
      } catch (error) {
        console.error('Error loading product detail:', error);
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el producto',
          description: 'Intenta nuevamente en unos segundos.',
        });
        setAnimal(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id, toast]);

  const handleBuyClick = () => {
    if (animal) {
      addToCart(animal);
      navigate('/carrito');
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? animal.imagenes.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === animal.imagenes.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const getEstadoBadgeColor = (estado) => {
    if (estado === 'available' || estado === 'Disponible') return 'bg-[#365b38] text-white';
    if (estado === 'negotiation' || estado === 'En negociación') return 'bg-[#936f2d] text-white';
    if (estado === 'sold' || estado === 'Vendido') return 'bg-[#7f1d1d] text-white';
    return 'bg-[#514638] text-white';
  };

  const getEstadoLabel = (estado) => {
    if (estado === 'available') return 'Disponible';
    if (estado === 'sold') return 'Vendido';
    if (estado === 'negotiation') return 'En negociación';
    return estado || 'Sin estado';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get brief description (first 2-3 lines)
  const getBriefDescription = () => {
    const fullDesc = animal?.descripcionCompleta || animal?.descripcionDetallada || animal?.descripcion || '';
    const sentences = fullDesc.split('. ');
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '.');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Cargando Producto - Criadero Paso Real</title>
          <meta name="description" content="Cargando información del producto..." />
        </Helmet>
        <Header />
        <div className="min-h-screen flex items-center justify-center premium-page-bg">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!animal) {
    return (
      <>
        <Helmet>
          <title>Producto no encontrado - Criadero Paso Real</title>
          <meta name="description" content="El producto que buscas no está disponible." />
          <meta property="og:title" content="Producto no encontrado - Criadero Paso Real" />
          <meta property="og:description" content="El producto que buscas no está disponible." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Producto no encontrado - Criadero Paso Real" />
          <meta name="twitter:description" content="El producto que buscas no está disponible." />
        </Helmet>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center premium-page-bg px-4 text-center pt-28">
          <h1 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-4">
            Animal no encontrado
          </h1>
          <p className="text-[#6B7280] mb-8">
            El animal que buscas no está disponible o ha sido retirado.
          </p>
          <Button 
            onClick={() => navigate('/venta')} 
            className="bg-[#C8A94B] hover:bg-[#B8941B] text-white rounded-lg px-8 py-3"
          >
            Volver a Ventas
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{animal.nombre} - Criadero Paso Real</title>
        <meta name="description" content={animal.descripcionBreve || animal.descripcion || `Conoce a ${animal.nombre}, burro criollo colombiano de silla disponible en Criadero Paso Real.`} />
        <meta name="keywords" content={`${animal.nombre}, burro criollo colombiano, ${animal.raza}, ${animal.color}, Criadero Paso Real, venta de burros`} />
        <link rel="canonical" href={`${siteUrl}/venta/${animal.id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${animal.nombre} - Criadero Paso Real`} />
        <meta property="og:description" content={animal.descripcionBreve || animal.descripcion} />
        <meta property="og:image" content={animal.imagen || animal.imagenes?.[0]} />
        <meta property="og:url" content={`${siteUrl}/venta/${animal.id}`} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={animal.precio} />
        <meta property="product:price:currency" content="COP" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${animal.nombre} - Criadero Paso Real`} />
        <meta name="twitter:description" content={animal.descripcionBreve || animal.descripcion} />
        <meta name="twitter:image" content={animal.imagen || animal.imagenes?.[0]} />
      </Helmet>

      <Header />

      <div className="premium-page-bg min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/venta')}
            className="flex items-center text-[#6B7280] hover:text-[#C8A94B] transition-colors mb-8 group font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Volver a ventas
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Image Gallery Section */}
            <div className="lg:col-span-7">
              <div className="bg-[#fffdf7] border border-[#cdbb91] p-4">
                {/* Main Image */}
                <div className="relative w-full h-[600px] mb-4 overflow-hidden bg-gray-100">
                  <motion.img
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    src={animal.imagenes[selectedImageIndex]}
                    alt={`${animal.nombre} - Imagen ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#fffdf7] hover:bg-white p-3 border border-[#cdbb91] transition-colors duration-200"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#0B0B0B]" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#fffdf7] hover:bg-white p-3 border border-[#cdbb91] transition-colors duration-200"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="w-6 h-6 text-[#0B0B0B]" />
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {animal.imagenes.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative w-full h-[150px] overflow-hidden border-2 transition-colors duration-200 hover:border-[#936f2d] ${
                        selectedImageIndex === index 
                          ? 'border-[#936f2d]' 
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${animal.nombre} - Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animal Info Section */}
            <div className="lg:col-span-5">
              <div className="bg-[#fffdf7] border border-[#cdbb91] p-6 md:p-8 sticky top-28">
                
                {/* Name and Estado Badge */}
                <div className="flex items-start justify-between mb-4">
                  <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#0B0B0B]">
                    {animal.nombre}
                  </h1>
                  <Badge className={`${getEstadoBadgeColor(animal.estado)} font-bold px-3 py-1 ml-2 rounded-sm`}>
                    {getEstadoLabel(animal.estado)}
                  </Badge>
                </div>

                {/* Brief Description */}
                <p className="font-inter text-base text-[#6B7280] mb-3 leading-relaxed">
                  {getBriefDescription()}
                </p>

                {/* Ver más Button */}
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="ghost"
                  className="text-[#C8A94B] hover:text-[#B8941B] hover:bg-[#C8A94B]/10 p-0 h-auto font-medium mb-6"
                >
                  Ver más
                </Button>

                {/* Technical Specs - Ficha Técnica */}
                <div className="mb-6">
                  <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B] mb-4">
                    Ficha Técnica
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Sexo</span>
                      <span className="font-medium text-gray-900">{animal.sexo}</span>
                    </div>
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Edad</span>
                      <span className="font-medium text-gray-900">{animal.edad} años</span>
                    </div>
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3 col-span-2">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Raza</span>
                      <span className="font-medium text-gray-900">{animal.raza}</span>
                    </div>
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Color</span>
                      <span className="font-medium text-gray-900">{animal.color}</span>
                    </div>
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Alzada</span>
                      <span className="font-medium text-gray-900">{animal.alzada} cm</span>
                    </div>
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Criador</span>
                      <span className="font-medium text-gray-900 text-sm">{animal.criador}</span>
                    </div>
                    <div className="bg-[#f4efe4] border border-[#ded2b8] p-3">
                      <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Propietario</span>
                      <span className="font-medium text-gray-900 text-sm">{animal.propietario}</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                {animal.precio && (
                  <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                    <p className="text-3xl font-bold text-[#936f2d]">
                      {formatPrice(animal.precio)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Precio incluye documentación completa</p>
                  </div>
                )}

                {/* Comprar Button */}
                <Button
                  onClick={handleBuyClick}
                  className="w-full px-6 py-4 text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Comprar
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Description Modal */}
      <DescriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        animal={animal} 
      />

      <Footer />
    </>
  );
};

export default ProductDetailPage;
