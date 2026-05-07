import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { MOCK_ROUTES } from '@/constants/mock-data';
import { cacheData, getCachedData } from '@/lib/offline';

type DelayReport = {
  id: string;
  route: string;
  delayMinutes: string;
  reason: string;
  details: string;
  createdAt: string;
};

const DELAY_REASONS = ['Traffic', 'Road works', 'Vehicle issue', 'Police stop', 'Weather', 'Other'];

export default function ReportDelayScreen() {
  const [route, setRoute] = useState(MOCK_ROUTES[0].name);
  const [delayMinutes, setDelayMinutes] = useState('10');
  const [reason, setReason] = useState(DELAY_REASONS[0]);
  const [details, setDetails] = useState('');
  const [reports, setReports] = useState<DelayReport[]>([]);

  useEffect(() => {
    getCachedData<DelayReport[]>('driver_delay_reports', Number.MAX_SAFE_INTEGER).then(data => setReports(data || []));
  }, []);

  const submit = async () => {
    if (!delayMinutes.trim()) {
      Alert.alert('Delay needed', 'Add the estimated delay in minutes.');
      return;
    }
    const report = {
      id: `delay-${Date.now()}`,
      route,
      delayMinutes,
      reason,
      details: details.trim() || 'No extra details',
      createdAt: new Date().toISOString(),
    };
    const next = [report, ...reports];
    setReports(next);
    setDetails('');
    await cacheData('driver_delay_reports', next);
    Alert.alert('Delay reported', 'Commuters can be alerted from this delay report.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Report route delays so commuters can avoid long waits and choose safer pickup points.</Text>

      <Text style={styles.label}>Route</Text>
      <View style={styles.optionWrap}>
        {MOCK_ROUTES.map(item => (
          <TouchableOpacity key={item.id} style={[styles.option, route === item.name && styles.optionActive]} onPress={() => setRoute(item.name)}>
            <Text style={[styles.optionText, route === item.name && styles.optionTextActive]}>{item.from} to {item.to}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Delay Reason</Text>
      <View style={styles.optionWrap}>
        {DELAY_REASONS.map(item => (
          <TouchableOpacity key={item} style={[styles.option, reason === item && styles.optionActive]} onPress={() => setReason(item)}>
            <Text style={[styles.optionText, reason === item && styles.optionTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Estimated Delay Minutes</Text>
      <TextInput style={styles.input} value={delayMinutes} onChangeText={setDelayMinutes} keyboardType="number-pad" placeholder="10" placeholderTextColor={Colors.textSecondary} />

      <Text style={styles.label}>Details</Text>
      <TextInput style={styles.textArea} value={details} onChangeText={setDetails} multiline textAlignVertical="top" placeholder="Example: heavy traffic near Main Mall rank." placeholderTextColor={Colors.textSecondary} />

      <TouchableOpacity style={styles.submitButton} onPress={submit}>
        <Ionicons name="warning" size={18} color="#FFF" />
        <Text style={styles.submitText}>Submit Delay Report</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Recent Delay Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.empty}>No delay reports yet.</Text>
      ) : (
        reports.map(report => (
          <View key={report.id} style={styles.reportCard}>
            <Text style={styles.reportReason}>{report.reason} - {report.delayMinutes} min</Text>
            <Text style={styles.reportMeta}>{report.route} - {new Date(report.createdAt).toLocaleString()}</Text>
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
  label: { color: Colors.text, fontSize: 14, fontWeight: '800', marginBottom: 8 },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  option: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  optionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionText: { color: Colors.text, fontSize: 12, fontWeight: '700' },
  optionTextActive: { color: '#FFF' },
  input: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 14 },
  textArea: { minHeight: 110, backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: 14, fontSize: 15, marginBottom: 14 },
  submitButton: { backgroundColor: Colors.warning, borderRadius: 8, minHeight: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  historyTitle: { color: Colors.text, fontWeight: '800', fontSize: 16, marginTop: 24, marginBottom: 10 },
  empty: { color: Colors.textSecondary, textAlign: 'center', paddingVertical: 16 },
  reportCard: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 14, marginBottom: 10 },
  reportReason: { color: Colors.text, fontWeight: '800', fontSize: 14 },
  reportMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  reportDetails: { color: Colors.text, fontSize: 13, lineHeight: 18, marginTop: 8 },
});
