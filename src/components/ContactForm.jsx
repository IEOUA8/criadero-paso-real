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
      question: '¿Cuál es tu nombre completo?',
      placeholder: 'Tu nombre completo',
      validation: (val) => (!val || val.length < 3) ? 'El nombre debe tener al menos 3 caracteres' : null,
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
      id: 'phone',
      type: 'tel',
      question: '¿Cuál es tu teléfono o WhatsApp?',
      placeholder: '+57 300 000 0000',
      validation: (val) => (!val || val.length < 7) ? 'Ingresa un número de teléfono válido' : null,
    },
    {
      id: 'city',
      type: 'text',
      question: '¿De qué ciudad o país eres?',
      placeholder: 'Ciudad, País',
      validation: (val) => (!val || val.length < 2) ? 'Ingresa una ciudad o país válido' : null,
    },
    {
      id: 'contact_reason',
      type: 'options',
      question: '¿Cuál es tu motivo de contacto?',
      options: ['Reproductores', 'Saltos', 'Vientres', 'Compra de productos', 'Información general', 'Alianzas o prensa'],
      validation: (val) => !val ? 'Selecciona una opción' : null,
    },
    {
      id: 'message',
      type: 'textarea',
      question: '¿Cuál es tu mensaje?',
      placeholder: 'Escribe tu mensaje aquí...',
      validation: (val) => (!val || val.length < 10) ? 'El mensaje debe tener al menos 10 caracteres' : null,
    },
    {
      id: 'acceptTerms',
      type: 'checkbox',
      question: 'Términos de Privacidad',
      placeholder: 'Acepto la política de privacidad y el tratamiento de mis datos.',
      validation: (val) => !val ? 'Debes aceptar los términos para enviar el mensaje' : null,
    }
  ];

  const handleSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase
      .from('contacts')
      .insert([{
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        contact_reason: data.contact_reason,
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
        className="glass rounded-2xl p-10 text-center max-w-xl mx-auto shadow-xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-[#C8A94B]/20 rounded-full flex items-center justify-center mx-auto mb-6"
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
          className="bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold rounded-2xl px-8"
        >
          Enviar otro mensaje
        </Button>
      </motion.div>
    );
  }

  return (
    <MultiStepForm 
      title="Envíanos un Mensaje" 
      steps={steps} 
      onSubmit={handleSubmit} 
      loading={loading} 
    />
  );
};

export default ContactForm;
