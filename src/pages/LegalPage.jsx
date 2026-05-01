import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LegalPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad - Criadero Paso Real</title>
        <meta
          name="description"
          content="Conoce cómo tratamos tus datos personales en Criadero Paso Real."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen premium-page-bg pt-32 pb-16">
        <section id="privacidad" className="max-w-4xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#0B0B0B] mb-8">
            Política de Privacidad
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-6 text-[#374151] leading-relaxed">
            <p>
              En Criadero Paso Real protegemos tu información personal y la
              usamos únicamente para gestionar tu cuenta, responder tus
              solicitudes y procesar pedidos.
            </p>
            <p>
              Los datos que ingresas en formularios de contacto, registro y
              compra se almacenan de forma segura y no se comparten con terceros
              fuera de los servicios necesarios para operar la plataforma.
            </p>
            <p>
              Si deseas actualizar, corregir o eliminar tus datos, puedes
              solicitarlo a través de nuestros canales oficiales de contacto.
            </p>
            <p>
              Esta página puede actualizarse periódicamente para reflejar mejoras
              de seguridad o cambios normativos.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LegalPage;
