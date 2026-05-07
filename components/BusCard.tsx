import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface BusCardProps {
  vehicleType: 'taxi' | 'combi' | 'bus' | 'specialTaxi';
  plate: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  seatsAvailable: number;
  totalSeats: number;
  fare: number;
  traffic: 'low' | 'medium' | 'high';
  onPress?: () => void;
}

const trafficColors = { low: Colors.success, medium: Colors.warning, high: Colors.danger };
const typeIcons = { taxi: 'car' as const, combi: 'bus' as const, bus: 'trail-sign' as const, specialTaxi: 'car-sport' as const };
const typeLabels = { taxi: 'Taxi', combi: 'Combi', bus: 'Bus', specialTaxi: 'Special Taxi' };

export default function BusCard({ vehicleType, plate, from, to, departureTime, arrivalTime, seatsAvailable, totalSeats, fare, traffic, onPress }: BusCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.typeRow}>
          <Ionicons name={typeIcons[vehicleType]} size={20} color="#FFF" />
          <Text style={styles.typeLabel}>{typeLabels[vehicleType]}</Text>
        </View>
        <Text style={styles.plate}>{plate}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.routeRow}>
          <View style={styles.locationCol}>
            <Text style={styles.time}>{departureTime}</Text>
            <Text style={styles.location}>{from}</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={Colors.textSecondary} />
          <View style={styles.locationCol}>
            <Text style={styles.time}>{arrivalTime}</Text>
            <Text style={styles.location}>{to}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Ionicons name="people" size={14} color={seatsAvailable > 0 ? Colors.success : Colors.danger} />
            <Text style={[styles.seats, { color: seatsAvailable > 0 ? Colors.success : Colors.danger }]}>
              {seatsAvailable}/{totalSeats} seats
            </Text>
          </View>

          <View style={[styles.trafficChip, { backgroundColor: trafficColors[traffic] + '20' }]}>
            <View style={[styles.trafficDot, { backgroundColor: trafficColors[traffic] }]} />
            <Text style={[styles.trafficText, { color: trafficColors[traffic] }]}>{traffic}</Text>
          </View>

          <Text style={styles.fare}>BWP {fare.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeLabel: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  plate: { color: '#FFF', fontSize: 13, opacity: 0.9 },
  body: { padding: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  locationCol: { flex: 1 },
  time: { fontSize: 18, fontWeight: '700', color: Colors.text },
  location: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seats: { fontSize: 13, fontWeight: '600' },
  trafficChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  trafficDot: { width: 6, height: 6, borderRadius: 3 },
  trafficText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  fare: { fontSize: 16, fontWeight: '700', color: Colors.primary },
});
