import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  User, 
  ShoppingBag, 
  Package, 
  Heart, 
  Sparkles,
  FileText,
  Tags,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const AdminSidebar = ({ isOpen, onToggle, isMobile }) => {
  const location = useLocation();
  const { currentUser, signOut } = useAuth();
  const { toast } = useToast();

  const navigationItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/perfil', icon: User, label: 'Perfil' },
    { path: '/admin/pedidos', icon: ShoppingBag, label: 'Mis Pedidos' },
    { path: '/admin/ventas', icon: Package, label: 'Panel de Ventas' },
    { path: '/admin/vientres', icon: Heart, label: 'Panel de Vientres' },
    { path: '/admin/reproductores', icon: Sparkles, label: 'Panel de Reproductores' },
    { path: '/admin/categorias', icon: Tags, label: 'Categorías' },
    { path: '/admin/blog', icon: FileText, label: 'Blog' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const getInitials = () => {
    if (!currentUser?.nombre) return 'U';
    const names = currentUser.nombre.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.nombre.substring(0, 2).toUpperCase();
  };

  if (!isOpen && isMobile) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-[#1a1a1a] text-white z-50
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isMobile ? 'w-[280px]' : isOpen ? 'w-[280px]' : 'w-[80px]'}
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C8A94B] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-playfair font-bold text-lg whitespace-nowrap">Criadero</h2>
                  <p className="text-xs text-white/70 whitespace-nowrap">Paso Real</p>
                </div>
              </div>
            )}
            
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-white hover:bg-white/10 ml-auto"
              >
                {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-[#C8A94B]">
              <AvatarImage src={currentUser?.foto_perfil} alt={currentUser?.nombre} />
              <AvatarFallback className="bg-[#C8A94B] text-white font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate">
                  {currentUser?.nombre} {currentUser?.apellidos}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {currentUser?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {/* Home Button - Separated */}
            <Link
              to="/"
              onClick={isMobile ? onToggle : undefined}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                text-white/90 hover:bg-[#C8A94B]/10 hover:text-[#C8A94B]
                ${!isOpen && 'justify-center'}
              `}
            >
              <Home className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
              {isOpen && (
                <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  🏠 Inicio
                </span>
              )}
            </Link>

            <Separator className="my-4 bg-white/10" />

            {/* Admin Navigation Items */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={isMobile ? onToggle : undefined}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active 
                      ? 'bg-[#C8A94B] text-white font-semibold shadow-lg' 
                      : 'text-white/90 hover:bg-[#C8A94B]/10 hover:text-[#C8A94B]'
                    }
                    ${!isOpen && 'justify-center'}
                  `}
                >
                  <Icon className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
                  {isOpen && (
                    <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-white/90 hover:bg-red-500/20 hover:text-red-300
              transition-all duration-200
              ${!isOpen && 'justify-center'}
            `}
          >
            <LogOut className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
            {isOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
