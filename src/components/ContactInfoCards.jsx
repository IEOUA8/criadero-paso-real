import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, Share2, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ContactInfoCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: MessageCircle,
      title: '¡Queremos saber lo que piensas!',
      description: 'Tu opinión es invaluable para nosotros. Comparte tus sugerencias, experiencias o cualquier comentario que nos ayude a mejorar.',
      buttonText: 'Enviar Feedback',
      action: () => window.location.href = 'mailto:hola@criaderopasoreal.com?subject=Feedback - Criadero Paso Real'
    },
    {
      icon: HelpCircle,
      title: '¿Tienes alguna pregunta?',
      description: 'Consulta nuestra sección de preguntas frecuentes donde encontrarás respuestas sobre burros criollos, reproducción, compra y más.',
      buttonText: 'Ver Preguntas Frecuentes',
      action: () => navigate('/faq')
    },
    {
      icon: Share2,
      title: '¿Quieres compartir tu historia criando Asnales o Mulares?',
      description: 'Nos encantaría conocer tu experiencia en la cría. Tu historia puede inspirar y educar a otros criadores de la comunidad.',
      buttonText: 'Compartir Historia',
      action: () => window.location.href = 'mailto:hola@criaderopasoreal.com?subject=Mi Historia - Cría de Asnales/Mulares'
    },
    {
      icon: Users,
      title: '¿Estás en la búsqueda de una comunidad de Cría de Asnales?',
      description: 'Únete a nuestra comunidad en Facebook donde criadores comparten conocimientos, experiencias y se apoyan mutuamente.',
      buttonText: 'Unirse a la Comunidad',
      action: () => window.open('https://facebook.com/criaderopasoreal', '_blank', 'noopener,noreferrer')
    },
    {
      icon: MapPin,
      title: '¿Quieres conocer más sobre nuestro Criadero?',
      description: 'Agenda una visita guiada a nuestras instalaciones. Conoce nuestros animales, instalaciones y métodos de crianza responsable.',
      buttonText: 'Agendar Visita',
      action: () => window.location.href = 'mailto:hola@criaderopasoreal.com?subject=Solicitud de Visita - Criadero Paso Real'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#1A1A1A] border border-[#C8A94B]/25"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-[#C8A94B]/20 rounded-full flex items-center justify-center border border-[#C8A94B]/25">
              <card.icon className="w-10 h-10 text-[#C8A94B]" strokeWidth={2} />
            </div>

            <div className="space-y-3">
              <h3 className="font-inter text-lg font-bold text-white leading-tight">
                {card.title}
              </h3>
              <p className="font-inter text-sm text-[#d1d5db] leading-relaxed">
                {card.description}
              </p>
            </div>

            <Button
              onClick={card.action}
              className="w-full py-6 text-base"
            >
              {card.buttonText}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactInfoCards;
