import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Instagram as InstagramIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstagramSection = () => {
  const instagramPosts = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=800&fit=crop',
      likes: 342,
      comments: 28,
      caption: 'Crianza en libertad 🐴'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1544355051-09eb1746a606?w=800&h=800&fit=crop',
      likes: 521,
      comments: 42,
      caption: 'Genética de campeones'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1689973846749-bf16930637e4?w=800&h=800&fit=crop',
      likes: 289,
      comments: 19,
      caption: 'Tradición patrimonial'
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1554145726-b87aa584c850?w=800&h=800&fit=crop',
      likes: 408,
      comments: 35,
      caption: 'Excelencia reproductiva'
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=800&h=800&fit=crop',
      likes: 467,
      comments: 31,
      caption: 'Pasión por la cría'
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=800&fit=crop',
      likes: 395,
      comments: 24,
      caption: 'Nuestros ejemplares'
    }
  ];

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
            Síguenos en Instagram
          </h2>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Mantente al día con las últimas noticias, eventos y momentos especiales de nuestro criadero en nuestra comunidad de Instagram.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={`https://instagram.com/CriaderopasoReal`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative block overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-smooth"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white flex gap-6">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6 fill-white" />
                      <span className="font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 fill-white" />
                      <span className="font-bold">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => window.open('https://instagram.com/CriaderopasoReal', '_blank')}
            className="bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-smooth"
          >
            <InstagramIcon className="w-5 h-5 mr-2" />
            Ver más en Instagram
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramSection;