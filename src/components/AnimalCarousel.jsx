import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AnimalCarousel = ({ animals }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-[389px]:gap-4">
        {animals.map((animal) => (
          <div
            key={animal.id}
            className="border border-[#cdbb91] bg-[#fffdf7] p-4 md:p-5 max-[389px]:p-3.5"
          >
            <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden mb-4 max-[389px]:h-[200px]">
              <img
                src={animal.imagen || animal.fotos?.[0]}
                alt={animal.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#0B0B0B] mb-2 max-[389px]:text-[1.15rem]">
              {animal.nombre}
            </h3>

            <p className="font-inter text-sm text-[#7b5d22] mb-4 tracking-wide uppercase">
              {animal.tipo}
            </p>

            <Button
              onClick={() => navigate(`/venta/${animal.id}`)}
              className="w-full py-2.5 max-[389px]:py-2 max-[389px]:text-sm"
            >
              Ver ficha
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalCarousel;
