import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const vehicleTypes = [
  { value: 'taxi', label: 'Taxi', icon: 'car-outline' as const },
  { value: 'combi', label: 'Combi', icon: 'bus-outline' as const },
  { value: 'bus', label: 'Bus', icon: 'trail-sign-outline' as const },
] as const;

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [role, setRole] = useState<UserRole>('commuter');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<'taxi' | 'combi' | 'bus'>('combi');
  const [plate, setPlate] = useState('');
  const [operatingBase, setOperatingBase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Clear previous errors
    setPasswordError('');

    // Validate required fields
    if (!fullName || !email || !password) {
      Alert.alert(t.errors.invalidEmail, 'Please fill in full name, email, and password.');
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setPasswordError(t.errors.passwordMismatch);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setPasswordError(t.errors.passwordTooShort);
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
      Alert.alert(t.errors.signupFailed, error.message);
      return;
    }
    Alert.alert(t.common.success, 'Account created. Please check your email to verify it.', [
      { text: 'OK', onPress: () => router.replace(role === 'driver' ? '/driver/dashboard' : '/auth/login') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t.auth.signupTitle}</Text>
        <Text style={styles.subtitle}>{t.auth.signupSubtitle}</Text>

        <Text style={styles.sectionTitle}>{t.auth.chooseRole}</Text>
        <View style={styles.roleContainer}>
          <RoleCard active={role === 'commuter'} icon="walk-outline" title={t.auth.commuter} detail={t.auth.roleDescription} onPress={() => setRole('commuter')} />
          <RoleCard active={role === 'driver'} icon="bus-outline" title={t.auth.driver} detail={t.auth.driverDescription} onPress={() => setRole('driver')} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Your full name"
          placeholderTextColor={Colors.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="+267 71 234 567"
          placeholderTextColor={Colors.textSecondary}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
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
          placeholder="Create a password"
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor={Colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t.common.phoneNumber}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={Colors.textSecondary}
        />
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
          placeholder={t.common.password}
          placeholderTextColor={Colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t.common.confirmPassword}
          placeholderTextColor={Colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

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
          <Text style={styles.buttonText}>{loading ? t.common.loading : role === 'driver' ? 'Create Driver Account' : 'Create Commuter Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>{t.auth.hasAccount} <Text style={styles.linkBold}>{t.common.login}</Text></Text>
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
  errorText: { color: Colors.danger, fontSize: 13, textAlign: 'center', marginTop: -8, marginBottom: 8 },
});
