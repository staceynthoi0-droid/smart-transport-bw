import { useEffect, useState } from 'react';
import { DEMO_ACCOUNTS } from '@/constants/demo-accounts';

export type UserRole = 'commuter' | 'driver';

type DemoUser = {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
};

type DemoProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  plate_number?: string | null;
  last_serviced?: string | null;
};

type AuthResult = Promise<{ error: Error | null }>;
type ProviderResult = Promise<{ data: null; error: Error | null }>;
type AuthState = {
  user: DemoUser | null;
  profile: DemoProfile | null;
};

const demoUser: DemoUser = {
  id: 'mock-user-123',
  email: 'demo@smarttransport.bw',
  user_metadata: {
    full_name: 'Demo User',
    role: 'commuter',
  },
};

const demoProfile: DemoProfile = {
  id: 'mock-user-123',
  full_name: 'Demo User',
  phone: '+267 7000 0000',
  role: 'commuter',
  avatar_url: null,
  plate_number: null,
  last_serviced: null,
};

let authState: AuthState = {
  user: demoUser,
  profile: demoProfile,
};

const listeners = new Set<(state: AuthState) => void>();

const setAuthState = (nextState: AuthState) => {
  authState = nextState;
  listeners.forEach(listener => listener(authState));
};

const buildDemoAuthState = (email: string, selectedRole?: UserRole): AuthState => {
  const account = DEMO_ACCOUNTS.find(demoAccount => demoAccount.email.toLowerCase() === email.toLowerCase());
  const role = selectedRole || account?.role || 'commuter';
  const fullName = account?.role === role ? account.fullName : role === 'driver' ? 'Demo Driver' : 'Demo User';

  return {
    user: {
      id: `mock-${role}-user`,
      email,
      user_metadata: {
        full_name: fullName,
        role,
      },
    },
    profile: {
      id: `mock-${role}-user`,
      full_name: fullName,
      phone: role === 'driver' ? '+267 7222 0002' : '+267 7111 0001',
      role,
      avatar_url: null,
      plate_number: role === 'driver' ? 'B 321 DEM' : null,
      last_serviced: role === 'driver' ? '2026-04-15' : null,
    },
  };
};

export function useAuth() {
  const [{ user, profile }, setLocalAuthState] = useState<AuthState>(authState);

  useEffect(() => {
    listeners.add(setLocalAuthState);
    setLocalAuthState(authState);

    return () => {
      listeners.delete(setLocalAuthState);
    };
  }, []);

  const signUp = async (email: string, _password: string, fullName: string, role: UserRole, additionalData?: any): AuthResult => {
    const nextUser = {
      id: 'mock-user-456',
      email,
      user_metadata: { full_name: fullName, role },
    };
    const nextProfile = {
      id: nextUser.id,
      full_name: fullName,
      phone: additionalData?.phone || null,
      role,
      avatar_url: null,
      plate_number: role === 'driver' ? additionalData?.plate_number || null : null,
      last_serviced: role === 'driver' ? additionalData?.last_serviced || null : null,
    };
    setAuthState({ user: nextUser, profile: nextProfile });
    return { error: null };
  };

  const signIn = async (email: string, _password: string, role?: UserRole): AuthResult => {
    setAuthState(buildDemoAuthState(email, role));
    return { error: null };
  };

  const signInWithProvider = async (provider: 'google' | 'facebook', role: UserRole = 'commuter'): ProviderResult => {
    setAuthState({
      user: {
        id: `mock-${role}-${provider}-user`,
        email: `${provider}.demo@smarttransport.bw`,
        user_metadata: {
          full_name: provider === 'google' ? 'Google Demo User' : 'Facebook Demo User',
          role,
        },
      },
      profile: {
        id: `mock-${role}-${provider}-user`,
        full_name: provider === 'google' ? 'Google Demo User' : 'Facebook Demo User',
        phone: role === 'driver' ? '+267 7222 0002' : '+267 7111 0001',
        role,
        avatar_url: null,
        plate_number: role === 'driver' ? 'B 321 DEM' : null,
        last_serviced: role === 'driver' ? '2026-04-15' : null,
      },
    });
    return { data: null, error: null };
  };

  const updateProfile = async (updates: { full_name?: string | null; phone?: string | null; avatar_url?: string | null; plate_number?: string | null; last_serviced?: string | null }) => {
    if (!profile) return { data: null, error: new Error('No demo profile is active.') };
    const nextProfile = {
      ...profile,
      full_name: updates.full_name ?? profile.full_name,
      phone: updates.phone ?? profile.phone,
      avatar_url: updates.avatar_url ?? profile.avatar_url,
      plate_number: updates.plate_number ?? profile.plate_number,
      last_serviced: updates.last_serviced ?? profile.last_serviced,
    };
    setAuthState({ user, profile: nextProfile });
    return { data: nextProfile, error: null };
  };

  const refreshProfile = async () => ({ data: profile, error: null });

  const signOut = async () => {
    setAuthState({ user: demoUser, profile: demoProfile });
  };

  return {
    session: { user },
    user,
    profile,
    loading: false,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    refreshProfile,
    updateProfile,
  };
}
