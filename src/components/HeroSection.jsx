import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink, 
  backgroundImage, 
  textColor = 'white', 
  overlayOpacity = 0.5,
  buttonTarget = '_self',
  isWhatsApp = false,
  whatsappNumber = '',
  glassTone = 'dark'
}) => {
  const handleButtonClick = () => {
    if (buttonLink) {
      // Handle external links (WhatsApp, URLs)
      if (buttonLink.startsWith('http') || buttonLink.startsWith('https://') || buttonLink.startsWith('tel:')) {
        if (buttonTarget === '_blank') {
          window.open(buttonLink, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = buttonLink;
        }
      } 
      // Handle internal anchor links with smooth scroll
      else if (buttonLink.startsWith('#')) {
        const element = document.querySelector(buttonLink);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const isWhiteText = textColor === 'white';
  const textColorClass = isWhiteText ? 'text-white' : 'text-[#0B0B0B]';
  const descriptionClass = isWhiteText ? 'text-white/90' : 'text-[#334155]';
  const kickerClass = isWhiteText ? 'text-[#F6E5A6]' : 'text-[#9f7d1f]';
  const glassClass = glassTone === 'dark' ? 'premium-glass-dark' : 'premium-glass';

  return (
    <div className="relative w-full h-[320px] md:h-[430px] lg:h-[540px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55" 
        style={{ opacity: Math.min(overlayOpacity + 0.15, 0.85) }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className={`${glassClass} rounded-3xl px-6 md:px-10 py-7 md:py-10 max-w-4xl`}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/20 border border-white/35">
            <Sparkles className={`w-4 h-4 ${kickerClass}`} />
            <span className={`premium-kicker !tracking-[0.14em] ${kickerClass}`}>Linea Paso Real</span>
          </div>
          <h1 className={`font-playfair text-3xl md:text-4xl lg:text-[56px] font-bold ${textColorClass} mb-4 leading-tight max-w-4xl`}>
            {title}
          </h1>
          <p className={`font-inter text-sm md:text-base lg:text-lg ${descriptionClass} mb-8 max-w-3xl leading-relaxed mx-auto`}>
            {description}
          </p>
          {buttonText && buttonLink && (
            <Button
              onClick={handleButtonClick}
              className="px-8 py-3.5 text-sm md:text-base"
            >
              {isWhatsApp && <MessageCircle className="w-5 h-5" />}
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
