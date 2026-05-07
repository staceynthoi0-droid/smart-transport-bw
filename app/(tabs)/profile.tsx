import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.guestContent}>
        <View style={styles.guestIcon}>
          <Ionicons name="person-outline" size={42} color={Colors.primary} />
        </View>
        <Text style={styles.guestTitle}>Browsing as Guest</Text>
        <Text style={styles.guestText}>Sign in to save places, see trip history, report issues, and manage your commuter profile.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/auth/login')}>
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/auth/register')}>
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
        <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  loadingContainer: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  guestContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  guestIcon: { width: 82, height: 82, borderRadius: 41, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  guestTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  guestText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  primaryButton: { width: '100%', backgroundColor: Colors.primary, borderRadius: 8, alignItems: 'center', paddingVertical: 14, marginBottom: 10 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  secondaryButton: { width: '100%', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8, alignItems: 'center', paddingVertical: 14 },
  secondaryButtonText: { color: Colors.primary, fontSize: 16, fontWeight: '800' },
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  name: { fontSize: 17, fontWeight: '600', color: Colors.text },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 3 },
  role: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  menu: { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.text },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 14 },
  logoutText: { color: Colors.danger, fontWeight: '600', fontSize: 15 },
});
