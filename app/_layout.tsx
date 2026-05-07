import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="redirect" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" options={{ headerShown: true, title: 'Sign In', headerBackTitle: 'Back' }} />
        <Stack.Screen name="auth/register" options={{ headerShown: true, title: 'Sign Up', headerBackTitle: 'Back' }} />
        <Stack.Screen name="booking/[vehicleId]" options={{ headerShown: true, title: 'Book Ride', headerBackTitle: 'Back' }} />
        <Stack.Screen name="booking/confirmation" options={{ headerShown: true, title: 'Booking Confirmed', headerBackTitle: 'Back' }} />
        <Stack.Screen name="driver/dashboard" options={{ headerShown: true, title: 'Driver Dashboard', headerBackTitle: 'Back' }} />
        <Stack.Screen name="driver/trip-history" options={{ headerShown: true, title: 'Driver Trip History', headerBackTitle: 'Back' }} />
        <Stack.Screen name="driver/report-delay" options={{ headerShown: true, title: 'Report Delay', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Edit Profile', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/trip-history" options={{ headerShown: true, title: 'Trip History', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/saved-places" options={{ headerShown: true, title: 'Saved Places', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/report-issue" options={{ headerShown: true, title: 'Report Issue', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile/settings" options={{ headerShown: true, title: 'Settings', headerBackTitle: 'Back' }} />
      </Stack>
    </>
  );
}
