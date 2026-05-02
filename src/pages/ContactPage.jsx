import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import ContactInfoCards from '@/components/ContactInfoCards';
import { getSiteUrl } from '@/lib/siteUrl';

const ContactPage = () => {
  const siteUrl = getSiteUrl();

  return (
    <>
      <Helmet>
        <title>Contáctenos - Criadero Paso Real</title>
        <meta name="description" content="Ponte en contacto con Criadero Paso Real. Estamos aquí para resolver tus dudas sobre nuestros burros criollos colombianos." />
        <link rel="canonical" href={`${siteUrl}/contacto`} />
        <meta property="og:url" content={`${siteUrl}/contacto`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-16 pt-8"
          >
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-[#0B0B0B] mb-6">
              Contáctenos
            </h1>
            <p className="text-[#0B0B0B] text-lg max-w-2xl mx-auto">
              ¿Tienes alguna pregunta sobre nuestros animales, genética o servicios? 
              Estamos aquí para asesorarte en cada paso.
            </p>
          </motion.div>

          {/* Contact Info Cards Section */}
          <section className="bg-[#f8f6ef] border border-[#E7DFC7] rounded-3xl py-20 md:py-24 lg:py-28 px-6 md:px-10 lg:px-12 mb-20 md:mb-24 lg:mb-28 relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 md:mb-16"
              >
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-4">
                  ¿Cómo podemos ayudarte?
                </h2>
                <p className="text-[#374151] text-base md:text-lg max-w-3xl mx-auto">
                  Explora las diferentes formas en que puedes conectarte con Criadero Paso Real
                </p>
              </motion.div>
              
              <ContactInfoCards />
            </div>
          </section>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Contact Info (Sidebar) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#C8A94B]/20">
                <h2 className="font-playfair text-2xl font-bold text-[#0B0B0B] mb-8">
                  Información Directa
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C8A94B]/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                      <Mail className="w-6 h-6 text-[#C8A94B]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-1">Email</h3>
                      <a href="mailto:hola@criaderopasoreal.com" className="text-[#0B0B0B] font-medium hover:text-[#C8A94B] transition-colors">
                        hola@criaderopasoreal.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                      <MessageSquare className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-1">WhatsApp</h3>
                      <a href="https://wa.me/573208909198" target="_blank" rel="noopener noreferrer" className="text-[#0B0B0B] font-medium hover:text-[#25D366] transition-colors">
                        +57 320 890 9198
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-1">Llamadas</h3>
                      <a href="tel:+573208909198" className="text-[#0B0B0B] font-medium hover:text-blue-600 transition-colors">
                        +57 320 890 9198
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Horario de Atención</h3>
                  <div className="space-y-2 text-[#0B0B0B] font-medium">
                    <p className="flex justify-between"><span>Lunes - Viernes:</span> <span>8:00 AM - 6:00 PM</span></p>
                    <p className="flex justify-between"><span>Sábados:</span> <span>9:00 AM - 2:00 PM</span></p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4 }} 
              className="lg:col-span-8"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
