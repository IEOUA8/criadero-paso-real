import React from 'react';
import { Award, Shield, Users } from 'lucide-react';

const indicators = [
  {
    icon: Award,
    title: 'Genética Certificada',
    description: 'Todos nuestros ejemplares cuentan con documentación y certificación de su línea genética.'
  },
  {
    icon: Shield,
    title: 'Sanidad Garantizada',
    description: 'Programas de salud integral y vacunación completa para cada animal.'
  },
  {
    icon: Users,
    title: 'Asesoría Integral',
    description: 'Acompañamiento profesional en la selección y adaptación de tus nuevos ejemplares.'
  }
];

const IndicatorsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 max-[389px]:gap-4">
      {indicators.map((indicator, index) => {
        const Icon = indicator.icon;
        return (
          <div
            key={index}
            className="border border-[#cdbb91] bg-[#fffdf7] p-5 md:p-8 text-center max-[389px]:p-4"
          >
            <div className="flex justify-center mb-4">
              <div className="premium-icon-chip">
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#C8A94B]" />
              </div>
            </div>
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#0B0B0B] mb-3 max-[389px]:text-[1.15rem]">
              {indicator.title}
            </h3>
            <p className="premium-description text-sm text-justify-desktop max-[389px]:text-[0.9rem]">
              {indicator.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default IndicatorsSection;
