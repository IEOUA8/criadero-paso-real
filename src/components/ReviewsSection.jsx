import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Carlos Ramírez',
      photo: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Excelente criadero, la genética de sus burros es excepcional. Compré un salto de Candidato y los resultados superaron mis expectativas. Profesionalismo y transparencia en todo el proceso.',
      date: '15 de marzo, 2026'
    },
    {
      id: 2,
      name: 'María Elena Torres',
      photo: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      text: 'La crianza en libertad se nota en la calidad de los animales. Mi vientre ha dado crías hermosas gracias a la genética de Paso Real. Muy recomendado.',
      date: '2 de marzo, 2026'
    },
    {
      id: 3,
      name: 'Jorge Andrés Patiño',
      photo: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      text: 'Asesoría personalizada de primer nivel. Me guiaron en todo el proceso de compra y el seguimiento post-venta es impecable. Los mejores en burro criollo colombiano.',
      date: '18 de febrero, 2026'
    },
    {
      id: 4,
      name: 'Ana Lucía Mendoza',
      photo: 'https://i.pravatar.cc/150?img=26',
      rating: 5,
      text: 'Tradición y excelencia. He visitado varios criaderos y Paso Real destaca por su manejo técnico y amor por los animales. La inversión vale cada peso.',
      date: '5 de febrero, 2026'
    },
    {
      id: 5,
      name: 'Roberto Castellanos',
      photo: 'https://i.pravatar.cc/150?img=52',
      rating: 5,
      text: 'Compré dos burras de vientre y estoy muy satisfecho. La trazabilidad genética es completa y el soporte técnico excepcional. Sin duda volveré a comprar.',
      date: '28 de enero, 2026'
    },
    {
      id: 6,
      name: 'Patricia Gómez',
      photo: 'https://i.pravatar.cc/150?img=47',
      rating: 5,
      text: 'La mejor decisión para mi proyecto de cría. Los animales llegan en perfectas condiciones y la garantía de compra es real. Altamente recomendado.',
      date: '12 de enero, 2026'
    }
  ];

  return (
    <section className="bg-[#0B0B0B] py-[42px] md:py-[56px] lg:py-[70px] relative overflow-hidden">
      <div className="absolute inset-0 bg-iron-pattern opacity-5 pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#C8A94B] mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            La confianza de nuestros clientes es nuestro mayor logro. Lee lo que opinan quienes han confiado en nosotros.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-[#C8A94B]/30 bg-[#101010] p-6 transition-smooth"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-12 h-12 object-cover border-2 border-[#C8A94B]/50"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base">{review.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-[#C8A94B] text-[#C8A94B]'
                            : 'fill-gray-600 text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-white text-sm leading-relaxed mb-3">
                "{review.text}"
              </p>
              
              <p className="text-gray-500 text-xs">
                {review.date}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Criadero+Paso+Real', '_blank')}
            className="font-bold px-8 py-6"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Ver todas las reseñas
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
