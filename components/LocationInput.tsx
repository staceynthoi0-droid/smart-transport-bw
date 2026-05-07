import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface LocationInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isCurrentLocation?: boolean;
  onGpsPress?: () => void;
}

export default function LocationInput({ label, value, onChangeText, isCurrentLocation, onGpsPress }: LocationInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {isCurrentLocation && (
          <TouchableOpacity onPress={onGpsPress} style={styles.gpsButton}>
            <Ionicons name="locate" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.input, isCurrentLocation && styles.inputWithGps]}
          value={value}
          onChangeText={onChangeText}
          placeholder={isCurrentLocation ? 'Current Location' : `Enter ${label.toLowerCase()}`}
          placeholderTextColor={Colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  gpsButton: { paddingLeft: 12 },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.text },
  inputWithGps: { paddingLeft: 8 },
});
