import React from 'react';
import { Badge } from '@/components/ui/badge';

const AnimalTechnicalData = ({ animal }) => {
  const isDisponible = animal.estado === 'Disponible';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-playfair text-xl font-bold text-[#0B0B0B]">Ficha Técnica</h3>
        <Badge className={`${isDisponible ? 'bg-[#10B981] hover:bg-[#10B981]/90' : 'bg-[#F97316] hover:bg-[#F97316]/90'} text-white`}>
          {animal.estado}
        </Badge>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between md:justify-start gap-4 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
            <span className="text-gray-500 font-medium min-w-[100px]">Sexo</span>
            <span className="font-semibold text-gray-900">{animal.sexo}</span>
          </div>
          <div className="flex justify-between md:justify-start gap-4 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
            <span className="text-gray-500 font-medium min-w-[100px]">Edad</span>
            <span className="font-semibold text-gray-900">{animal.edad} Años</span>
          </div>
          <div className="flex justify-between md:justify-start gap-4 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
            <span className="text-gray-500 font-medium min-w-[100px]">Raza</span>
            <span className="font-semibold text-gray-900">{animal.raza}</span>
          </div>
          <div className="flex justify-between md:justify-start gap-4 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
            <span className="text-gray-500 font-medium min-w-[100px]">Color</span>
            <span className="font-semibold text-gray-900">{animal.color}</span>
          </div>
          <div className="flex justify-between md:justify-start gap-4 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
            <span className="text-gray-500 font-medium min-w-[100px]">Alzada</span>
            <span className="font-semibold text-gray-900">{animal.alzada} cm</span>
          </div>
          <div className="flex justify-between md:justify-start gap-4 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
            <span className="text-gray-500 font-medium min-w-[100px]">Criador</span>
            <span className="font-semibold text-gray-900">{animal.criador}</span>
          </div>
          <div className="flex justify-between md:justify-start gap-4 col-span-1 md:col-span-2">
            <span className="text-gray-500 font-medium min-w-[100px]">Propietario</span>
            <span className="font-semibold text-gray-900">{animal.propietario}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalTechnicalData;