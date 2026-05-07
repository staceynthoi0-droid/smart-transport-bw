import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { DEMO_ACCOUNTS } from '@/constants/demo-accounts';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert(t.errors.invalidEmail, 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      Alert.alert(t.errors.loginFailed, error.message);
      console.error('Login error:', error.message);
    } else {
      console.log('Login successful');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Smart Transport BW</Text>
        <Text style={styles.subtitle}>{t.auth.loginSubtitle}</Text>

        <View style={styles.demoPanel}>
          <Text style={styles.demoTitle}>Demo Logins</Text>
          {DEMO_ACCOUNTS.map(account => (
            <TouchableOpacity
              key={account.email}
              style={styles.demoButton}
              onPress={() => {
                setEmail(account.email);
                setPassword(account.password);
              }}
            >
              <Ionicons name={account.role === 'driver' ? 'bus-outline' : 'walk-outline'} size={18} color={Colors.primary} />
              <View style={styles.demoInfo}>
                <Text style={styles.demoLabel}>{account.label}</Text>
                <Text style={styles.demoCreds}>{account.email} / {account.password}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={Colors.textSecondary}
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

        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.link}>{t.auth.noAccount} <Text style={styles.linkBold}>{t.common.signup}</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  demoPanel: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 16 },
  demoTitle: { color: Colors.text, fontSize: 14, fontWeight: '800', marginBottom: 8 },
  demoButton: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 },
  demoInfo: { flex: 1 },
  demoLabel: { color: Colors.text, fontSize: 13, fontWeight: '800' },
  demoCreds: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  input: { backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, color: Colors.text },
  button: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: Colors.textSecondary },
  linkBold: { color: Colors.primary, fontWeight: '700' },
});
