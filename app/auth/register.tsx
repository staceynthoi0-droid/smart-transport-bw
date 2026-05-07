import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth, UserRole } from '@/hooks/useAuth';

const vehicleTypes = [
  { value: 'taxi', label: 'Taxi', icon: 'car-outline' as const },
  { value: 'combi', label: 'Combi', icon: 'bus-outline' as const },
  { value: 'bus', label: 'Bus', icon: 'trail-sign-outline' as const },
] as const;

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [role, setRole] = useState<UserRole>('commuter');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<'taxi' | 'combi' | 'bus'>('combi');
  const [plate, setPlate] = useState('');
  const [operatingBase, setOperatingBase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in full name, email, and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (role === 'driver' && (!phone || !plate || !operatingBase)) {
      Alert.alert('Driver details needed', 'Please add phone number, license plate, and operating location.');
      return;
    }

    setLoading(true);
    const additionalData = role === 'driver'
      ? { phone, vehicle_type: vehicleType, license_plate: plate.toUpperCase(), operating_base: operatingBase }
      : { phone: phone || null };
    const { error } = await signUp(email, password, fullName, role, additionalData);
    setLoading(false);
    if (error) {
      Alert.alert('Registration Failed', error.message);
      return;
    }
    Alert.alert('Success', 'Account created. Please check your email to verify it.', [
      { text: 'OK', onPress: () => router.replace(role === 'driver' ? '/driver/dashboard' : '/auth/login') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Choose commuter or driver access</Text>

        <Text style={styles.sectionTitle}>Role</Text>
        <View style={styles.roleContainer}>
          <RoleCard active={role === 'commuter'} icon="walk-outline" title="Commuter" detail="Search routes, fares, SOS" onPress={() => setRole('commuter')} />
          <RoleCard active={role === 'driver'} icon="bus-outline" title="Driver" detail="Seats, route, requests" onPress={() => setRole('driver')} />
        </View>

        <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} placeholderTextColor={Colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={Colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={Colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Password (min 6 chars)" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={Colors.textSecondary} />

        {role === 'driver' && (
          <View style={styles.driverPanel}>
            <Text style={styles.sectionTitle}>Vehicle Type</Text>
            <View style={styles.vehicleContainer}>
              {vehicleTypes.map(type => (
                <TouchableOpacity key={type.value} style={[styles.vehicleButton, vehicleType === type.value && styles.vehicleSelected]} onPress={() => setVehicleType(type.value)}>
                  <Ionicons name={type.icon} size={18} color={vehicleType === type.value ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.vehicleText, vehicleType === type.value && styles.vehicleTextSelected]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="License plate (e.g. B 123 ABC)" value={plate} onChangeText={setPlate} autoCapitalize="characters" placeholderTextColor={Colors.textSecondary} />
            <TextInput style={styles.input} placeholder="Operating location/base" value={operatingBase} onChangeText={setOperatingBase} placeholderTextColor={Colors.textSecondary} />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : role === 'driver' ? 'Create Driver Account' : 'Create Commuter Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Sign In</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RoleCard({ active, icon, title, detail, onPress }: { active: boolean; icon: keyof typeof Ionicons.glyphMap; title: string; detail: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.roleButton, active && styles.roleSelected]} onPress={onPress}>
      <Ionicons name={icon} size={30} color={active ? Colors.primary : Colors.textSecondary} />
      <Text style={[styles.roleText, active && styles.roleTextSelected]}>{title}</Text>
      <Text style={styles.roleDetail}>{detail}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, padding: 24, paddingBottom: 36 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  roleButton: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, padding: 12 },
  roleSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  roleText: { fontSize: 15, fontWeight: '800', color: Colors.text, marginTop: 8 },
  roleTextSelected: { color: Colors.primary },
  roleDetail: { color: Colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  input: { backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, color: Colors.text },
  driverPanel: { marginTop: 2 },
  vehicleContainer: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  vehicleButton: { flex: 1, minHeight: 48, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  vehicleSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  vehicleText: { fontSize: 13, color: Colors.text, fontWeight: '700' },
  vehicleTextSelected: { color: Colors.primary },
  button: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: Colors.textSecondary },
  linkBold: { color: Colors.primary, fontWeight: '700' },
});
