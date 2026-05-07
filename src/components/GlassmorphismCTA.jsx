import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GlassmorphismCTA = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: "🚧 Función en desarrollo",
      description: "Esta función estará disponible pronto. ¡Contáctanos vía WhatsApp!",
    });
    navigate('/contacto');
  };

  return (
    <div className="relative w-full py-24 bg-[url('https://images.unsplash.com/photo-1554145726-b87aa584c850')] bg-cover bg-center bg-fixed my-16">
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 z-10">
        <div className="bg-black/55 border border-white/25 p-10 md:p-16 text-center">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Eleve la genética de su criadero
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Nuestros asesores están disponibles para ayudarle a seleccionar el ejemplar perfecto que se adapte a sus necesidades y objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleContact}
              className="font-semibold text-lg py-6 px-8"
            >
              Contactar Asesor
            </Button>
            <Button 
              variant="outline"
              onClick={handleContact}
              className="bg-transparent border-white text-white hover:bg-white/15 text-lg py-6 px-8"
            >
              Solicitar información
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismCTA;
