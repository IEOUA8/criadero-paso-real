import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AnimalCard = ({ animal }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Animal Image */}
      <div className="w-full h-[300px] overflow-hidden rounded-lg mb-4">
        <img
          src={animal.imagen || animal.fotos?.[0]}
          alt={animal.nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Animal Name */}
      <h3 className="font-playfair text-xl font-bold text-[#0B0B0B] mb-2">
        {animal.nombre}
      </h3>

      {/* Animal Type */}
      <p className="font-inter text-sm text-[#6B7280] mb-4">
        {animal.tipo}
      </p>

      {/* Ver Detalles Button */}
      <Button
        onClick={() => navigate(`/venta/${animal.id}`)}
        className="w-full py-2.5"
      >
        Ver Detalles
      </Button>
    </div>
  );
};

export default AnimalCard;
