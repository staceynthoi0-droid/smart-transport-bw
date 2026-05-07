import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, signInWithProvider } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'commuter' | 'driver'>('commuter');
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<'google' | 'facebook' | null>(null);

  async function handleSignup() {
    // Validation
    if (!fullName || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email.trim(), password, fullName, role, { phone });
    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert('Success', 'Demo account created.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
    setLoading(false);
  }

  async function handleProviderLogin(provider: 'google' | 'facebook') {
    setProviderLoading(provider);
    const { error } = await signInWithProvider(provider);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setProviderLoading(null);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
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
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'commuter' && styles.roleSelected]}
            onPress={() => setRole('commuter')}
          >
            <Text style={[styles.roleText, role === 'commuter' && styles.roleTextSelected]}>Commuter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.roleButton, role === 'driver' && styles.roleSelected]}
            onPress={() => setRole('driver')}
          >
            <Text style={[styles.roleText, role === 'driver' && styles.roleTextSelected]}>Driver</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
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
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: Colors.text },
  input: { borderWidth: 1, borderColor: Colors.border, padding: 12, borderRadius: 8, marginBottom: 12, color: Colors.text },
  roleContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  roleButton: { flex: 1, padding: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8 },
  roleSelected: { backgroundColor: '#00A876', borderColor: '#00A876' },
  roleText: { textAlign: 'center', color: Colors.text },
  roleTextSelected: { color: 'white' },
  button: { backgroundColor: '#00A876', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
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
