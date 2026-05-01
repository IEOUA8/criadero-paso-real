import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Instagram, Facebook, Youtube, Shield, Truck, Phone, User, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUserRole } from '@/hooks/useUserRole';
import ConditionsModal from './ConditionsModal';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import BrandMark from '@/components/BrandMark';

const Footer = () => {
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useUserRole();

  const quickLinks = [
    { name: 'Quiénes Somos', path: '/quienes-somos' },
    { name: 'Reproductores', path: '/reproductores' },
    { name: 'Vientres', path: '/vientres' },
    { name: 'Venta', path: '/venta' },
    { name: 'Blog', path: '/blog' },
    { name: 'Preguntas', path: '/faq' },
    { name: 'Contáctenos', path: '/contacto' },
  ];

  const handleAccountNavigation = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/cuenta');
    }
  };

  const getAccountButtonText = () => {
    if (!isAuthenticated) return 'Ingresar / Mi Cuenta';
    if (isAdmin) return 'Panel de Admin';
    return 'Mi Cuenta';
  };

  return (
    <>
      <footer className="relative overflow-hidden bg-[#0f1115] text-white py-[60px] md:py-[80px] border-t border-[#C8A94B]/30">
        <div className="absolute inset-0 opacity-40 bg-iron-pattern pointer-events-none"></div>
        <div className="absolute -top-32 -left-20 w-72 h-72 rounded-full bg-[#C8A94B]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-36 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 relative z-10">
            {/* Brand */}
            <div className="md:col-span-2 lg:col-span-1 rounded-2xl p-6 bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BrandMark className="w-10 h-10 text-[#C8A94B]" />
                <h3 className="font-playfair text-2xl font-bold text-[#C8A94B] tracking-[0.08em] uppercase">
                  Paso Real
                </h3>
              </div>
              <p className="text-white mb-6 leading-relaxed">
                Burro Criollo Colombiano de Silla. Crianza responsable y respetuosa.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/criaderopasoreal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8A94B] hover:scale-110 transition-smooth"
                  aria-label="Instagram"
                >
                  <Instagram className="w-7 h-7" />
                </a>
                <a
                  href="https://facebook.com/criaderopasoreal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8A94B] hover:scale-110 transition-smooth"
                  aria-label="Facebook"
                >
                  <Facebook className="w-7 h-7" />
                </a>
                <a
                  href="https://youtube.com/@criaderopasoreal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8A94B] hover:scale-110 transition-smooth"
                  aria-label="YouTube"
                >
                  <Youtube className="w-7 h-7" />
                </a>
                <a
                  href="https://wa.me/573208909198"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8A94B] hover:scale-110 transition-smooth"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-7 h-7" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl p-6 bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg">
              <h4 className="font-bold text-lg mb-4 text-[#C8A94B]">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white hover:text-[#C8A94B] transition-smooth text-sm font-medium flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A94B] mr-2 group-hover:scale-125 transition-smooth"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleAccountNavigation}
                    className="text-white hover:text-[#C8A94B] transition-smooth text-sm font-medium flex items-center group mt-2"
                  >
                    <User className="w-4 h-4 mr-2 text-[#C8A94B] group-hover:scale-110 transition-smooth" />
                    {getAccountButtonText()}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="rounded-2xl p-6 bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg">
              <h4 className="font-bold text-lg mb-4 text-[#C8A94B]">Contacto</h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 group">
                  <Mail className="w-5 h-5 text-[#C8A94B] mt-0.5 group-hover:scale-110 transition-smooth" />
                  <a
                    href="mailto:hola@criaderopasoreal.com"
                    className="text-white hover:text-[#C8A94B] transition-smooth font-medium"
                  >
                    hola@criaderopasoreal.com
                  </a>
                </div>
                <div className="flex items-start gap-3 group">
                  <Phone className="w-5 h-5 text-[#C8A94B] mt-0.5 group-hover:scale-110 transition-smooth" />
                  <a
                    href="https://wa.me/573208909198"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#C8A94B] transition-smooth font-medium"
                  >
                    +57 320 890 9198
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl p-6 bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg">
              <h4 className="font-bold text-lg mb-4 text-[#C8A94B]">Garantías</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-white font-medium group">
                  <Shield className="w-5 h-5 text-[#C8A94B] group-hover:scale-110 transition-smooth" />
                  <span>Compra segura y transparente</span>
                </div>
                <button 
                  onClick={() => setIsConditionsModalOpen(true)}
                  className="flex items-start gap-3 text-sm text-white hover:text-[#C8A94B] font-medium transition-smooth text-left group"
                >
                  <Truck className="w-5 h-5 text-[#C8A94B] mt-0.5 group-hover:scale-110 transition-smooth flex-shrink-0" />
                  <span className="underline decoration-[#C8A94B]/50 underline-offset-4">Condiciones de Envío – Garantía de Compra</span>
                </button>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20 mb-8 relative z-10" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white relative z-10">
            <p>© {new Date().getFullYear()} Criadero Paso Real. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="hover:text-[#C8A94B] transition-smooth"
              >
                Política de Privacidad
              </button>
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="hover:text-[#C8A94B] transition-smooth"
              >
                Términos y Condiciones
              </button>
            </div>
          </div>
        </div>
      </footer>

      <ConditionsModal isOpen={isConditionsModalOpen} onClose={() => setIsConditionsModalOpen(false)} />
      <TermsAndConditionsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </>
  );
};

export default Footer;
