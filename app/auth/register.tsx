import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'commuter' | 'driver'>('commuter');
  const [loading, setLoading] = useState(false);

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
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role
        }
      }
    });

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else if (data?.user) {
      Alert.alert(
        'Success', 
        'Account created! Please check your email to confirm your account.',
        [{ text: 'OK', onPress: () => router.push('/auth/login') }]
      );
    }
    
    setLoading(false);
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
  linkButton: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#146EB4' },
});
