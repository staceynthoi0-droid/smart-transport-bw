import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

interface SeatGridProps {
  totalSeats: number;
  availableSeats: number[];
  onSelect: (seat: number) => void;
  selectedSeat: number | null;
}

export default function SeatGrid({ totalSeats, availableSeats, onSelect, selectedSeat }: SeatGridProps) {
  const cols = totalSeats <= 15 ? 3 : 4;

  return (
    <View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.seatAvailable }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.seatOccupied }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.seatSelected }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {Array.from({ length: totalSeats }, (_, i) => i + 1).map(seat => {
          const isAvailable = availableSeats.includes(seat);
          const isSelected = selectedSeat === seat;
          return (
            <TouchableOpacity
              key={seat}
              style={[
                styles.seat,
                { width: `${Math.floor(90 / cols)}%` },
                isAvailable ? styles.available : styles.occupied,
                isSelected && styles.selected,
              ]}
              disabled={!isAvailable}
              onPress={() => onSelect(seat)}
            >
              <Text style={[styles.seatText, isSelected && { color: '#FFF' }]}>{seat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, color: Colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  seat: { aspectRatio: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 },
  available: { backgroundColor: Colors.seatAvailable + '30', borderWidth: 2, borderColor: Colors.seatAvailable },
  occupied: { backgroundColor: Colors.seatOccupied, borderWidth: 2, borderColor: Colors.seatOccupied },
  selected: { backgroundColor: Colors.seatSelected, borderColor: Colors.seatSelected },
  seatText: { fontWeight: '600', fontSize: 14, color: Colors.text },
});
