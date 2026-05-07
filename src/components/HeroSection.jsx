import React from 'react';
import { MessageCircle } from 'lucide-react';
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
  const descriptionClass = isWhiteText ? 'text-white/85' : 'text-[#514638]';

  return (
    <div className="relative w-full h-[360px] md:h-[460px] lg:h-[560px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-black/10" 
        style={{ opacity: Math.min(overlayOpacity + 0.25, 0.9) }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-end px-4 pb-9 md:pb-12">
        <div className="w-full max-w-6xl mx-auto">
          <p className="text-[#e2c875] uppercase tracking-[0.14em] text-[11px] md:text-xs font-semibold mb-3">
            Criadero Paso Real
          </p>
          <h1 className={`font-playfair text-3xl md:text-4xl lg:text-[46px] font-semibold ${textColorClass} mb-3 leading-tight max-w-3xl`}>
            {title}
          </h1>
          <p className={`font-inter text-sm md:text-base ${descriptionClass} mb-5 max-w-2xl leading-relaxed`}>
            {description}
          </p>
          {buttonText && buttonLink && (
            <Button
              onClick={handleButtonClick}
              className="px-6 py-3 text-sm"
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
