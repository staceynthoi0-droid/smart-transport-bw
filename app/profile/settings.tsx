import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';
import { CommuterSettings, cacheCommuterSettings, getCommuterSettings } from '@/lib/offline';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<CommuterSettings | null>(null);

  useEffect(() => {
    getCommuterSettings().then(setSettings);
  }, []);

  const update = async (changes: Partial<CommuterSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...changes };
    setSettings(next);
    await cacheCommuterSettings(next);
  };

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'tn' : 'en';
    await setLanguage(newLang);
  };

  if (!settings) return <View style={styles.container} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Dummy commuter settings for low-data travel, safety prompts, and route alerts.</Text>

      <SettingRow
        title={t.profile.language}
        subtitle={language === 'en' ? 'Setswana' : 'English'}
        showArrow={false}
        onPress={toggleLanguage}
        rightElement={
          <View style={styles.languageBadge}>
            <Text style={styles.languageBadgeText}>{language === 'en' ? 'English' : 'Setswana'}</Text>
          </View>
        }
      />
      <SettingRow title="Low Data Mode" subtitle="Prefer cached routes and lightweight map views." value={settings.lowDataMode} onValueChange={value => update({ lowDataMode: value })} />
      <SettingRow title="Safety Mode Prompt" subtitle="Suggest trip-only sharing when travel starts." value={settings.safetyModePrompt} onValueChange={value => update({ safetyModePrompt: value })} />
      <SettingRow title="Traffic Alerts" subtitle="Show active, slow, and disrupted route updates." value={settings.trafficAlerts} onValueChange={value => update({ trafficAlerts: value })} />
      <SettingRow title="Offline Route Cache" subtitle="Keep saved routes and fares available offline." value={settings.cacheOfflineRoutes} onValueChange={value => update({ cacheOfflineRoutes: value })} />
      <SettingRow title="Haptic Feedback" subtitle="Vibrate lightly for route actions and alerts." value={settings.hapticFeedback} onValueChange={value => update({ hapticFeedback: value })} />

      <Text style={styles.label}>Default Pickup</Text>
      <TextInput style={styles.input} value={settings.defaultPickup} onChangeText={value => update({ defaultPickup: value })} placeholder="Current Location" placeholderTextColor={Colors.textSecondary} />
    </ScrollView>
  );
}

function SettingRow({
  title,
  subtitle,
  value,
  onValueChange,
  onPress,
  rightElement
}: {
  title: string;
  subtitle: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, onPress && styles.rowClickable]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : value !== undefined && onValueChange ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.border, true: Colors.primaryLight }}
          thumbColor={value ? Colors.primary : Colors.textSecondary}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 10, gap: 12 },
  rowClickable: { cursor: 'pointer' },
  rowText: { flex: 1 },
  title: { color: Colors.text, fontSize: 15, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  label: { color: Colors.text, fontSize: 14, fontWeight: '800', marginTop: 10, marginBottom: 8 },
  input: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  languageBadge: { backgroundColor: Colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  languageBadgeText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
});
