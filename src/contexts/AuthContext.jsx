import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { VALID_ROLES, DEFAULT_ROLE } from '@/constants/roles';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async (userId) => {
    if (!userId) {
      setUserProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      await loadUserProfile(session.user.id);
    } else {
      setUserProfile(null);
    }
    
    setLoading(false);
  }, [loadUserProfile]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, profileData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error.message,
      });
      return { error };
    }

    if (data.user) {
      // Ensure role is lowercase and valid
      let roleToInsert = DEFAULT_ROLE;
      if (profileData.rol) {
        const normalizedRole = profileData.rol.toLowerCase();
        roleToInsert = VALID_ROLES.includes(normalizedRole) ? normalizedRole : DEFAULT_ROLE;
      }

      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            nombre: profileData.nombre || '',
            apellidos: profileData.apellidos || '',
            teléfono: profileData.teléfono || null,
            ciudad: profileData.ciudad || null,
            rol: roleToInsert
          });

        if (profileError) throw profileError;

        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente.",
        });
      } catch (err) {
        console.error('Constraint violation or insertion error:', err);
        toast({
          variant: "destructive",
          title: "Error al crear perfil",
          description: err.message || "Error de restricción al crear el perfil.",
        });
        return { error: err };
      }
    }

    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "¡Bienvenido!",
      description: "Has iniciado sesión correctamente.",
    });

    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error.message,
      });
      return { error };
    }

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });

    return { error: null };
  }, [toast]);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: new Error('No user logged in') };

    const updateData = { ...updates };
    
    // Normalize role to lowercase if provided
    if (updateData.rol) {
      const normalizedRole = updateData.rol.toLowerCase();
      updateData.rol = VALID_ROLES.includes(normalizedRole) ? normalizedRole : DEFAULT_ROLE;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      await loadUserProfile(user.id);

      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados.",
      });

      return { error: null };
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error al actualizar perfil",
        description: err.message || "Error al actualizar.",
      });
      return { error: err };
    }
  }, [user, loadUserProfile, toast]);

  const isAdmin = useMemo(() => {
    return userProfile?.rol?.toLowerCase() === 'admin';
  }, [userProfile]);

  const isEditor = useMemo(() => {
    const rol = userProfile?.rol?.toLowerCase();
    return rol === 'moderator' || rol === 'admin';
  }, [userProfile]);

  const value = useMemo(() => ({
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isEditor,
    currentUser: userProfile
  }), [user, userProfile, session, loading, signUp, signIn, signOut, updateProfile, isAdmin, isEditor]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};