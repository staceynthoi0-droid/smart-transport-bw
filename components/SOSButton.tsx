import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Alert, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export default function SOSButton() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef(3);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startPress = useCallback(() => {
    countRef.current = 3;
    setCountdown(3);
    Vibration.vibrate(100);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    ).start();

    timerRef.current = setInterval(() => {
      countRef.current -= 1;
      if (countRef.current <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setCountdown(null);
        scaleAnim.setValue(1);
        Vibration.vibrate([0, 200, 100, 200]);
        // Trigger SOS
        console.log('🚨 SOS ALERT TRIGGERED');
        Alert.alert('🚨 SOS Sent', 'Emergency alert has been sent to nearby drivers and authorities.', [{ text: 'OK' }]);
      } else {
        setCountdown(countRef.current);
        Vibration.vibrate(100);
      }
    }, 1000);
  }, [scaleAnim]);

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(null);
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onLongPress={startPress}
        onPressOut={cancelPress}
        delayLongPress={100}
        style={[styles.button, countdown !== null && styles.buttonActive]}
      >
        <Ionicons name="warning" size={24} color="#FFF" />
        <Text style={styles.text}>
          {countdown !== null ? `SOS in ${countdown}...` : 'Hold for SOS'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: Colors.sos, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 4 },
  buttonActive: { backgroundColor: '#B71C1C' },
  text: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
