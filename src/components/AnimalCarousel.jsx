import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AnimalCarousel = ({ animals }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine items per slide based on screen size
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // Desktop: 3 items
      if (window.innerWidth >= 768) return 2; // Tablet: 2 items
      return 1; // Mobile: 1 item
    }
    return 3;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(animals.length / itemsPerSlide);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const visibleAnimals = animals.slice(
    currentIndex * itemsPerSlide,
    currentIndex * itemsPerSlide + itemsPerSlide
  );

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-10 z-10 bg-white/85 backdrop-blur-lg border border-white/70 rounded-full p-2.5 md:p-3 shadow-lg hover:scale-110 transition-transform duration-200 max-[389px]:left-1 max-[389px]:p-2"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-[#C8A94B] max-[389px]:w-5 max-[389px]:h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-10 z-10 bg-white/85 backdrop-blur-lg border border-white/70 rounded-full p-2.5 md:p-3 shadow-lg hover:scale-110 transition-transform duration-200 max-[389px]:right-1 max-[389px]:p-2"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-[#C8A94B] max-[389px]:w-5 max-[389px]:h-5" />
      </button>

      {/* Carousel Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-[389px]:gap-4">
        {visibleAnimals.map((animal, index) => (
          <div
            key={animal.id}
            className="glass-card rounded-2xl p-4 md:p-5 transition-all duration-300 animate-slide-in-right max-[389px]:p-3.5"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Animal Image */}
            <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-lg mb-4 max-[389px]:h-[200px]">
              <img
                src={animal.imagen || animal.fotos?.[0]}
                alt={animal.nombre}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Animal Name */}
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#0B0B0B] mb-2 max-[389px]:text-[1.15rem]">
              {animal.nombre}
            </h3>

            {/* Animal Type */}
            <p className="font-inter text-sm text-[#6B7280] mb-4 tracking-wide uppercase">
              {animal.tipo}
            </p>

            {/* Ver Detalles Button */}
            <Button
              onClick={() => navigate(`/venta/${animal.id}`)}
              className="w-full py-2.5 max-[389px]:py-2 max-[389px]:text-sm"
            >
              Ver Detalles
            </Button>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#C8A94B] w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimalCarousel;
