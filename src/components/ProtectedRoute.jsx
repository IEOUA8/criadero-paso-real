import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

/**
 * ProtectedRoute component - Enforces authentication and role-based access control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {boolean} props.requireAdmin - If true, requires admin role
 * @param {boolean} props.requireAuth - If true, requires any authenticated user (default: true)
 * @param {string} props.redirectTo - Custom redirect path (default: '/login' or '/cuenta')
 */
const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = true, redirectTo = null }) => {
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but requires admin role
  if (requireAdmin) {
    const userRole = userProfile?.rol?.toLowerCase();
    
    if (userRole !== 'admin') {
      // Show unauthorized toast notification
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Acceso Denegado",
          description: "No tienes permisos de administrador para acceder a esta sección.",
          duration: 5000,
        });
      }, 100);

      // Redirect to user account page
      return <Navigate to="/cuenta" replace />;
    }
  }

  // User is authorized - render children
  return children;
};

export default ProtectedRoute;