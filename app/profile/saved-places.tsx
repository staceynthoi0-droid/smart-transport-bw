import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SavedPlace, cacheSavedPlaces, getSavedPlaces } from '@/lib/offline';

export default function SavedPlacesScreen() {
  const router = useRouter();
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [name, setName] = useState('');
  const [landmark, setLandmark] = useState('');

  useEffect(() => {
    getSavedPlaces().then(setPlaces);
  }, []);

  const savePlaces = async (next: SavedPlace[]) => {
    setPlaces(next);
    await cacheSavedPlaces(next);
  };

  const addPlace = () => {
    if (!name.trim()) {
      Alert.alert('Name needed', 'Add a place name first.');
      return;
    }
    const next = [
      { id: `sp-${Date.now()}`, name: name.trim(), landmark: landmark.trim() || 'No landmark added', type: 'other' as const },
      ...places,
    ];
    setName('');
    setLandmark('');
    savePlaces(next);
  };

  const removePlace = (id: string) => {
    savePlaces(places.filter(place => place.id !== id));
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={places}
      keyExtractor={place => place.id}
      ListHeaderComponent={
        <View style={styles.form}>
          <Text style={styles.intro}>Save ranks, malls, schools, work, or home pickups for faster search.</Text>
          <TextInput style={styles.input} placeholder="Place name" value={name} onChangeText={setName} placeholderTextColor={Colors.textSecondary} />
          <TextInput style={styles.input} placeholder="Landmark or pickup note" value={landmark} onChangeText={setLandmark} placeholderTextColor={Colors.textSecondary} />
          <TouchableOpacity style={styles.addButton} onPress={addPlace}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addText}>Add Saved Place</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Ionicons name="location-outline" size={22} color={Colors.primary} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.meta}>{item.landmark}</Text>
          </View>
          <TouchableOpacity style={styles.useButton} onPress={() => router.replace({ pathname: '/(tabs)', params: { to: item.name, search: 'true' } })}>
            <Text style={styles.useText}>Use</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removePlace(item.id)}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No saved places yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  form: { marginBottom: 14 },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  input: { backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1, borderColor: Colors.border, marginBottom: 10, color: Colors.text },
  addButton: { backgroundColor: Colors.primary, borderRadius: 8, minHeight: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  addText: { color: '#FFF', fontWeight: '800' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 10 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text },
  meta: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  useButton: { backgroundColor: Colors.primary + '14', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  useText: { color: Colors.primary, fontWeight: '800', fontSize: 12 },
  empty: { color: Colors.textSecondary, textAlign: 'center', marginTop: 20 },
});
