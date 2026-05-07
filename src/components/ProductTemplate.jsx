import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Info, CheckCircle2, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// A reusable template for products (animals, supplements, semen, etc.)
const ProductTemplate = ({ product, type = 'animal' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    toast({
      title: "Redirigiendo",
      description: "Preparando la pasarela de pago...",
    });
    // Normally would add to cart or context here
    navigate('/checkout');
  };

  return (
    <div className="bg-[#fffdf7] border border-[#cdbb91] overflow-hidden flex flex-col h-full group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.fotos?.[0] || product.image || 'https://images.unsplash.com/photo-1599053581540-248ea75b59cb'} 
          alt={product.nombre || product.title} 
          className="w-full h-full object-cover"
        />
        {product.estado && (
          <div className="absolute top-4 right-4 bg-[#fffdf7] px-3 py-1 text-sm font-bold text-black border border-[#C8A94B]/30">
            {product.estado}
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow bg-[#fffdf7] relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-iron-pattern pointer-events-none opacity-5"></div>
        
        <h3 className="font-playfair text-2xl font-bold text-[#0B0B0B] mb-2">{product.nombre || product.title}</h3>
        
        {product.raza && <p className="text-[#C8A94B] font-bold text-sm mb-4">{product.raza}</p>}
        {product.subtitle && <p className="text-[#C8A94B] font-bold text-sm mb-4">{product.subtitle}</p>}
        
        <p className="font-inter text-[#374151] mb-6 text-sm leading-relaxed flex-grow">
          {product.descripcion || product.description}
        </p>

        {product.precio && (
          <div className="mb-6">
            <p className="text-3xl font-bold text-[#0B0B0B]">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.precio)}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-auto">
          <Button 
            onClick={handleCheckout}
            className="w-full font-bold py-6"
          >
            Adquirir
          </Button>
          <Button 
            onClick={() => window.open(`https://wa.me/573208909198?text=Hola, estoy interesado en ${product.nombre || product.title}`, '_blank')}
            variant="outline"
            className="w-full border-[#25D366] text-[#1f8f4d] hover:bg-[#eaf7ef] font-bold py-6"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Consultar por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTemplate;
