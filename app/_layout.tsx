import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Not authenticated - allow auth plus guest browsing routes.
  if (!user) {
    return (
      <LanguageProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="redirect" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: true, title: 'Sign In', headerBackTitle: 'Back' }} />
          <Stack.Screen name="auth/register" options={{ headerShown: true, title: 'Sign Up', headerBackTitle: 'Back' }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="booking/[vehicleId]" options={{ headerShown: true, title: 'Book Ride', headerBackTitle: 'Back' }} />
          <Stack.Screen name="booking/confirmation" options={{ headerShown: true, title: 'Booking Confirmed', headerBackTitle: 'Back' }} />
        </Stack>
      </LanguageProvider>
    );
  }

  // Authenticated - main app stack
  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {profile?.role === 'driver' ? (
          <Stack.Screen name="driver/dashboard" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
        <Stack.Screen name="booking/[vehicleId]" options={{ headerShown: true, title: 'Book Ride', headerBackTitle: 'Back' }} />
        <Stack.Screen name="booking/confirmation" options={{ headerShown: true, title: 'Booking Confirmed', headerBackTitle: 'Back' }} />
        <Stack.Screen name="driver/trip-history" options={{ headerShown: true, title: 'Driver Trip History', headerBackTitle: 'Back' }} />
        <Stack.Screen name="driver/report-delay" options={{ headerShown: true, title: 'Report Delay', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Edit Profile', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/trip-history" options={{ headerShown: true, title: 'Trip History', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/saved-places" options={{ headerShown: true, title: 'Saved Places', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/report-issue" options={{ headerShown: true, title: 'Report Issue', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/settings" options={{ headerShown: true, title: 'Settings', headerBackTitle: 'Back' }} />
      </Stack>
    </LanguageProvider>
  );
}
