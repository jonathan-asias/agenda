'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { applyBranding, resetBranding } from '@/lib/applyBranding';
import type { UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  institutionId: number | null;
  role: UserRole | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  institutionId: null,
  role: null,
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
        'Supabase no est? configurado. La autenticaci?n no funcionar? hasta que definas NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.'
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
  const [role, setRole] = useState<UserRole | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const getUserInfo = async (_userEmail: string): Promise<{ institutionId: number | null; role: UserRole | null }> => {
    try {
      const resp = await fetch('/api/auth/get-user-institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!resp.ok) return { institutionId: null, role: null };
      const data = await resp.json();
      const instId = typeof data?.institutionId === 'number' ? data.institutionId : null;
      const userRole = data?.role && ['institucion', 'admin', 'docente'].includes(data.role) ? data.role : null;
      return { institutionId: instId, role: userRole };
    } catch {
      return { institutionId: null, role: null };
    }
  };

  // Aplicar branding de la instituci?n cuando se conoce el institutionId
  useEffect(() => {
    if (!institutionId || typeof fetch === 'undefined') return;

    let cancelled = false;
    const apply = async () => {
      try {
        const resp = await fetch(`/api/instituciones/${institutionId}/branding`);
        if (cancelled || !resp.ok) return;
        const data = await resp.json();
        applyBranding({
          colorPrimario: data.color_primario ?? undefined,
          colorSecundario: data.color_secundario ?? undefined,
        });
      } catch {
        // Silenciar; no romper flujo
      }
    };
    apply();
    return () => {
      cancelled = true;
    };
  }, [institutionId]);

  useEffect(() => {
    // Marcar como montado en el cliente
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar en el cliente despu?s de montar
    if (!isMounted) return;

    const supabaseClient = obtainSupabaseClient();
    if (!supabaseClient) {
      setLoading(false);
      return;
    }

    // Obtener la sesi?n actual
    const getSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      setUser(session?.user ?? null);
      
      // Si hay usuario, obtener su instituci?n (sin importar si es admin o instituci?n)
      if (session?.user?.email) {
        const { institutionId: instId, role: userRole } = await getUserInfo(session.user.email);
        setInstitutionId(instId);
        setRole(userRole);
      } else {
        setInstitutionId(null);
        setRole(null);
        resetBranding();
      }
      setLoading(false);
    };

    getSession();

    // Escuchar cambios en la autenticaci?n
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // Si hay usuario, obtener su instituci?n (sin importar si es admin o instituci?n)
        if (session?.user?.email) {
          const { institutionId: instId, role: userRole } = await getUserInfo(session.user.email);
          setInstitutionId(instId);
          setRole(userRole);
        } else {
          setInstitutionId(null);
          setRole(null);
          resetBranding();
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
      setRole(null);
      setUser(null);
      resetBranding();
      return;
    }
    await supabaseClient.auth.signOut();
    setInstitutionId(null);
    setRole(null);
    resetBranding();
  };

  const value = {
    user,
    loading,
    institutionId,
    role,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
