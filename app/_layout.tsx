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
      </Stack>
    </>
  );
}
