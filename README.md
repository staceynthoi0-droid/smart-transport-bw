# 🚌 Smart Transport BW

A mobile public transport assistant for Botswana, built with Expo (React Native) and Supabase.

## Features

- **Guest Preview Mode** – Explore routes and map without signing in
- **Route Search** – GPS-aware origin with "Current Location" label
- **Seat Availability** – Displayed as fraction (e.g., 3/15 seats)
- **Blue Bus Cards** – Each departure shown as a separate card (#1E88E5)
- **SOS Alert** – 3-second long-press with visual countdown
- **Safety Shield** – Icon in header for safety features
- **Seat Selection** – Visual grid with "Best Available" option
- **QR Code Booking** – Confirmation with scannable booking code
- **Driver Dashboard** – Large ±seat buttons, passenger request management
- **Map View** – Gaborone area with real-time vehicle markers
- **Alerts** – Delay, cancellation, and info notifications
- **Offline Support** – Cached fares, favourites, and recent searches
- **Error/Empty States** – Graceful handling for all edge cases

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (Android/iOS)
- (Optional) Supabase project for backend features

### Setup

```bash
# 1. Install dependencies
cd smart-transport-bw
npm install

# 2. Configure environment (optional – app works with mock data)
cp .env.example .env
# Edit .env with your Supabase project URL and anon key

# 3. Start development server
npx expo start
```

Scan the QR code with Expo Go on your phone.

### Database Setup (Optional)

If using Supabase:

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Run the seed data: `supabase/seed.sql`
4. Copy your project URL and anon key to `.env`

## Project Structure

```
smart-transport-bw/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Bottom tab navigation
│   │   ├── index.tsx       # Home (search, favourites, results)
│   │   ├── routes.tsx      # All routes with departures
│   │   ├── map.tsx         # Map with vehicle markers
│   │   ├── alerts.tsx      # Transport alerts
│   │   └── profile.tsx     # User profile / guest mode
│   ├── auth/               # Login & registration
│   ├── booking/            # Seat selection & confirmation
│   └── driver/             # Driver dashboard
├── components/             # Reusable UI components
├── lib/                    # Supabase client & offline cache
├── hooks/                  # Custom React hooks
├── constants/              # Colors, typography, fares, mock data
├── supabase/
│   ├── migrations/         # SQL schema
│   └── seed.sql            # Sample data
└── .vscode/                # Editor settings
```

## Map

Uses `react-native-maps` with Google Maps provider (Android) / Apple Maps (iOS).
No API key needed for development in Expo Go.

## Testing Checklist

- [ ] App starts with `npx expo start`
- [ ] Map shows Gaborone with vehicle markers
- [ ] Guest mode allows route search without login
- [ ] Sign up / sign in works (with Supabase configured)
- [ ] Route search returns bus cards with seat info
- [ ] Booking flow: seat grid → best available → QR confirmation
- [ ] SOS long-press shows countdown and triggers alert
- [ ] Driver dashboard: +/- seats, accept/reject requests
- [ ] Alerts screen shows transport notifications
- [ ] Empty states display correctly
- [ ] Offline: app loads cached data when disconnected

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Tech Stack

- **Frontend**: Expo SDK 52, React Native, TypeScript
- **Navigation**: Expo Router (file-based)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Maps**: react-native-maps (Google/Apple)
- **Offline**: AsyncStorage
- **Icons**: @expo/vector-icons (Ionicons)
