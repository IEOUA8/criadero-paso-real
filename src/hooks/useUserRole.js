import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to retrieve current user's authentication status and role
 * Centralizes role-based logic across the application
 * 
 * @returns {Object} User role information
 * @returns {Object} user - Current authenticated user object
 * @returns {string|null} role - User's role (e.g., 'admin', 'user', 'moderator')
 * @returns {boolean} isAdmin - True if user has admin role
 * @returns {boolean} isModerator - True if user has moderator role
 * @returns {boolean} isUser - True if user has regular user role
 * @returns {boolean} isAuthenticated - True if user is logged in
 * @returns {boolean} loading - True if authentication state is loading
 */
export function useUserRole() {
  const { user, userProfile, loading, isAdmin: contextIsAdmin, isEditor } = useAuth();

  const roleData = useMemo(() => {
    const role = userProfile?.rol?.toLowerCase() || null;

    return {
      user,
      role,
      isAdmin: role === 'admin',
      isModerator: role === 'moderator',
      isUser: role === 'user',
      isAuthenticated: !!user,
      loading,
      userProfile,
      // Helper method to check if user has any of the specified roles
      hasRole: (roles) => {
        if (!role) return false;
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        return rolesArray.map(r => r.toLowerCase()).includes(role);
      },
      // Helper method to get user's display name
      getDisplayName: () => {
        if (!userProfile) return null;
        return `${userProfile.nombre || ''} ${userProfile.apellidos || ''}`.trim() || userProfile.nombre || 'Usuario';
      },
    };
  }, [user, userProfile, loading, contextIsAdmin, isEditor]);

  return roleData;
}