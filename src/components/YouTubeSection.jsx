import React from 'react';
import { motion } from 'framer-motion';

const YouTubeSection = () => {
  // Replace with actual Don Ramón institutional video URL
  const videoId = 'dQw4w9WgXcQ';

  return (
    <section className="bg-[#F4F5F7] py-[60px] md:py-[80px] lg:py-[100px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#C8A94B] mb-4">
            Genética de Campeones
          </h2>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Descubre la excelencia de nuestro criadero y conoce la pasión que nos impulsa a criar burros criollos colombianos de silla de la más alta calidad.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-[900px] mx-auto"
        >
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black">
            <div className="relative pb-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video institucional Criadero Paso Real"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeSection;