import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewsletterForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmedEmail)) {
      toast({
        variant: "destructive",
        title: "Correo inválido",
        description: "Ingresa un correo electrónico válido.",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        name: trimmedEmail.split('@')[0],
        email: trimmedEmail,
        interest: 'boletin',
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
    setEmail('');
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-[#C8A94B]/30 bg-[#101010] p-8 text-center max-w-xl mx-auto"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 bg-[#C8A94B]/15 rounded-md flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-8 h-8 text-[#C8A94B]" />
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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto border border-[#C8A94B]/35 bg-[#101010] p-4 md:p-5"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Correo electrónico
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8A94B]" />
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            className="w-full h-12 bg-[#fffdf7] border border-[#d7c79f] pl-10 pr-4 text-[#18140e] outline-none focus:border-[#C8A94B]"
            disabled={loading}
          />
        </div>
        <Button type="submit" className="h-12 px-7" disabled={loading}>
          {loading ? 'Enviando...' : 'Suscribirme'}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterForm;
