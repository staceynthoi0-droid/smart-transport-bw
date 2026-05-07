import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

const onboardingData = [
  {
    title: 'Find Transport Easily',
    subtitle: 'Quickly locate taxis, combis, and buses near you',
    icon: 'bus-outline' as const,
    chips: ['Taxi ranks', 'Combis', 'Buses'],
  },
  {
    title: 'Know Routes and Prices',
    subtitle: 'See routes, stops, and exact fares before you travel',
    icon: 'map-outline' as const,
    chips: ['BWP 5.50', 'Stops', 'Transfers'],
  },
  {
    title: 'Check Seats and Traffic',
    subtitle: 'Know availability, avoid traffic, and stay safe',
    icon: 'shield-checkmark-outline' as const,
    chips: ['Seats', 'Traffic', 'Safety'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentData = onboardingData[currentIndex];
  const isFinal = currentIndex === onboardingData.length - 1;
  const canGoBack = currentIndex > 0;

  const finish = () => router.replace('/auth/login');
  const handleNext = () => (isFinal ? finish() : setCurrentIndex(currentIndex + 1));
  const handleBack = () => {
    if (canGoBack) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.backButton, !canGoBack && styles.backButtonHidden]}
          onPress={handleBack}
          disabled={!canGoBack}
          accessibilityLabel="Back to previous onboarding screen"
        >
          <Ionicons name="arrow-back" size={21} color={Colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={finish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.illustration, { width: Math.min(width - 72, 320) }]}>
          <View style={styles.routeLine} />
          <View style={[styles.stopDot, styles.stopOne]} />
          <View style={[styles.stopDot, styles.stopTwo]} />
          <View style={[styles.stopDot, styles.stopThree]} />
          <View style={styles.iconCircle}>
            <Ionicons name={currentData.icon} size={74} color={Colors.primary} />
          </View>
          <View style={styles.vehicleRow}>
            {currentData.chips.map(chip => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.subtitle}>{currentData.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.indicators}>
          {onboardingData.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.footerBackButton, !canGoBack && styles.footerBackDisabled]}
            onPress={handleBack}
            disabled={!canGoBack}
          >
            <Ionicons name="chevron-back" size={20} color={canGoBack ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.footerBackText, !canGoBack && styles.footerBackTextDisabled]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{isFinal ? 'Get Started' : 'Next'}</Text>
          <Ionicons name={isFinal ? 'checkmark' : 'arrow-forward'} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  topBar: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingRight: 10 },
  backButtonHidden: { opacity: 0 },
  backText: { fontSize: 15, color: Colors.text, fontWeight: '700' },
  skipButton: { paddingVertical: 8, paddingHorizontal: 6 },
  skipText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  illustration: { height: 300, backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  routeLine: { position: 'absolute', width: 250, height: 6, borderRadius: 3, backgroundColor: Colors.primaryLight, transform: [{ rotate: '-18deg' }] },
  stopDot: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.secondary, borderWidth: 3, borderColor: Colors.surface },
  stopOne: { left: 38, top: 96 },
  stopTwo: { left: 142, top: 138 },
  stopThree: { right: 42, top: 188 },
  iconCircle: { width: 142, height: 142, borderRadius: 71, backgroundColor: Colors.primary + '14', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary + '25' },
  vehicleRow: { position: 'absolute', bottom: 24, flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16 },
  chip: { backgroundColor: Colors.text + '08', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7 },
  chipText: { color: Colors.text, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center', marginTop: 34 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginTop: 12, paddingHorizontal: 8 },
  footer: { gap: 22, paddingBottom: 10 },
  indicators: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.border },
  activeDot: { width: 28, backgroundColor: Colors.primary },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footerBackButton: { width: 104, minHeight: 52, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: Colors.surface },
  footerBackDisabled: { borderColor: Colors.border, backgroundColor: Colors.background },
  footerBackText: { fontSize: 15, color: Colors.primary, fontWeight: '800' },
  footerBackTextDisabled: { color: Colors.textSecondary },
  nextButton: { flex: 1, backgroundColor: Colors.primary, minHeight: 52, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextText: { fontSize: 16, color: '#FFF', fontWeight: '800' },
});
