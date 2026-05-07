import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { LANDMARK_HINTS, MOCK_DEPARTURES, MOCK_ROUTES, MOCK_STOPS, MOCK_TRIP_STAGES, MOCK_VEHICLES } from '@/constants/mock-data';
import SeatGrid from '@/components/SeatGrid';
import { useAuth } from '@/hooks/useAuth';

export default function BookingScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const router = useRouter();
  const { isGuest } = useAuth();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const vehicle = MOCK_VEHICLES.find(v => v.id === vehicleId);
  const departure = MOCK_DEPARTURES.find(d => d.vehicle_id === vehicleId);
  const route = vehicle ? MOCK_ROUTES.find(r => r.id === vehicle.route_id) : null;
  const pickupStop = route ? MOCK_STOPS.find(stop => stop.id === route.stops[0]) : null;
  const dropoffStop = route ? MOCK_STOPS.find(stop => stop.id === route.stops[route.stops.length - 1]) : null;

  if (!vehicle || !departure || !route) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.danger} />
        <Text style={styles.errorTitle}>Vehicle not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const availableSeats = Array.from({ length: vehicle.total_seats }, (_, i) => i + 1).filter((_, i) => i < vehicle.seats_available);

  const handleBook = () => {
    if (isGuest) {
      Alert.alert('Sign In Required', 'Please sign in to book a ride.', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }
    if (!selectedSeat) {
      Alert.alert('Select a Seat', 'Please select a seat or use Best Available.');
      return;
    }
    router.push({ pathname: '/booking/confirmation', params: { vehicleId: vehicle.id, seat: String(selectedSeat), fare: String(departure.fare) } });
  };

  const handleBestAvailable = () => {
    if (availableSeats.length > 0) {
      const seat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
      setSelectedSeat(seat);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.routeName}>{route.name}</Text>
        <Text style={styles.routeInfo}>{route.from} to {route.to}</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.metaItem}>{departure.departure_time} to {departure.arrival_time}</Text>
          <Text style={styles.metaItem}>BWP {departure.fare.toFixed(2)}</Text>
          <Text style={styles.metaItem}>{vehicle.seats_available}/{vehicle.total_seats} seats</Text>
        </View>
      </View>

      <View style={styles.identityCard}>
        <Text style={styles.sectionTitle}>Vehicle Identification</Text>
        <View style={styles.detailGrid}>
          <Detail label="Plate" value={vehicle.plate} />
          <Detail label="Type" value={vehicle.type === 'specialTaxi' ? 'Special Taxi' : vehicle.type} />
          <Detail label="Colour" value={vehicle.colour} />
          <Detail label="Driver" value={vehicle.driver_name} />
        </View>
      </View>

      <View style={styles.pickupCard}>
        <Text style={styles.sectionTitle}>Pickup and Drop-off</Text>
        <Text style={styles.pointTitle}>Pickup: {pickupStop?.name || route.from}</Text>
        <Text style={styles.pointText}>{pickupStop?.landmark || LANDMARK_HINTS[0]}</Text>
        <TouchableOpacity style={styles.adjustButton} onPress={() => Alert.alert('Adjust pickup', 'Open the Map tab to adjust the pickup pin before confirming.')}>
          <Ionicons name="map-outline" size={18} color={Colors.primary} />
          <Text style={styles.adjustText}>Adjust on map</Text>
        </TouchableOpacity>
        <Text style={styles.pointTitle}>Drop-off: {dropoffStop?.name || route.to}</Text>
        <Text style={styles.pointText}>Walking directions: follow the main rank walkway, then confirm the landmark with the driver.</Text>
      </View>

      <View style={styles.lifecycleCard}>
        {MOCK_TRIP_STAGES.map((stage, index) => (
          <View key={stage} style={styles.lifecycleItem}>
            <View style={[styles.lifecycleDot, index <= 1 && styles.lifecycleDotActive]} />
            <Text style={[styles.lifecycleText, index <= 1 && styles.lifecycleTextActive]}>{stage}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Select Your Seat</Text>
      <SeatGrid totalSeats={vehicle.total_seats} availableSeats={availableSeats} onSelect={setSelectedSeat} selectedSeat={selectedSeat} />

      <TouchableOpacity style={styles.bestButton} onPress={handleBestAvailable}>
        <Ionicons name="sparkles" size={18} color={Colors.primary} />
        <Text style={styles.bestText}>Best Available</Text>
      </TouchableOpacity>

      {selectedSeat && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Seat #{selectedSeat} - BWP {departure.fare.toFixed(2)}</Text>
          <Text style={styles.safetyPrompt}>Safety Mode will be suggested when the trip starts. Share location for this trip only.</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.bookButton, (!selectedSeat || vehicle.seats_available === 0) && styles.bookDisabled]} onPress={handleBook} disabled={vehicle.seats_available === 0}>
        <Text style={styles.bookText}>{vehicle.seats_available === 0 ? 'Fully Booked' : 'Confirm Booking'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { backgroundColor: Colors.primary, borderRadius: 8, padding: 20, marginBottom: 16 },
  routeName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  routeInfo: { fontSize: 14, color: '#FFF', opacity: 0.9, marginTop: 4 },
  headerMeta: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  metaItem: { color: '#FFF', fontSize: 13 },
  identityCard: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 16 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  detailItem: { width: '47%', backgroundColor: Colors.background, borderRadius: 8, padding: 10 },
  detailLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 3, textTransform: 'uppercase', fontWeight: '700' },
  detailValue: { fontSize: 13, color: Colors.text, fontWeight: '800', textTransform: 'capitalize' },
  pickupCard: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 16 },
  pointTitle: { fontSize: 14, color: Colors.text, fontWeight: '800', marginBottom: 4 },
  pointText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10, lineHeight: 18 },
  adjustButton: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 8 },
  adjustText: { color: Colors.primary, fontWeight: '800' },
  lifecycleCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 18, gap: 6 },
  lifecycleItem: { flex: 1, alignItems: 'center' },
  lifecycleDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border, marginBottom: 5 },
  lifecycleDotActive: { backgroundColor: Colors.primary },
  lifecycleText: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', fontWeight: '700' },
  lifecycleTextActive: { color: Colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  bestButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginTop: 16, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8 },
  bestText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
  summary: { backgroundColor: Colors.primary + '15', borderRadius: 8, padding: 14, marginTop: 16, alignItems: 'center' },
  summaryText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  safetyPrompt: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 17 },
  bookButton: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  bookDisabled: { backgroundColor: Colors.border },
  bookText: { color: '#FFF', fontWeight: '800', fontSize: 17 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: 16 },
  errorLink: { color: Colors.primary, fontWeight: '700', marginTop: 12, fontSize: 15 },
});
