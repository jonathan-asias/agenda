'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

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
  const obtainSupabaseClient = () => {
    if (!isSupabaseConfigured()) {
      console.error(
        'Supabase no está configurado. La autenticación no funcionará hasta que definas NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.'
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
  const [institutionId, setInstitutionId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Función para obtener el ID de la institución (sin 404s en consola)
  const getInstitutionId = async (userEmail: string): Promise<number | null> => {
    try {
      const resp = await fetch('/api/auth/get-user-institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      if (!resp.ok) return null;
      const data = await resp.json();
      return typeof data?.institutionId === 'number' ? data.institutionId : null;
    } catch {
      // Evitar ruido en consola; solo devolver null
      return null;
    }
  };

  useEffect(() => {
    // Marcar como montado en el cliente
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente después de montar
    if (!isMounted) return;

    const supabaseClient = obtainSupabaseClient();
    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    // Obtener la sesión actual
    const getSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      setUser(session?.user ?? null);
      
      // Si hay usuario, obtener su institución (sin importar si es admin o institución)
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
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // Si hay usuario, obtener su institución (sin importar si es admin o institución)
        if (session?.user?.email) {
          const instId = await getInstitutionId(session.user.email);
          setInstitutionId(instId);
        } else {
          setInstitutionId(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, [isMounted]);

  const signOut = async () => {
    const supabaseClient = obtainSupabaseClient();
    if (!supabaseClient) {
      setInstitutionId(null);
      setUser(null);
      return;
    }
    await supabaseClient.auth.signOut();
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
