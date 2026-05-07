import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { MOCK_ROUTES } from '@/constants/mock-data';
import EmptyState from '@/components/EmptyState';

type PassengerRequest = {
  id: string;
  passenger: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'rejected';
};

export default function DriverDashboard() {
  const [online, setOnline] = useState(true);
  const [activeRouteId, setActiveRouteId] = useState(MOCK_ROUTES[0].id);
  const [seats, setSeats] = useState(8);
  const totalSeats = 15;
  const [tracking, setTracking] = useState(false);
  const [requests, setRequests] = useState<PassengerRequest[]>([
    { id: '1', passenger: 'Keabetswe M.', pickup: 'Main Mall Rank', dropoff: 'BBS Mall', status: 'pending' },
    { id: '2', passenger: 'Tumelo R.', pickup: 'Rail Park Mall', dropoff: 'Broadhurst', status: 'pending' },
    { id: '3', passenger: 'Lesego K.', pickup: 'Station Bus Rank', dropoff: 'UB Library Gate', status: 'accepted' },
  ]);

  const activeRoute = MOCK_ROUTES.find(route => route.id === activeRouteId) || MOCK_ROUTES[0];

  const adjustSeats = (delta: number) => {
    const next = seats + delta;
    if (next >= 0 && next <= totalSeats) setSeats(next);
  };

  const handleRequest = (id: string, action: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(request => request.id === id ? { ...request, status: action } : request));
    Alert.alert(action === 'accepted' ? 'Accepted' : 'Rejected', action === 'accepted' ? 'Passenger request accepted.' : 'Passenger request rejected.');
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <>
          <View style={styles.statusCard}>
            <View>
              <Text style={styles.statusTitle}>{online ? 'Online' : 'Offline'}</Text>
              <Text style={styles.statusSub}>{online ? 'Visible to commuters nearby' : 'Hidden from passenger search'}</Text>
            </View>
            <Switch value={online} onValueChange={setOnline} trackColor={{ false: Colors.border, true: Colors.primaryLight }} thumbColor={online ? Colors.primary : Colors.textSecondary} />
          </View>

          <Text style={styles.sectionTitle}>Active Route</Text>
          <View style={styles.routeList}>
            {MOCK_ROUTES.map(route => (
              <TouchableOpacity key={route.id} style={[styles.routeChip, activeRouteId === route.id && styles.routeChipActive]} onPress={() => setActiveRouteId(route.id)}>
                <Text style={[styles.routeChipText, activeRouteId === route.id && styles.routeChipTextActive]}>{route.from} to {route.to}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.routeSummary}>
            <Text style={styles.routeTitle}>{activeRoute.name}</Text>
            <Text style={styles.routeMeta}>Status: {activeRoute.status} - Cash fare BWP {activeRoute.fare.toFixed(2)}</Text>
          </View>

          <View style={styles.seatCard}>
            <Text style={styles.seatLabel}>Available Seats</Text>
            <View style={styles.seatRow}>
              <TouchableOpacity style={styles.seatBtn} onPress={() => adjustSeats(-1)}>
                <Ionicons name="remove-circle" size={56} color={Colors.danger} />
              </TouchableOpacity>
              <View style={styles.seatCount}>
                <Text style={styles.seatNumber}>{seats}</Text>
                <Text style={styles.seatTotal}>/ {totalSeats}</Text>
              </View>
              <TouchableOpacity style={styles.seatBtn} onPress={() => adjustSeats(1)}>
                <Ionicons name="add-circle" size={56} color={Colors.success} />
              </TouchableOpacity>
            </View>
            <Text style={styles.availability}>{seats === 0 ? 'Almost full' : seats < totalSeats / 2 ? 'Half-full' : 'Empty'}</Text>
          </View>

          <TouchableOpacity style={[styles.trackingButton, tracking && styles.trackingButtonActive]} onPress={() => setTracking(!tracking)}>
            <Ionicons name={tracking ? 'navigate' : 'navigate-outline'} size={20} color={tracking ? '#FFF' : Colors.primary} />
            <Text style={[styles.trackingText, tracking && styles.trackingTextActive]}>{tracking ? 'Trip tracking on' : 'Start trip tracking'}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Passenger Requests</Text>
        </>
      }
      data={requests}
      keyExtractor={request => request.id}
      renderItem={({ item }) => (
        <View style={styles.requestCard}>
          <View style={styles.requestInfo}>
            <Text style={styles.passengerName}>{item.passenger}</Text>
            <Text style={styles.pickup}>{item.pickup} to {item.dropoff}</Text>
          </View>
          {item.status === 'pending' ? (
            <View style={styles.requestActions}>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => handleRequest(item.id, 'accepted')}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRequest(item.id, 'rejected')}>
                <Ionicons name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.statusBadge, item.status === 'accepted' ? styles.badgeAccepted : styles.badgeRejected]}>
              <Text style={styles.requestStatusText}>{item.status}</Text>
            </View>
          )}
        </View>
      )}
      ListEmptyComponent={<EmptyState icon="people-outline" title="No requests" message="No passenger requests at the moment." />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 34 },
  statusCard: { backgroundColor: Colors.surface, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  statusTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statusSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  routeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  routeChip: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  routeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  routeChipText: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  routeChipTextActive: { color: '#FFF' },
  routeSummary: { backgroundColor: Colors.primary + '10', borderRadius: 8, padding: 12, marginBottom: 18 },
  routeTitle: { color: Colors.text, fontWeight: '800', fontSize: 14 },
  routeMeta: { color: Colors.textSecondary, marginTop: 4, fontSize: 12, textTransform: 'capitalize' },
  seatCard: { backgroundColor: Colors.surface, borderRadius: 8, padding: 22, alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  seatLabel: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary, marginBottom: 16 },
  seatRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  seatBtn: { padding: 4 },
  seatCount: { flexDirection: 'row', alignItems: 'baseline' },
  seatNumber: { fontSize: 56, fontWeight: '800', color: Colors.text },
  seatTotal: { fontSize: 22, fontWeight: '600', color: Colors.textSecondary, marginLeft: 4 },
  availability: { color: Colors.primary, fontWeight: '800', marginTop: 8 },
  trackingButton: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 },
  trackingButtonActive: { backgroundColor: Colors.primary },
  trackingText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  trackingTextActive: { color: '#FFF' },
  requestCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 8, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  requestInfo: { flex: 1 },
  passengerName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  pickup: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  requestActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: { backgroundColor: Colors.success, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { backgroundColor: Colors.danger, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeAccepted: { backgroundColor: Colors.success + '20' },
  badgeRejected: { backgroundColor: Colors.danger + '20' },
  requestStatusText: { fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
});
