import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Linking as RNLinking } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { supabase } from '@/lib/supabase';

export type UserRole = 'commuter' | 'driver';

async function getOrCreateProfile(currentUser: User) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
  if (data || (error && error.code !== 'PGRST116')) return data;

  const metadata = currentUser.user_metadata ?? {};
  const fallbackProfile = {
    id: currentUser.id,
    full_name: metadata.full_name || metadata.name || currentUser.email?.split('@')[0] || 'Commuter',
    phone: metadata.phone || null,
    role: metadata.role === 'driver' ? 'driver' : 'commuter',
    avatar_url: metadata.avatar_url || metadata.picture || null,
  };

  const { data: createdProfile } = await (supabase.from('profiles') as any)
    .upsert(fallbackProfile)
    .select('*')
    .single();

  return createdProfile ?? fallbackProfile;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const profileData = await getOrCreateProfile(session.user);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const profileData = await getOrCreateProfile(session.user);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const parsed = ExpoLinking.parse(url);
      const code = parsed.queryParams?.code;
      if (typeof code === 'string') {
        await supabase.auth.exchangeCodeForSession(code);
      }
    };

    RNLinking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });
    const subscription = RNLinking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => subscription.remove();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole, additionalData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role, ...additionalData } },
    });
    if (error) return { error };
    if (data.user) {
      const profileData = {
        id: data.user.id,
        full_name: fullName,
        role,
        phone: additionalData?.phone || null,
        operating_base: additionalData?.operating_base || null,
        ...additionalData,
      };
      const { error: profileError } = await supabase.from('profiles').upsert(profileData);
      if (profileError) return { error: profileError };
      setProfile(profileData);
    }
    return { error: null };
  };

  const refreshProfile = async () => {
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!error) setProfile(data);
    return { data, error };
  };

  const updateProfile = async (updates: { full_name?: string | null; phone?: string | null; avatar_url?: string | null }) => {
    if (!user) return { error: new Error('You must be signed in to update your profile.') };
    const nextProfile = {
      id: user.id,
      full_name: updates.full_name ?? profile?.full_name ?? null,
      phone: updates.phone ?? profile?.phone ?? null,
      role: profile?.role ?? 'commuter',
      avatar_url: updates.avatar_url ?? profile?.avatar_url ?? null,
    };
    const { data, error } = await (supabase.from('profiles') as any).upsert(nextProfile).select('*').single();
    if (!error) setProfile(data ?? nextProfile);
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: ExpoLinking.createURL('/redirect'),
        skipBrowserRedirect: true,
      },
    });
    if (!error && data.url) {
      await RNLinking.openURL(data.url);
    }
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, profile, loading, signUp, signIn, signInWithProvider, signOut, refreshProfile, updateProfile };
}
