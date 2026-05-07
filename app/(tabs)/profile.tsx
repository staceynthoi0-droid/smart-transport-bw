import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, isGuest, signOut } = useAuth();

  if (isGuest) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="person-circle-outline" size={80} color={Colors.border} />
        <Text style={styles.guestTitle}>Guest Mode</Text>
        <Text style={styles.guestMsg}>Sign in to access bookings, favourites, and more.</Text>
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/auth/login')}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/auth/register')}>
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', onPress: () => router.push('/profile/edit') },
    { icon: 'ticket-outline' as const, label: 'Trip History', onPress: () => router.push('/profile/trip-history') },
    { icon: 'heart-outline' as const, label: 'Saved Places', onPress: () => router.push('/profile/saved-places') },
    ...(profile?.role === 'driver'
      ? [{ icon: 'car-outline' as const, label: 'Driver Dashboard', onPress: () => router.push('/driver/dashboard') }]
      : []),
    { icon: 'alert-circle-outline' as const, label: 'Report Transport Issue', onPress: () => router.push('/profile/report-issue') },
    { icon: 'settings-outline' as const, label: 'Settings', onPress: () => router.push('/profile/settings') },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: () => Alert.alert('Help', 'Contact: support@smarttransportbw.co.bw') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={36} color={Colors.primary} />
          )}
        </View>
        <Text style={styles.email}>{profile?.full_name || user?.email}</Text>
        {profile?.full_name && <Text style={styles.profileEmail}>{user?.email}</Text>}
        <Text style={styles.role}>{profile?.role === 'driver' ? 'Driver' : 'Commuter'}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
            <Ionicons name={item.icon} size={22} color={Colors.text} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => { signOut(); Alert.alert('Signed out'); }}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  guestContainer: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 },
  guestTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 16 },
  guestMsg: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  signInButton: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48, marginBottom: 12 },
  signInText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  registerButton: { borderWidth: 2, borderColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48 },
  registerText: { color: Colors.primary, fontWeight: '600', fontSize: 16 },
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  email: { fontSize: 17, fontWeight: '600', color: Colors.text },
  profileEmail: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  role: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  menu: { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.text },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 14 },
  logoutText: { color: Colors.danger, fontWeight: '600', fontSize: 15 },
});
