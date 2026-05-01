import React from 'react';
import { Star, User } from 'lucide-react';

const AnimalReviews = () => {
  // Placeholder reviews
  const reviews = [
    {
      id: 1,
      name: "Carlos Restrepo",
      date: "12 Oct 2023",
      rating: 5,
      comment: "Excelente genética, los animales de Criadero Paso Real siempre cumplen con los más altos estándares. Muy satisfecho con la atención."
    },
    {
      id: 2,
      name: "María Fernanda Gómez",
      date: "05 Nov 2023",
      rating: 4,
      comment: "Un animal con mucho brío y excelente paso. El proceso de compra fue transparente y profesional."
    },
    {
      id: 3,
      name: "Hacienda El Rocío",
      date: "20 Ene 2024",
      rating: 5,
      comment: "Hemos adquirido varios ejemplares para cría y los resultados han sido inmejorables. Recomendados al 100%."
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-[#C8A94B] text-[#C8A94B]' : 'fill-gray-200 text-gray-200'}`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h3 className="font-playfair text-2xl font-bold text-[#0B0B0B] mb-6 border-b border-gray-100 pb-4">
        Reseñas de Compradores
      </h3>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3 pl-13">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalReviews;