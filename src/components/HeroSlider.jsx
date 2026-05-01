import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://horizons-cdn.hostinger.com/a7398847-0a7c-428f-92c4-ea6e8d5a0d88/88baf9f7b5f30cb1dc55f947802c518e.jpg',
    },
    {
      image: 'https://horizons-cdn.hostinger.com/a7398847-0a7c-428f-92c4-ea6e8d5a0d88/feec3eb8c68d73abff9bdd2e92d2cd10.jpg',
    },
    {
      image: 'https://horizons-cdn.hostinger.com/a7398847-0a7c-428f-92c4-ea6e8d5a0d88/8d500f5935edc10e2ac557bdf33cf842.jpg',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Swipe handling
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  return (
    <div 
      className="relative h-[460px] md:h-[620px] lg:h-[760px] w-full overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.img
            src={slides[currentSlide].image}
            alt="Burro Criollo Colombiano de Silla"
            loading="lazy"
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: 9, ease: "linear" }}
            className="w-full h-full object-cover object-[center_42%]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(200,169,75,0.25),transparent_34%)]"></div>

      {/* Hero content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 md:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="text-[#E9D498] uppercase tracking-[0.24em] text-[11px] md:text-xs font-semibold mb-4">
              Criadero Paso Real
            </p>
            <h1 className="font-playfair text-white text-[34px] leading-[1.08] md:text-[52px] lg:text-[66px] font-semibold mb-5">
              Burro Criollo Colombiano de Silla
            </h1>
            <p className="text-white/85 text-sm md:text-lg leading-relaxed max-w-2xl mb-8">
              Genética probada, crianza responsable y una línea de ejemplares diseñada para elevar tu programa de reproducción.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                onClick={() => navigate('/reproductores')}
                className="px-7 py-6 text-base rounded-full"
              >
                Ver Reproductores
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <button
                onClick={() => navigate('/quienes-somos')}
                className="text-white/90 hover:text-white transition-colors text-sm md:text-base"
              >
                Conocer el criadero
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-5 md:left-7 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/35 text-white p-3 rounded-full backdrop-blur-md border border-white/30 transition-smooth hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-5 md:right-7 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/35 text-white p-3 rounded-full backdrop-blur-md border border-white/30 transition-smooth hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-7 md:bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-smooth ${
              index === currentSlide ? 'bg-[#E9D498] w-9' : 'bg-white/45 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
        <span className="text-[11px] text-white/75 tracking-[0.18em] ml-1">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default HeroSlider;
