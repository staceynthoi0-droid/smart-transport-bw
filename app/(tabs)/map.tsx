import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors } from '@/constants/colors';
import { GABORONE_CENTER, MOCK_ROUTES, MOCK_STOPS, MOCK_VEHICLES, OFFLINE_CACHE_STATUS } from '@/constants/mock-data';

let MapLibreGL: any = null;
try {
  MapLibreGL = require('@maplibre/maplibre-react-native');
  MapLibreGL.setAccessToken?.(null);
} catch {
  MapLibreGL = null;
}

const defaultCenter: [number, number] = [GABORONE_CENTER.longitude, GABORONE_CENTER.latitude];
const vehicleIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  taxi: 'car',
  specialTaxi: 'car-sport',
  combi: 'bus',
  bus: 'trail-sign',
};

export default function MapScreen() {
  const cameraRef = useRef<any>(null);
  const [selectedRouteId, setSelectedRouteId] = useState(MOCK_ROUTES[0].id);
  const [userLocation, setUserLocation] = useState<[number, number]>(defaultCenter);

  const selectedRoute = useMemo(
    () => MOCK_ROUTES.find(route => route.id === selectedRouteId) || MOCK_ROUTES[0],
    [selectedRouteId]
  );

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') return;
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).then(position => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  const centerOnUser = () => {
    cameraRef.current?.setCamera({
      centerCoordinate: userLocation,
      zoomLevel: 13,
      animationDuration: 650,
    });
  };

  const routeFeature = {
    type: 'Feature' as const,
    geometry: { type: 'LineString' as const, coordinates: selectedRoute.path },
    properties: { id: selectedRoute.id },
  };

  if (!MapLibreGL || Platform.OS === 'web') {
    return <MapFallback selectedRouteId={selectedRouteId} onSelectRoute={setSelectedRouteId} />;
  }

  const MapView = MapLibreGL.MapView;
  const Camera = MapLibreGL.Camera;
  const ShapeSource = MapLibreGL.ShapeSource;
  const LineLayer = MapLibreGL.LineLayer;
  const PointAnnotation = MapLibreGL.PointAnnotation;
  const UserLocation = MapLibreGL.UserLocation;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled
        styleURL="https://demotiles.maplibre.org/style.json"
      >
        <Camera ref={cameraRef} zoomLevel={12} centerCoordinate={defaultCenter} animationMode="flyTo" animationDuration={700} />
        <UserLocation visible showsUserHeadingIndicator />

        <ShapeSource id="selected-route" shape={routeFeature} onPress={() => setSelectedRouteId(selectedRoute.id)}>
          <LineLayer id="selected-route-line" style={{ lineColor: Colors.primary, lineWidth: 6, lineOpacity: 0.9, lineCap: 'round', lineJoin: 'round' }} />
        </ShapeSource>

        {MOCK_ROUTES.filter(route => route.id !== selectedRoute.id).map(route => (
          <ShapeSource key={route.id} id={`route-${route.id}`} shape={{ type: 'Feature', geometry: { type: 'LineString', coordinates: route.path }, properties: { id: route.id } }} onPress={() => setSelectedRouteId(route.id)}>
            <LineLayer id={`route-line-${route.id}`} style={{ lineColor: route.status === 'disrupted' ? Colors.danger : Colors.textSecondary, lineWidth: 3, lineOpacity: 0.45, lineCap: 'round', lineJoin: 'round' }} />
          </ShapeSource>
        ))}

        {MOCK_STOPS.map(stop => (
          <PointAnnotation key={stop.id} id={stop.id} coordinate={[stop.lng, stop.lat]}>
            <View style={styles.stopMarker}>
              <Ionicons name="location" size={14} color={Colors.primary} />
            </View>
          </PointAnnotation>
        ))}

        {MOCK_VEHICLES.map(vehicle => (
          <PointAnnotation key={vehicle.id} id={vehicle.id} coordinate={[vehicle.lng, vehicle.lat]}>
            <View style={styles.vehicleMarker}>
              <Ionicons name={vehicleIcons[vehicle.type] || 'car'} size={18} color="#FFF" />
            </View>
          </PointAnnotation>
        ))}
      </MapView>

      <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={22} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>{selectedRoute.name}</Text>
            <Text style={styles.sheetSub}>{selectedRoute.status.toUpperCase()} - BWP {selectedRoute.fare.toFixed(2)} - {selectedRoute.duration} min</Text>
          </View>
          <View style={[styles.statusBadge, routeStatusStyle(selectedRoute.status)]}>
            <Text style={styles.statusText}>{selectedRoute.status}</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeChips}>
          {MOCK_ROUTES.map(route => (
            <TouchableOpacity key={route.id} style={[styles.routeChip, route.id === selectedRouteId && styles.routeChipActive]} onPress={() => setSelectedRouteId(route.id)}>
              <Text style={[styles.routeChipText, route.id === selectedRouteId && styles.routeChipTextActive]}>{route.from} to {route.to}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function MapFallback({ selectedRouteId, onSelectRoute }: { selectedRouteId: string; onSelectRoute: (id: string) => void }) {
  const selectedRoute = MOCK_ROUTES.find(route => route.id === selectedRouteId) || MOCK_ROUTES[0];
  const stops = selectedRoute.stops.map(id => MOCK_STOPS.find(stop => stop.id === id)).filter(Boolean);

  return (
    <ScrollView style={styles.fallback} contentContainerStyle={styles.fallbackContent}>
      <View style={styles.fallbackMap}>
        <View style={styles.routeLineFallback} />
        <View style={[styles.userDot, { left: '46%', top: '42%' }]} />
        {stops.map((stop, index) => (
          <View key={stop!.id} style={[styles.fallbackStop, { left: `${12 + index * 26}%`, top: `${30 + index * 12}%` }]}>
            <Text style={styles.fallbackStopText}>{index + 1}</Text>
          </View>
        ))}
        {MOCK_VEHICLES.filter(vehicle => vehicle.route_id === selectedRoute.id).map((vehicle, index) => (
          <View key={vehicle.id} style={[styles.fallbackVehicle, { left: `${34 + index * 18}%`, top: `${48 + index * 8}%` }]}>
            <Ionicons name={vehicleIcons[vehicle.type] || 'car'} size={16} color="#FFF" />
          </View>
        ))}
      </View>

      <View style={styles.offlineBanner}>
        <Ionicons name="cloud-done-outline" size={18} color={Colors.success} />
        <Text style={styles.offlineText}>{OFFLINE_CACHE_STATUS.routes}. Last updated {OFFLINE_CACHE_STATUS.lastUpdated}.</Text>
      </View>

      <Text style={styles.sectionTitle}>Routes</Text>
      {MOCK_ROUTES.map(route => (
        <TouchableOpacity key={route.id} style={[styles.routeCard, route.id === selectedRouteId && styles.routeCardActive]} onPress={() => onSelectRoute(route.id)}>
          <View style={styles.routeCardHeader}>
            <Text style={styles.routeName}>{route.name}</Text>
            <View style={[styles.statusBadge, routeStatusStyle(route.status)]}>
              <Text style={styles.statusText}>{route.status}</Text>
            </View>
          </View>
          <Text style={styles.routeMeta}>BWP {route.fare.toFixed(2)} - {route.duration} min - {route.stops.length} stops</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Vehicles on {selectedRoute.to}</Text>
      {MOCK_VEHICLES.filter(vehicle => vehicle.route_id === selectedRoute.id).map(vehicle => (
        <View key={vehicle.id} style={styles.vehicleCard}>
          <Ionicons name={vehicleIcons[vehicle.type] || 'car'} size={24} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.vehiclePlate}>{vehicle.plate} - {vehicle.colour}</Text>
            <Text style={styles.vehicleSeats}>{vehicle.driver_name} - ETA {vehicle.eta_minutes} min - {vehicle.availability}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function routeStatusStyle(status: string) {
  if (status === 'disrupted') return { backgroundColor: Colors.danger + '18' };
  if (status === 'slow') return { backgroundColor: Colors.warning + '20' };
  return { backgroundColor: Colors.success + '18' };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centerButton: { position: 'absolute', right: 16, top: 18, width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  stopMarker: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary },
  vehicleMarker: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.surface },
  sheet: { position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: Colors.surface, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: Colors.border },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  sheetTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  sheetSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  routeChips: { gap: 8, paddingTop: 12 },
  routeChip: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.background },
  routeChipActive: { backgroundColor: Colors.primary },
  routeChipText: { fontSize: 12, color: Colors.text, fontWeight: '700' },
  routeChipTextActive: { color: '#FFF' },
  fallback: { flex: 1, backgroundColor: Colors.background },
  fallbackContent: { padding: 16, paddingBottom: 36 },
  fallbackMap: { height: 280, borderRadius: 8, backgroundColor: '#EAF3EF', borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 12 },
  routeLineFallback: { position: 'absolute', width: 360, height: 8, borderRadius: 4, backgroundColor: Colors.primary, left: -20, top: 150, transform: [{ rotate: '-19deg' }] },
  fallbackStop: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  fallbackStopText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  fallbackVehicle: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  userDot: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.primaryLight, borderWidth: 3, borderColor: '#FFF' },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.success + '12', padding: 12, borderRadius: 8, marginBottom: 16 },
  offlineText: { flex: 1, color: Colors.text, fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 10, marginTop: 6 },
  routeCard: { backgroundColor: Colors.surface, borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  routeCardActive: { borderColor: Colors.primary },
  routeCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  routeName: { flex: 1, fontSize: 15, fontWeight: '800', color: Colors.text },
  routeMeta: { color: Colors.textSecondary, fontSize: 13, marginTop: 6 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  statusText: { fontSize: 11, color: Colors.text, fontWeight: '800', textTransform: 'capitalize' },
  vehicleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  vehiclePlate: { fontSize: 14, fontWeight: '800', color: Colors.text },
  vehicleSeats: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
});
