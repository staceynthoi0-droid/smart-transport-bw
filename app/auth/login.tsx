import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth, UserRole } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithProvider, continueAsGuest } = useAuth();
  const [role, setRole] = useState<UserRole>('commuter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', error.message);
      return;
    }
    if (role === 'driver') {
      router.replace('/driver/dashboard');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    const { error } = await signInWithProvider(provider);
    setLoading(false);
    if (error) {
      Alert.alert('Social Login Failed', `${provider === 'google' ? 'Google' : 'Facebook'} login is not available yet. Check that this provider is enabled in Supabase.`);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Smart Transport BW</Text>
        <Text style={styles.subtitle}>Sign in and choose how you use the app</Text>

        <View style={styles.roleContainer}>
          <RoleCard role="commuter" active={role === 'commuter'} icon="walk-outline" title="Commuter" onPress={() => setRole('commuter')} />
          <RoleCard role="driver" active={role === 'driver'} icon="bus-outline" title="Driver" onPress={() => setRole('driver')} />
        </View>

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={Colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={Colors.textSecondary} />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : role === 'driver' ? 'Sign In as Driver' : 'Sign In as Commuter'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('google')} disabled={loading}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('facebook')} disabled={loading}>
            <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.link}>Do not have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={() => { continueAsGuest(); router.replace('/(tabs)'); }}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RoleCard({ active, icon, title, onPress }: { role: UserRole; active: boolean; icon: keyof typeof Ionicons.glyphMap; title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.roleButton, active && styles.roleSelected]} onPress={onPress}>
      <Ionicons name={icon} size={30} color={active ? Colors.primary : Colors.textSecondary} />
      <Text style={[styles.roleText, active && styles.roleTextSelected]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleButton: { flex: 1, minHeight: 94, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, gap: 8 },
  roleSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  roleText: { fontSize: 15, fontWeight: '800', color: Colors.text },
  roleTextSelected: { color: Colors.primary },
  input: { backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, color: Colors.text },
  button: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, minHeight: 48, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  socialText: { color: Colors.text, fontWeight: '800', fontSize: 14 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: Colors.textSecondary },
  linkBold: { color: Colors.primary, fontWeight: '700' },
  guestButton: { marginTop: 24, alignItems: 'center' },
  guestText: { color: Colors.textSecondary, fontSize: 15, textDecorationLine: 'underline' },
});
