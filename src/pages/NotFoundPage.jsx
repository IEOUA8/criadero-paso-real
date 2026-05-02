import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteUrl } from '@/lib/siteUrl';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const siteUrl = getSiteUrl();

  return (
    <>
      <Helmet>
        <title>Página no encontrada - Criadero Paso Real</title>
        <meta name="description" content="La página que buscas no existe. Regresa a la página principal de Criadero Paso Real." />
        <link rel="canonical" href={`${siteUrl}/404`} />
        <meta property="og:url" content={`${siteUrl}/404`} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen flex items-center justify-center premium-page-bg pt-20">
        <div className="text-center px-4">
          <h1 className="font-playfair text-9xl font-bold text-[#C8A94B] mb-4">404</h1>
          <h2 className="font-playfair text-4xl font-bold text-[#0B0B0B] mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-white"
          >
            <Home className="mr-2 w-4 h-4" />
            Volver al inicio
          </Button>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default NotFoundPage;
