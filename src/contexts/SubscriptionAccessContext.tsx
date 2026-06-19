'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface SubscriptionAccessState {
  mode: 'full' | 'grace_readonly' | 'blocked';
  canWrite: boolean;
  canLogin: boolean;
  message: string;
  graceUntil: string | null;
  graceDays: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

const defaultState: SubscriptionAccessState = {
  mode: 'full',
  canWrite: true,
  canLogin: true,
  message: '',
  graceUntil: null,
  graceDays: 0,
  loading: true,
  refresh: async () => {},
};

const SubscriptionAccessContext = createContext<SubscriptionAccessState>(defaultState);

export function SubscriptionAccessProvider({
  institutionId,
  children,
}: {
  institutionId: number | null;
  children: ReactNode;
}) {
  const [state, setState] = useState<Omit<SubscriptionAccessState, 'refresh'>>({
    mode: 'full',
    canWrite: true,
    canLogin: true,
    message: '',
    graceUntil: null,
    graceDays: 0,
    loading: Boolean(institutionId),
  });

  const refresh = useCallback(async () => {
    if (!institutionId) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      const res = await fetch(`/api/instituciones/${institutionId}/subscription-access`);
      if (res.ok) {
        const data = await res.json();
        setState({
          mode: data.mode ?? 'full',
          canWrite: Boolean(data.canWrite),
          canLogin: data.canLogin !== false,
          message: data.message ?? '',
          graceUntil: data.graceUntil ?? null,
          graceDays: data.graceDays ?? 0,
          loading: false,
        });
        return;
      }
    } catch {
      // ignore
    }

    setState((prev) => ({ ...prev, loading: false }));
  }, [institutionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...state,
      refresh,
    }),
    [state, refresh]
  );

  return (
    <SubscriptionAccessContext.Provider value={value}>
      {children}
    </SubscriptionAccessContext.Provider>
  );
}

export function useSubscriptionAccess(): SubscriptionAccessState {
  return useContext(SubscriptionAccessContext);
}
