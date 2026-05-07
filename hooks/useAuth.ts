import { useState } from 'react';

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
};

type AuthResult = Promise<{ error: Error | null }>;
type ProviderResult = Promise<{ data: null; error: Error | null }>;

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
};

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(demoUser);
  const [profile, setProfile] = useState<DemoProfile | null>(demoProfile);

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
    };
    setUser(nextUser);
    setProfile(nextProfile);
    return { error: null };
  };

  const signIn = async (email: string, _password: string): AuthResult => {
    setUser({
      ...demoUser,
      email,
    });
    setProfile(demoProfile);
    return { error: null };
  };

  const signInWithProvider = async (provider: 'google' | 'facebook'): ProviderResult => {
    setUser({
      ...demoUser,
      email: `${provider}.demo@smarttransport.bw`,
    });
    setProfile({
      ...demoProfile,
      full_name: provider === 'google' ? 'Google Demo User' : 'Facebook Demo User',
    });
    return { data: null, error: null };
  };

  const updateProfile = async (updates: { full_name?: string | null; phone?: string | null; avatar_url?: string | null }) => {
    if (!profile) return { data: null, error: new Error('No demo profile is active.') };
    const nextProfile = {
      ...profile,
      full_name: updates.full_name ?? profile.full_name,
      phone: updates.phone ?? profile.phone,
      avatar_url: updates.avatar_url ?? profile.avatar_url,
    };
    setProfile(nextProfile);
    return { data: nextProfile, error: null };
  };

  const refreshProfile = async () => ({ data: profile, error: null });

  const signOut = async () => {
    setUser(demoUser);
    setProfile(demoProfile);
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
