import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithProvider } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<'google' | 'facebook' | null>(null);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      Alert.alert('Login Failed', error.message);
      console.error('Login error:', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  async function handleProviderLogin(provider: 'google' | 'facebook') {
    setProviderLoading(provider);
    const { error } = await signInWithProvider(provider);
    if (error) {
      Alert.alert('Sign In Failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setProviderLoading(null);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome Back</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleProviderLogin('google')}
          disabled={providerLoading !== null}
        >
          {providerLoading === 'google' ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color={Colors.text} />
              <Text style={styles.socialText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleProviderLogin('facebook')}
          disabled={providerLoading !== null}
        >
          {providerLoading === 'facebook' ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.replace('/(tabs)')}
          disabled={loading || providerLoading !== null}
        >
          <Ionicons name="person-outline" size={19} color={Colors.primary} />
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: Colors.text },
  input: { borderWidth: 1, borderColor: Colors.border, padding: 12, borderRadius: 8, marginBottom: 12, color: Colors.text },
  button: { backgroundColor: '#00A876', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, fontWeight: '700' },
  socialButton: { minHeight: 50, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 },
  socialText: { color: Colors.text, fontWeight: '700', fontSize: 15 },
  guestButton: { minHeight: 50, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2 },
  guestText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  linkButton: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#146EB4' },
});
