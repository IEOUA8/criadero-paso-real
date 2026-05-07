import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import MultiStepForm from './MultiStepForm';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const steps = [
    {
      id: 'full_name',
      type: 'text',
      question: 'Nombre',
      placeholder: 'Nombre completo',
      validation: (val) => (!val || val.length < 2) ? 'Ingresa tu nombre' : null,
    },
    {
      id: 'phone',
      type: 'tel',
      question: 'Teléfono',
      placeholder: '+57 300 000 0000',
      validation: (val) => (!val || val.length < 7) ? 'Ingresa un número de teléfono válido' : null,
    },
    {
      id: 'city',
      type: 'text',
      question: 'Ciudad',
      placeholder: 'Ciudad',
      validation: (val) => (!val || val.length < 2) ? 'Ingresa tu ciudad' : null,
    },
    {
      id: 'message',
      type: 'textarea',
      question: 'Comentario',
      placeholder: 'Escribe tu comentario aquí...',
      validation: (val) => (!val || val.length < 5) ? 'Ingresa tu comentario' : null,
    },
  ];

  const handleSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase
      .from('contacts')
      .insert([{
        full_name: data.full_name,
        phone: data.phone,
        city: data.city,
        contact_reason: 'Registro y comentarios',
        message: data.message,
        source_page: 'contacto',
        status: 'nuevo'
      }]);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema enviando tu mensaje. Por favor intenta de nuevo.",
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
        className="border border-[#cdbb91] bg-[#fffdf7] p-10 text-center max-w-xl mx-auto"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 bg-[#C8A94B]/15 rounded-md flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-[#C8A94B]" />
        </motion.div>
        <h3 className="font-playfair text-3xl font-bold text-[#0B0B0B] mb-4">
          ¡Mensaje enviado con éxito!
        </h3>
        <p className="text-gray-600 text-lg mb-8">
          Gracias por contactarnos. Nuestro equipo se comunicará contigo muy pronto.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          className="font-bold px-8"
        >
          Enviar otro mensaje
        </Button>
      </motion.div>
    );
  }

  return (
    <MultiStepForm 
      title="Registro y comentarios" 
      steps={steps} 
      onSubmit={handleSubmit} 
      loading={loading} 
    />
  );
};

export default ContactForm;
