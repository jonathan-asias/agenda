'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  institutionId: number | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  institutionId: null,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [institutionId, setInstitutionId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Función para obtener el ID de la institución
  const getInstitutionId = async (userEmail: string): Promise<number | null> => {
    try {
      const response = await fetch(`/api/instituciones/by-email/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        return data?.id || null;
      }
    } catch (error) {
      console.error('Error al obtener institución:', error);
    }
    return null;
  };

  useEffect(() => {
    // Marcar como montado en el cliente
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente después de montar
    if (!isMounted) return;

    // Obtener la sesión actual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Solo procesar si el usuario NO es administrador
      if (session?.user?.user_metadata?.tipo === 'administrador') {
        console.log('AuthContext: Ignorando sesión de administrador');
        setUser(null);
        setInstitutionId(null);
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      
      // Si hay usuario, obtener su institución
      if (session?.user?.email) {
        const instId = await getInstitutionId(session.user.email);
        setInstitutionId(instId);
      } else {
        setInstitutionId(null);
      }
      
      setLoading(false);
    };

    getSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Solo procesar si el usuario NO es administrador
        if (session?.user?.user_metadata?.tipo === 'administrador') {
          console.log('AuthContext: Ignorando usuario administrador');
          return;
        }
        
        setUser(session?.user ?? null);
        
        // Si hay usuario, obtener su institución
        if (session?.user?.email) {
          const instId = await getInstitutionId(session.user.email);
          setInstitutionId(instId);
        } else {
          setInstitutionId(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isMounted]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setInstitutionId(null);
  };

  const value = {
    user,
    loading,
    institutionId,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
