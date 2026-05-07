import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FEEDBACK_REASONS, POPULAR_PLACES } from '@/constants/mock-data';
import { IssueReport, cacheIssueReports, getIssueReports } from '@/lib/offline';

export default function ReportIssueScreen() {
  const [reason, setReason] = useState(FEEDBACK_REASONS[0]);
  const [route, setRoute] = useState(POPULAR_PLACES[0]);
  const [details, setDetails] = useState('');
  const [reports, setReports] = useState<IssueReport[]>([]);

  useEffect(() => {
    getIssueReports().then(setReports);
  }, []);

  const submitReport = async () => {
    if (!details.trim()) {
      Alert.alert('Details needed', 'Please describe what happened.');
      return;
    }
    const report = {
      id: `ir-${Date.now()}`,
      reason,
      route,
      details: details.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [report, ...reports];
    setReports(next);
    setDetails('');
    await cacheIssueReports(next);
    Alert.alert('Issue reported', 'Your report was saved and can be reviewed later.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Report unsafe driving, wrong fares, missing stops, or route problems.</Text>

      <Text style={styles.label}>Issue Type</Text>
      <View style={styles.optionWrap}>
        {FEEDBACK_REASONS.map(item => (
          <TouchableOpacity key={item} style={[styles.option, reason === item && styles.optionActive]} onPress={() => setReason(item)}>
            <Text style={[styles.optionText, reason === item && styles.optionTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Route or Place</Text>
      <View style={styles.optionWrap}>
        {POPULAR_PLACES.slice(0, 6).map(item => (
          <TouchableOpacity key={item} style={[styles.option, route === item && styles.optionActive]} onPress={() => setRoute(item)}>
            <Text style={[styles.optionText, route === item && styles.optionTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Details</Text>
      <TextInput
        style={styles.textArea}
        value={details}
        onChangeText={setDetails}
        placeholder="Example: Driver charged BWP 10 instead of BWP 5.50 near Main Mall."
        placeholderTextColor={Colors.textSecondary}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
        <Ionicons name="send" size={18} color="#FFF" />
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Submitted Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.empty}>No reports submitted yet.</Text>
      ) : (
        reports.map(report => (
          <View key={report.id} style={styles.reportCard}>
            <Text style={styles.reportReason}>{report.reason}</Text>
            <Text style={styles.reportMeta}>{report.route} - {new Date(report.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.reportDetails}>{report.details}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 18 },
  label: { fontSize: 14, color: Colors.text, fontWeight: '800', marginBottom: 8 },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  option: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  optionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionText: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  optionTextActive: { color: '#FFF' },
  textArea: { minHeight: 120, backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: 14, fontSize: 15, marginBottom: 14 },
  submitButton: { backgroundColor: Colors.primary, borderRadius: 8, minHeight: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  historyTitle: { color: Colors.text, fontWeight: '800', fontSize: 16, marginTop: 24, marginBottom: 10 },
  empty: { color: Colors.textSecondary, textAlign: 'center', paddingVertical: 16 },
  reportCard: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 14, marginBottom: 10 },
  reportReason: { color: Colors.text, fontWeight: '800', fontSize: 14 },
  reportMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  reportDetails: { color: Colors.text, fontSize: 13, lineHeight: 18, marginTop: 8 },
});
