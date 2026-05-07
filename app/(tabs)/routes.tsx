import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { MOCK_DEPARTURES, MOCK_ROUTES, MOCK_STOPS, MOCK_VEHICLES, fuzzyPlaceMatch } from '@/constants/mock-data';
import BusCard from '@/components/BusCard';
import EmptyState from '@/components/EmptyState';

export default function RoutesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredRoutes = MOCK_ROUTES.filter(route => !query || fuzzyPlaceMatch(query, route.name) || fuzzyPlaceMatch(query, route.from) || fuzzyPlaceMatch(query, route.to));

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput style={styles.searchInput} placeholder="Search UB, Main Mall, Airport Junction..." value={query} onChangeText={setQuery} placeholderTextColor={Colors.textSecondary} />
      </View>

      {filteredRoutes.length === 0 ? (
        <EmptyState icon="git-branch-outline" title="No routes found" message="Try a landmark, rank, or destination name." />
      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={route => route.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item: route }) => {
            const departures = MOCK_DEPARTURES.filter(d => d.route_id === route.id);
            const stops = route.stops.map(id => MOCK_STOPS.find(stop => stop.id === id)?.name).filter(Boolean);
            return (
              <View style={styles.routeSection}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeName}>{route.name}</Text>
                  <View style={[styles.statusBadge, route.status === 'disrupted' ? styles.disrupted : route.status === 'slow' ? styles.slow : styles.active]}>
                    <Text style={styles.statusText}>{route.status}</Text>
                  </View>
                </View>
                <Text style={styles.routeMeta}>{route.distance}km - about {route.duration} min - BWP {route.fare.toFixed(2)}</Text>
                <Text style={styles.stopText}>{stops.join(' -> ')}</Text>
                {departures.map(dep => {
                  const vehicle = MOCK_VEHICLES.find(v => v.id === dep.vehicle_id);
                  if (!vehicle) return null;
                  return (
                    <BusCard
                      key={dep.id}
                      vehicleType={vehicle.type}
                      plate={`${vehicle.plate} - ${vehicle.colour}`}
                      from={route.from}
                      to={route.to}
                      departureTime={dep.departure_time}
                      arrivalTime={dep.arrival_time}
                      seatsAvailable={vehicle.seats_available}
                      totalSeats={vehicle.total_seats}
                      fare={dep.fare}
                      traffic={route.traffic}
                      onPress={() => router.push(`/booking/${vehicle.id}`)}
                    />
                  );
                })}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, margin: 16, marginBottom: 0, borderRadius: 8, paddingHorizontal: 14, gap: 8, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.text },
  routeSection: { marginBottom: 20 },
  routeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  routeName: { flex: 1, fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  routeMeta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  stopText: { fontSize: 12, color: Colors.textSecondary, marginBottom: 10, lineHeight: 17 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  active: { backgroundColor: Colors.success + '18' },
  slow: { backgroundColor: Colors.warning + '22' },
  disrupted: { backgroundColor: Colors.danger + '18' },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'capitalize', color: Colors.text },
});
