'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Institucion {
  id: number;
  nombre: string;
  email: string;
}

interface Administrador {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  institucion: {
    id: number;
    nombre: string;
  };
  sede?: {
    id: number;
    nombre: string;
  };
}

interface UnifiedAuthContextType {
  user: User | null;
  loading: boolean;
  userType: 'institucion' | 'administrador' | null;
  institucion: Institucion | null;
  administrador: Administrador | null;
  signOut: () => Promise<void>;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType>({
  user: null,
  loading: true,
  userType: null,
  institucion: null,
  administrador: null,
  signOut: async () => {},
});

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

export const UnifiedAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'institucion' | 'administrador' | null>(null);
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Verificar sesión inicial
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await determineUserType(session.user);
        } else {
          setUser(null);
          setUserType(null);
          setInstitucion(null);
          setAdministrador(null);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setUser(null);
        setUserType(null);
        setInstitucion(null);
        setAdministrador(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await determineUserType(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserType(null);
          setInstitucion(null);
          setAdministrador(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isMounted]);

  const determineUserType = async (user: User) => {
    try {
      // Primero verificar si es administrador
      const adminResponse = await fetch(`/api/administradores/by-email/${encodeURIComponent(user.email!)}`);
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        setUserType('administrador');
        setAdministrador(adminData.administrador);
        setInstitucion(null);
        return;
      }

      // Si no es administrador, verificar si es institución
      const instResponse = await fetch(`/api/instituciones/by-email/${encodeURIComponent(user.email!)}`);
      if (instResponse.ok) {
        const instData = await instResponse.json();
        setUserType('institucion');
        setInstitucion(instData);
        setAdministrador(null);
        return;
      }

      // Si no es ninguno, limpiar todo
      setUserType(null);
      setInstitucion(null);
      setAdministrador(null);
    } catch (error) {
      console.error('Error determinando tipo de usuario:', error);
      setUserType(null);
      setInstitucion(null);
      setAdministrador(null);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setUserType(null);
      setInstitucion(null);
      setAdministrador(null);
    }
  };

  const value = {
    user,
    loading,
    userType,
    institucion,
    administrador,
    signOut,
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
