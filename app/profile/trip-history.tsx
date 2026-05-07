import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { MOCK_TRIP_HISTORY } from '@/constants/mock-data';

export default function TripHistoryScreen() {
  const router = useRouter();
  const [trips] = useState(MOCK_TRIP_HISTORY);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={trips}
      keyExtractor={trip => trip.id}
      ListHeaderComponent={<Text style={styles.intro}>Repeat common trips and check previous cash fares.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="ticket-outline" size={22} color={Colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.from} to {item.to}</Text>
            <Text style={styles.meta}>{item.date} - {item.vehicle}</Text>
            <Text style={styles.fare}>BWP {item.fare.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.repeatButton} onPress={() => {
            Alert.alert('Trip ready', `${item.from} to ${item.to} has been loaded on Home.`);
            router.replace({ pathname: '/(tabs)', params: { from: item.from, to: item.to, search: 'true' } });
          }}>
            <Text style={styles.repeatText}>Repeat</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 10 },
  iconWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text },
  meta: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  fare: { fontSize: 13, color: Colors.primary, fontWeight: '800', marginTop: 5 },
  repeatButton: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  repeatText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
});
