import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface SafetyShieldProps {
  onPress: () => void;
}

export default function SafetyShield({ onPress }: SafetyShieldProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
});
