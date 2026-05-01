import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import MultiStepForm from './MultiStepForm';
import { CheckCircle2 } from 'lucide-react';

const NewsletterForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const steps = [
    {
      id: 'name',
      type: 'text',
      question: '¿Cuál es tu nombre?',
      placeholder: 'Tu nombre completo',
      validation: (val) => (!val || val.length < 2) ? 'El nombre debe tener al menos 2 caracteres' : null,
    },
    {
      id: 'email',
      type: 'email',
      question: '¿Cuál es tu correo?',
      placeholder: 'ejemplo@correo.com',
      validation: (val) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val) ? null : 'Ingresa un correo electrónico válido';
      },
    },
    {
      id: 'interest',
      type: 'options',
      question: '¿Qué te interesa más?',
      options: ['Reproductores', 'Genética', 'Disponibilidad', 'Blog y noticias', 'Eventos y novedades'],
      validation: (val) => !val ? 'Selecciona una opción' : null,
    },
    {
      id: 'acceptTerms',
      type: 'checkbox',
      question: 'Último paso',
      placeholder: 'Acepto recibir información y la política de privacidad.',
      validation: (val) => !val ? 'Debes aceptar los términos para suscribirte' : null,
    }
  ];

  const handleSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        name: data.name,
        email: data.email,
        interest: data.interest,
        source_page: 'home',
        status: 'active'
      }]);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "Este email ya está suscrito" 
          : "Error al suscribirse. Por favor intenta de nuevo.",
      });
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark rounded-2xl p-10 text-center max-w-xl mx-auto shadow-xl border border-[#C8A94B]/30"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-[#C8A94B]/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-[#C8A94B]" />
        </motion.div>
        <h3 className="font-playfair text-3xl font-bold text-white mb-4">
          ¡Gracias por suscribirte!
        </h3>
        <p className="text-white/80 text-lg">
          Pronto recibirás nuestras últimas noticias y novedades en tu correo.
        </p>
      </motion.div>
    );
  }

  return (
    <MultiStepForm 
      title="Suscríbete al Boletín" 
      steps={steps} 
      onSubmit={handleSubmit} 
      loading={loading}
      darkMode={true}
    />
  );
};

export default NewsletterForm;