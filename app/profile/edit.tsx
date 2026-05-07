import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

type ImagePickerModule = {
  requestMediaLibraryPermissionsAsync: () => Promise<{ status: string }>;
  launchImageLibraryAsync: (options: Record<string, unknown>) => Promise<{ canceled?: boolean; cancelled?: boolean; assets?: { uri: string }[]; uri?: string }>;
  MediaTypeOptions?: { Images?: string };
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  const chooseImage = async () => {
    let ImagePicker: ImagePickerModule | null = null;
    try {
      ImagePicker = require('expo-image-picker');
    } catch {
      Alert.alert('Image picker unavailable', 'Install expo-image-picker to upload from your device, or paste an image URL below.');
      return;
    }
    if (!ImagePicker) return;
    const picker = ImagePicker;

    const permission = await picker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to choose a profile picture.');
      return;
    }

    const result = await picker.launchImageLibraryAsync({
      mediaTypes: picker.MediaTypeOptions?.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });
    const cancelled = result.canceled ?? result.cancelled;
    const uri = result.assets?.[0]?.uri ?? result.uri;
    if (!cancelled && uri) {
      setAvatarUrl(uri);
    }
  };

  const saveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Name needed', 'Please enter your full name.');
      return;
    }
    setSaving(true);
    const { error } = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    });
    setSaving(false);
    if (error) {
      Alert.alert('Could not update profile', error.message);
      return;
    }
    Alert.alert('Profile updated', 'Your commuter profile has been saved.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={44} color={Colors.primary} />
          )}
        </View>
        <TouchableOpacity style={styles.photoButton} onPress={chooseImage}>
          <Ionicons name="camera-outline" size={18} color={Colors.primary} />
          <Text style={styles.photoText}>Upload Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Full name" placeholderTextColor={Colors.textSecondary} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" placeholderTextColor={Colors.textSecondary} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={user?.email || ''} editable={false} />

      <Text style={styles.label}>Profile Picture URL</Text>
      <TextInput style={styles.input} value={avatarUrl} onChangeText={setAvatarUrl} placeholder="https://example.com/photo.jpg" autoCapitalize="none" placeholderTextColor={Colors.textSecondary} />
      <Text style={styles.helpText}>Device upload uses expo-image-picker when installed. The URL field is a working fallback for web and offline demos.</Text>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile} disabled={saving}>
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  avatarWrap: { alignItems: 'center', marginBottom: 22 },
  avatar: { width: 104, height: 104, borderRadius: 52, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  avatarImage: { width: 104, height: 104, borderRadius: 52 },
  photoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: Colors.surface },
  photoText: { color: Colors.primary, fontWeight: '800' },
  label: { color: Colors.text, fontSize: 14, fontWeight: '800', marginBottom: 8 },
  input: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 14 },
  disabledInput: { color: Colors.textSecondary, backgroundColor: Colors.border + '55' },
  helpText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: -6, marginBottom: 16 },
  saveButton: { backgroundColor: Colors.primary, minHeight: 52, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});
