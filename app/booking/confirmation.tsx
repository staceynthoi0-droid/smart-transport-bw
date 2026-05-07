import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { MOCK_VEHICLES, MOCK_ROUTES } from '@/constants/mock-data';

// QR code fallback for web/environments without native SVG
function QRPlaceholder({ value }: { value: string }) {
  return (
    <View style={qrStyles.container}>
      <Ionicons name="qr-code" size={120} color={Colors.text} />
      <Text style={qrStyles.text}>{value.slice(0, 12)}...</Text>
    </View>
  );
}

const qrStyles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  text: { fontSize: 11, color: Colors.textSecondary, marginTop: 8 },
});

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{ vehicleId: string; seat: string; fare: string }>();
  const router = useRouter();

  const vehicle = MOCK_VEHICLES.find(v => v.id === params.vehicleId);
  const route = vehicle ? MOCK_ROUTES.find(r => r.id === vehicle.route_id) : null;
  const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
        </View>
        <Text style={styles.title}>Booking Confirmed</Text>
        <Text style={styles.bookingId}>Booking: {bookingId}</Text>

        <View style={styles.details}>
          <DetailRow label="Route" value={route?.name || 'N/A'} />
          <DetailRow label="Vehicle" value={vehicle ? `${vehicle.plate} - ${vehicle.colour}` : 'N/A'} />
          <DetailRow label="Driver" value={vehicle?.driver_name || 'N/A'} />
          <DetailRow label="Seat" value={`#${params.seat}`} />
          <DetailRow label="Fare" value={`BWP ${Number(params.fare).toFixed(2)}`} />
        </View>

        <Text style={styles.qrLabel}>Show this QR code to the driver. Pay cash fare at boarding.</Text>
        <QRPlaceholder value={bookingId} />
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, justifyContent: 'center' },
  card: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  checkCircle: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text },
  bookingId: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  details: { width: '100%', marginTop: 20, marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  qrLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 8 },
  homeButton: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  homeText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
