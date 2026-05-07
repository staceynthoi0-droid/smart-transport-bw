import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import LocationInput from '@/components/LocationInput';
import SOSButton from '@/components/SOSButton';
import { DIRECT_ROUTE_OPTIONS, FEEDBACK_REASONS, LANDMARK_HINTS, MULTI_LEG_ROUTE_OPTIONS, MOCK_TRIP_HISTORY, MOCK_TRIP_STAGES, OFFLINE_CACHE_STATUS, POPULAR_PLACES, RouteOption, findRouteOptions, fuzzyPlaceMatch } from '@/constants/mock-data';
import { getFavourites, getRecentSearches, cacheRecentSearches } from '@/lib/offline';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string; search?: string }>();
  const { user } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [routeResults, setRouteResults] = useState<RouteOption[]>([]);
  const [searched, setSearched] = useState(false);
  const [tripStage] = useState(1);

  useEffect(() => {
    getFavourites().then(setFavourites);
    getRecentSearches().then(setRecentSearches);
  }, []);

  useEffect(() => {
    if (params.from) setFrom(params.from);
    if (params.to) {
      setTo(params.to);
      if (params.search === 'true') {
        handleSearch(params.to, params.from || from);
      }
    }
  }, [params.from, params.to, params.search]);

  const suggestions = useMemo(() => {
    const q = to.trim();
    return POPULAR_PLACES.filter(place => fuzzyPlaceMatch(q, place)).slice(0, 5);
  }, [to]);

  const handleSearch = (destination = to, origin = from) => {
    if (!destination.trim() && !origin.trim()) return;
    const results = findRouteOptions(origin, destination);
    setRouteResults(results);
    setSearched(true);
    const searchLabel = origin.trim() ? `${origin} to ${destination}` : destination;
    const updated = [searchLabel, ...recentSearches.filter(s => s !== searchLabel)].slice(0, 10);
    setRecentSearches(updated);
    cacheRecentSearches(updated);
  };

  const repeatTrip = (fromPlace: string, toPlace: string) => {
    setFrom(fromPlace);
    setTo(toPlace);
    handleSearch(toPlace, fromPlace);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          {user?.email ? 'Hello, ' + user.email.split('@')[0] : 'Welcome'}
        </Text>
        <Text style={styles.greetingSub}>Cash fares, live routes, safer pickups around Gaborone.</Text>
      </View>

      <View style={styles.searchCard}>
        <LocationInput label="From" value={from} onChangeText={setFrom} isCurrentLocation onGpsPress={() => setFrom('Current Location')} />
        <LocationInput label="To" value={to} onChangeText={setTo} />
        {to.length > 0 && suggestions.length > 0 && (
          <View style={styles.suggestionWrap}>
            {suggestions.map(place => (
              <TouchableOpacity key={place} style={styles.suggestionChip} onPress={() => { setTo(place); handleSearch(place, from); }}>
                <Text style={styles.suggestionText}>{place}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(to, from)}>
          <Ionicons name="search" size={20} color="#FFF" />
          <Text style={styles.searchButtonText}>Find Route</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.offlineBanner}>
        <Ionicons name="cloud-done-outline" size={18} color={Colors.success} />
        <Text style={styles.offlineText}>{OFFLINE_CACHE_STATUS.fares}. Last updated {OFFLINE_CACHE_STATUS.lastUpdated}.</Text>
      </View>

      <View style={styles.tripCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Trip Lifecycle</Text>
          <TouchableOpacity onPress={() => Alert.alert('Safety Mode', 'Safety Mode will be suggested when your trip starts. Share location can be limited to this trip only.')}>
            <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.stageRow}>
          {MOCK_TRIP_STAGES.map((stage, index) => (
            <View key={stage} style={styles.stageItem}>
              <View style={[styles.stageDot, index <= tripStage && styles.stageDotActive]} />
              <Text style={[styles.stageText, index <= tripStage && styles.stageTextActive]}>{stage}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Places</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {[...favourites, ...POPULAR_PLACES.slice(0, 5)].filter((v, i, arr) => arr.indexOf(v) === i).map(place => (
            <TouchableOpacity key={place} style={styles.chip} onPress={() => { setTo(place); handleSearch(place, from); }}>
              <Text style={styles.chipText}>{place}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.slice(0, 4).map(s => (
            <TouchableOpacity key={s} style={styles.recentItem} onPress={() => setTo(s)}>
              <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.recentText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {searched && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{routeResults.length > 0 ? `${routeResults.length} Routes Found` : 'No routes found'}</Text>
          {routeResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bus-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyTitle}>Try one of the demo routes</Text>
              <Text style={styles.emptyMsg}>Examples: Block 6 to UB, Main Mall to UB, Phakalane to CBD.</Text>
            </View>
          ) : (
            routeResults.map(route => <RouteResultCard key={route.id} route={route} />)
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Routes</Text>
        {MULTI_LEG_ROUTE_OPTIONS.slice(0, 3).map(route => <RouteResultCard key={route.id} route={route} compact />)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direct Routes</Text>
        {DIRECT_ROUTE_OPTIONS.slice(0, 3).map(route => <RouteResultCard key={route.id} route={route} compact />)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip History</Text>
        {MOCK_TRIP_HISTORY.map(trip => (
          <View key={trip.id} style={styles.historyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle}>{trip.from} to {trip.to}</Text>
              <Text style={styles.historyMeta}>{trip.date} - {trip.vehicle} - BWP {trip.fare.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.repeatButton} onPress={() => repeatTrip(trip.from, trip.to)}>
              <Text style={styles.repeatText}>Repeat</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety and Feedback</Text>
        <View style={styles.safetyBox}>
          {LANDMARK_HINTS.slice(0, 2).map(hint => <Text key={hint} style={styles.safetyText}>{hint}</Text>)}
          <TouchableOpacity style={styles.feedbackButton} onPress={() => Alert.alert('Report issue', FEEDBACK_REASONS.join('\n'))}>
            <Ionicons name="alert-circle-outline" size={18} color={Colors.danger} />
            <Text style={styles.feedbackText}>Report unsafe driver, incorrect fare, or route problem</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sosSection}>
        <SOSButton />
      </View>
    </ScrollView>
  );
}

function RouteResultCard({ route, compact = false }: { route: RouteOption; compact?: boolean }) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <View style={styles.routeResultCard}>
      <TouchableOpacity style={styles.routeResultHeader} onPress={() => setExpanded(!expanded)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.routeResultTitle}>{route.title}</Text>
          <Text style={styles.routeResultMeta}>{route.type === 'multi-leg' ? 'Multi-leg' : 'Direct'} - P{route.totalFare.toFixed(2)} - {route.totalTime} min</Text>
          {(route.vehicleType || route.seatsAvailable || route.traffic) && (
            <View style={styles.routePills}>
              {route.vehicleType && <Text style={styles.routePill}>{route.vehicleType === 'specialTaxi' ? 'Special Taxi' : route.vehicleType}</Text>}
              {route.seatsAvailable && <Text style={styles.routePill}>Seats {route.seatsAvailable}</Text>}
              {route.traffic && <Text style={[styles.routePill, route.traffic === 'Heavy' && styles.heavyPill, route.traffic === 'Clear' && styles.clearPill]}>{route.traffic}</Text>}
            </View>
          )}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      {expanded && route.segments.map(segment => (
        <View key={`${route.id}-${segment.segment}`} style={styles.segmentRow}>
          <View style={styles.segmentNumber}>
            <Text style={styles.segmentNumberText}>{segment.segment}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.segmentMode}>{segment.mode}</Text>
            <Text style={styles.segmentDescription}>{segment.description}</Text>
          </View>
          <View style={styles.segmentMeta}>
            <Text style={styles.segmentTime}>{segment.duration} min</Text>
            <Text style={styles.segmentFare}>{segment.fare ? `P${segment.fare.toFixed(2)}` : 'Free'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  greeting: { marginBottom: 16 },
  greetingText: { fontSize: 24, fontWeight: '800', color: Colors.text },
  greetingSub: { color: Colors.textSecondary, marginTop: 4, lineHeight: 20 },
  loginLink: { color: Colors.primary, fontWeight: '700', marginTop: 6, fontSize: 14 },
  searchCard: { backgroundColor: Colors.surface, borderRadius: 8, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  suggestionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  suggestionChip: { backgroundColor: Colors.primary + '12', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 14 },
  suggestionText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  searchButton: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  searchButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.success + '12', padding: 12, borderRadius: 8, marginBottom: 14 },
  offlineText: { flex: 1, color: Colors.text, fontSize: 12, fontWeight: '600' },
  tripCard: { backgroundColor: Colors.surface, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stageRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, gap: 6 },
  stageItem: { flex: 1, alignItems: 'center' },
  stageDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border, marginBottom: 6 },
  stageDotActive: { backgroundColor: Colors.primary },
  stageText: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', fontWeight: '700' },
  stageTextActive: { color: Colors.primary },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  chipText: { color: Colors.text, fontWeight: '700', fontSize: 13 },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  recentText: { fontSize: 14, color: Colors.text },
  emptyState: { alignItems: 'center', paddingVertical: 32, backgroundColor: Colors.surface, borderRadius: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: 12 },
  emptyMsg: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  routeResultCard: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10 },
  routeResultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeResultTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  routeResultMeta: { fontSize: 13, color: Colors.primary, fontWeight: '800', marginTop: 4 },
  routePills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  routePill: { overflow: 'hidden', backgroundColor: Colors.primary + '12', color: Colors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  heavyPill: { backgroundColor: Colors.danger + '12', color: Colors.danger },
  clearPill: { backgroundColor: Colors.success + '12', color: Colors.success },
  segmentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 10 },
  segmentNumber: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primary + '14', alignItems: 'center', justifyContent: 'center' },
  segmentNumberText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  segmentMode: { color: Colors.text, fontSize: 13, fontWeight: '800' },
  segmentDescription: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 2 },
  segmentMeta: { alignItems: 'flex-end' },
  segmentTime: { color: Colors.text, fontSize: 12, fontWeight: '800' },
  segmentFare: { color: Colors.primary, fontSize: 12, fontWeight: '800', marginTop: 3 },
  stepRow: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: Colors.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 8 },
  stepTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  stepText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  stepFare: { fontSize: 12, color: Colors.primary, fontWeight: '800' },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 8 },
  historyTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  historyMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  repeatButton: { backgroundColor: Colors.primary + '14', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7 },
  repeatText: { color: Colors.primary, fontWeight: '800', fontSize: 12 },
  safetyBox: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  safetyText: { color: Colors.text, fontSize: 13, marginBottom: 6 },
  feedbackButton: { marginTop: 8, flexDirection: 'row', gap: 8, alignItems: 'center' },
  feedbackText: { flex: 1, color: Colors.danger, fontWeight: '700', fontSize: 13 },
  sosSection: { marginTop: 4 },
});
