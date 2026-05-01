import React from 'react';
import { AlertCircle } from 'lucide-react';

const ReproductiveDisclaimer = () => {
  return (
    <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-lg p-5 flex gap-3">
      <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
      <p className="font-inter text-sm text-[#374151] leading-relaxed">
        Al adquirir este servicio, acepto que los procesos reproductivos son de{' '}
        <strong>naturaleza biológica</strong> y{' '}
        <strong>no garantizan</strong> resultados como preñez o nacimiento. 
        Entiendo que{' '}
        <strong>no aplica reembolso</strong> una vez iniciado el proceso.
      </p>
    </div>
  );
};

export default ReproductiveDisclaimer;