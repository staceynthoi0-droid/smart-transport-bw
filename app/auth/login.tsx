import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithProvider } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<'google' | 'facebook' | null>(null);

  const goHome = () => router.replace('/(tabs)');
  const goToRoleHome = () => router.replace('/redirect');

  const handleLogin = async () => {
    setError('');
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Incorrect password. Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(cleanEmail, password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Incorrect email or password.');
      return;
    }

    goToRoleHome();
  };

  const handleProviderLogin = async (provider: 'google' | 'facebook') => {
    setError('');
    setProviderLoading(provider);
    const { error: providerError } = await signInWithProvider(provider);
    setProviderLoading(null);

    if (providerError) {
      setError(providerError.message || `Could not continue with ${provider}.`);
      return;
    }

    goToRoleHome();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="bus-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to plan trips, save places, and manage bookings.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={Colors.textSecondary}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textSecondary}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (error) setError('');
            }}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading || providerLoading !== null}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={() => handleProviderLogin('google')} disabled={loading || providerLoading !== null}>
            {providerLoading === 'google' ? (
              <ActivityIndicator color={Colors.text} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color={Colors.text} />
                <Text style={styles.socialText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => handleProviderLogin('facebook')} disabled={loading || providerLoading !== null}>
            {providerLoading === 'facebook' ? (
              <ActivityIndicator color={Colors.text} />
            ) : (
              <>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={styles.socialText}>Continue with Facebook</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={goHome} disabled={loading || providerLoading !== null}>
            <Ionicons name="person-outline" size={19} color={Colors.primary} />
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/auth/register')}>
          <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerAction}>Sign Up</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 24 },
  iconWrap: { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  form: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 16 },
  input: { minHeight: 52, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 14, color: Colors.text, marginBottom: 12, backgroundColor: Colors.background },
  errorText: { color: Colors.danger, fontSize: 13, fontWeight: '700', marginBottom: 12 },
  primaryButton: { minHeight: 52, borderRadius: 8, backgroundColor: '#00A876', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, fontWeight: '700' },
  socialButton: { minHeight: 50, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 },
  socialText: { color: Colors.text, fontWeight: '700', fontSize: 15 },
  guestButton: { minHeight: 50, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  guestText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  footerLink: { alignItems: 'center', marginTop: 18 },
  footerText: { color: Colors.textSecondary, fontWeight: '600' },
  footerAction: { color: Colors.primary, fontWeight: '800' },
});
