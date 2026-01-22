'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

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
  const obtainSupabaseClient = () => {
    if (!isSupabaseConfigured()) {
      console.error(
        'Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar la autenticación.'
      );
      return null;
    }
    try {
      return getSupabaseClient();
    } catch (error) {
      console.error('No se pudo inicializar el cliente de Supabase:', error);
      return null;
    }
  };

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

    // Verificar sesión inicial - SIN determinar tipo automáticamente
    const checkAuth = async () => {
      const supabaseClient = obtainSupabaseClient();
      if (!supabaseClient) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // NO determinar tipo aquí, solo verificar que hay sesión
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

    // Escuchar cambios en la autenticación - SIN determinar tipo automáticamente
    const supabaseClient = obtainSupabaseClient();
    if (!supabaseClient) {
      return;
    }

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          // NO determinar tipo aquí, el login se encarga
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserType(null);
          setInstitucion(null);
          setAdministrador(null);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, [isMounted]);

  const signOut = async () => {
    const supabaseClient = obtainSupabaseClient();
    if (!supabaseClient) {
      setUser(null);
      setUserType(null);
      setInstitucion(null);
      setAdministrador(null);
      return;
    }
    try {
      await supabaseClient.auth.signOut();
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
