import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useCart } from '@/contexts/CartContext';
import BrandMark from '@/components/BrandMark';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user, role, isAdmin, isAuthenticated, getDisplayName } = useUserRole();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Quiénes Somos', path: '/quienes-somos' },
    { name: 'Reproductores', path: '/reproductores' },
    { name: 'Vientres', path: '/vientres' },
    { name: 'Venta', path: '/venta' },
    { name: 'Blog', path: '/blog' },
    { name: 'Preguntas', path: '/faq' },
    { name: 'Contáctenos', path: '/contacto' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/cuenta');
    }
  };

  const getRoleBadgeText = () => {
    if (!role) return null;
    if (role === 'admin') return 'Admin';
    if (role === 'moderator') return 'Moderador';
    return null; // Don't show badge for regular users
  };

  const roleBadgeText = getRoleBadgeText();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled 
          ? 'h-[76px] md:h-[88px] glass-header-dark' 
          : 'h-[76px] md:h-[88px] bg-[#0B0B0B] border-b border-[#C8A94B]/25'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <BrandMark className="w-9 h-9 md:w-10 md:h-10 text-[#C8A94B] group-hover:text-[#F1DE9A] transition-smooth" />
            <div className="leading-tight">
              <p className="font-playfair text-xl md:text-2xl font-bold uppercase tracking-[0.12em] text-[#C8A94B] group-hover:text-[#F1DE9A] transition-smooth">
                Paso Real
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-[#C8A94B] hover:text-[#F1DE9A] transition-smooth text-sm font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#C8A94B] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart Icon */}
            <button
              onClick={() => navigate('/carrito')}
              className="relative text-[#C8A94B] hover:text-[#F1DE9A] transition-smooth p-2.5 rounded-xl hover:bg-white/10"
              aria-label="Carrito de compras"
              title="Ir al carrito"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-[#c2410c] text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full"
                >
                  {itemCount}
                </Badge>
              )}
            </button>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-[#C8A94B] hover:text-[#F1DE9A] transition-smooth p-2.5 rounded-xl hover:bg-white/10">
                    <User className="w-5 h-5 md:w-6 md:h-6" />
                    {roleBadgeText && (
                      <Badge className="hidden md:flex bg-[#C8A94B] text-black text-xs px-2 py-0.5">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {roleBadgeText}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl bg-[#141414]/95 backdrop-blur-xl border border-[#C8A94B]/30 shadow-xl">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-[#F5E9BF]">{getDisplayName()}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                    {roleBadgeText && (
                      <Badge className="mt-2 bg-[#C8A94B]/10 text-[#C8A94B] text-xs">
                        {roleBadgeText}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  
                  {isAdmin ? (
                    <>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin')} 
                        className="rounded-md cursor-pointer text-[#F5E9BF] hover:bg-[#C8A94B]/15 font-medium"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Panel de Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/cuenta')} 
                        className="rounded-md cursor-pointer text-[#E5E7EB] hover:bg-white/10"
                      >
                        Mi Cuenta
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem 
                      onClick={() => navigate('/cuenta')} 
                      className="rounded-md cursor-pointer text-[#E5E7EB] hover:bg-white/10"
                    >
                      Mi Cuenta
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="rounded-md cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={handleProfileClick}
                className="text-[#C8A94B] hover:text-[#F1DE9A] transition-smooth p-2.5 rounded-xl hover:bg-white/10"
                aria-label="Ingresar"
                title="Ingresar a mi cuenta"
              >
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#C8A94B] p-2.5 rounded-xl hover:text-[#F1DE9A] hover:bg-white/10 transition-smooth"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-[#0B0B0B]/97 backdrop-blur-xl border-t border-[#C8A94B]/25 shadow-lg"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-[#C8A94B] hover:text-[#F1DE9A] transition-smooth py-2 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
