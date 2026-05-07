export type VehicleType = 'taxi' | 'combi' | 'bus' | 'specialTaxi';
export type RouteTraffic = 'low' | 'medium' | 'high';
export type RouteStatus = 'active' | 'slow' | 'disrupted';
export type SeatStatus = 'Empty' | 'Half-full' | 'Almost full';
export type TripStage = 'Searching' | 'Assigned' | 'Waiting' | 'In Progress' | 'Completed';

export const GABORONE_CENTER = {
  latitude: -24.6547,
  longitude: 25.9083,
};

export const POPULAR_PLACES = [
  'University of Botswana',
  'Main Mall',
  'Airport Junction',
  'Station Bus Rank',
  'BBS Mall',
  'Game City Mall',
  'Mogoditshane',
  'Tlokweng Border',
  'Phase 2',
  'Broadhurst',
  'Phakalane',
  'Rail Park Mall',
];

export const LANDMARK_HINTS = [
  'Meet at the nearest visible rank sign.',
  'Confirm the plate before boarding.',
  'Use well-lit pickup points at night.',
  'Ask the driver for the route name before paying cash.',
];

export const MOCK_STOPS = [
  { id: 's1', name: 'Main Mall Rank', landmark: 'Near Queens Road taxi bay', lat: -24.6583, lng: 25.9126 },
  { id: 's2', name: 'Rail Park Mall', landmark: 'North entrance', lat: -24.6589, lng: 25.9036 },
  { id: 's3', name: 'BBS Mall', landmark: 'Broadhurst side rank', lat: -24.6239, lng: 25.9318 },
  { id: 's4', name: 'Station Bus Rank', landmark: 'Central bus station platforms', lat: -24.6617, lng: 25.9041 },
  { id: 's5', name: 'University of Botswana', landmark: 'Library gate', lat: -24.6661, lng: 25.9288 },
  { id: 's6', name: 'Airport Junction', landmark: 'Mall taxi holding area', lat: -24.6006, lng: 25.9307 },
  { id: 's7', name: 'Mogoditshane Main Stop', landmark: 'Along Molepolole Road', lat: -24.6266, lng: 25.8659 },
  { id: 's8', name: 'CBD Square', landmark: 'iTowers side', lat: -24.6464, lng: 25.9065 },
  { id: 's9', name: 'Tlokweng Border', landmark: 'Public transport bay', lat: -24.6658, lng: 25.9801 },
  { id: 's10', name: 'Game City Mall', landmark: 'Southern entrance rank', lat: -24.6866, lng: 25.8818 },
  { id: 's11', name: 'Phase 2 Clinic', landmark: 'Clinic frontage', lat: -24.6392, lng: 25.9002 },
  { id: 's12', name: 'Broadhurst Police', landmark: 'Police station stop', lat: -24.6291, lng: 25.9226 },
];

export const MOCK_ROUTES = [
  {
    id: '1',
    name: 'Route 1 - Main Mall to BBS',
    from: 'Main Mall',
    to: 'BBS Mall',
    distance: 5.2,
    duration: 15,
    traffic: 'low' as RouteTraffic,
    status: 'active' as RouteStatus,
    fare: 5.5,
    stops: ['s1', 's2', 's3'],
    path: [
      [25.9126, -24.6583],
      [25.9094, -24.6534],
      [25.9153, -24.6446],
      [25.9234, -24.6358],
      [25.9318, -24.6239],
    ],
  },
  {
    id: '2',
    name: 'Route 2 - Station to UB and Airport Junction',
    from: 'Station Bus Rank',
    to: 'University of Botswana',
    distance: 8.1,
    duration: 25,
    traffic: 'medium' as RouteTraffic,
    status: 'slow' as RouteStatus,
    fare: 7,
    stops: ['s4', 's1', 's5', 's6'],
    path: [
      [25.9041, -24.6617],
      [25.9126, -24.6583],
      [25.9288, -24.6661],
      [25.9307, -24.6006],
    ],
  },
  {
    id: '3',
    name: 'Route 3 - Mogoditshane to CBD',
    from: 'Mogoditshane',
    to: 'CBD',
    distance: 12,
    duration: 35,
    traffic: 'high' as RouteTraffic,
    status: 'disrupted' as RouteStatus,
    fare: 8,
    stops: ['s7', 's11', 's8'],
    path: [
      [25.8659, -24.6266],
      [25.8842, -24.6312],
      [25.9002, -24.6392],
      [25.9065, -24.6464],
    ],
  },
  {
    id: '4',
    name: 'Route 4 - Tlokweng to Game City',
    from: 'Tlokweng Border',
    to: 'Game City Mall',
    distance: 10.5,
    duration: 30,
    traffic: 'low' as RouteTraffic,
    status: 'active' as RouteStatus,
    fare: 9,
    stops: ['s9', 's5', 's8', 's10'],
    path: [
      [25.9801, -24.6658],
      [25.9288, -24.6661],
      [25.9065, -24.6464],
      [25.8818, -24.6866],
    ],
  },
];

export const MOCK_VEHICLES = [
  { id: 'v1', type: 'combi' as VehicleType, route_id: '1', plate: 'B 123 ABC', colour: 'White with blue stripe', lat: -24.6551, lng: 25.9089, seats_available: 3, total_seats: 15, driver_name: 'Kabo M.', eta_minutes: 4, availability: 'Almost full' as SeatStatus },
  { id: 'v2', type: 'bus' as VehicleType, route_id: '2', plate: 'B 456 DEF', colour: 'Blue', lat: -24.6600, lng: 25.9200, seats_available: 12, total_seats: 45, driver_name: 'Thabo K.', eta_minutes: 8, availability: 'Half-full' as SeatStatus },
  { id: 'v3', type: 'combi' as VehicleType, route_id: '1', plate: 'B 789 GHI', colour: 'Silver', lat: -24.6480, lng: 25.9050, seats_available: 0, total_seats: 15, driver_name: 'Neo B.', eta_minutes: 11, availability: 'Almost full' as SeatStatus },
  { id: 'v4', type: 'specialTaxi' as VehicleType, route_id: '3', plate: 'B 101 JKL', colour: 'Red', lat: -24.6700, lng: 25.8900, seats_available: 2, total_seats: 4, driver_name: 'Lebo T.', eta_minutes: 6, availability: 'Half-full' as SeatStatus },
  { id: 'v5', type: 'bus' as VehicleType, route_id: '4', plate: 'B 202 MNO', colour: 'Green', lat: -24.6400, lng: 25.9300, seats_available: 30, total_seats: 60, driver_name: 'Mpho S.', eta_minutes: 14, availability: 'Empty' as SeatStatus },
];

export const MOCK_DEPARTURES = [
  { id: 'd1', vehicle_id: 'v1', route_id: '1', departure_time: '08:15', arrival_time: '08:30', fare: 5.5 },
  { id: 'd2', vehicle_id: 'v2', route_id: '2', departure_time: '08:30', arrival_time: '08:55', fare: 7 },
  { id: 'd3', vehicle_id: 'v3', route_id: '1', departure_time: '09:00', arrival_time: '09:15', fare: 5.5 },
  { id: 'd4', vehicle_id: 'v4', route_id: '3', departure_time: '08:45', arrival_time: '09:20', fare: 15 },
  { id: 'd5', vehicle_id: 'v5', route_id: '4', departure_time: '09:15', arrival_time: '09:45', fare: 9 },
];

export const MOCK_TRIP_STAGES: TripStage[] = ['Searching', 'Assigned', 'Waiting', 'In Progress', 'Completed'];

export const MOCK_MULTI_LEG_TRIP = [
  { id: 'leg1', route: 'Route 2', instruction: 'Walk 4 min to Station Bus Rank', wait: '5 min', fare: 0 },
  { id: 'leg2', route: 'Station to UB', instruction: 'Board blue bus B 456 DEF', wait: '8 min', fare: 7 },
  { id: 'leg3', route: 'UB transfer', instruction: 'Transfer at UB Library Gate for Airport Junction', wait: '6 min', fare: 5.5 },
];

export const MOCK_TRIP_HISTORY = [
  { id: 'h1', from: 'Main Mall', to: 'BBS Mall', date: '2026-05-04', fare: 5.5, vehicle: 'B 123 ABC' },
  { id: 'h2', from: 'Station Bus Rank', to: 'University of Botswana', date: '2026-05-02', fare: 7, vehicle: 'B 456 DEF' },
];

export const FEEDBACK_REASONS = ['Unsafe driver', 'Incorrect fare', 'Route problem', 'Vehicle did not stop'];

export const OFFLINE_CACHE_STATUS = {
  routes: 'Cached for offline use',
  fares: 'Cached fares available',
  lastUpdated: '7 May 2026, 08:00',
};

export const MOCK_ALERTS = [
  { id: 'a1', title: 'Route 1 Delay', message: 'Slow traffic near Main Mall. Expect a 10 minute delay.', type: 'delay' as const, created_at: new Date().toISOString() },
  { id: 'a2', title: 'Route 3 Disruption', message: 'Road works near Phase 2. Use CBD Square for pickup.', type: 'cancellation' as const, created_at: new Date().toISOString() },
  { id: 'a3', title: 'Safety Reminder', message: 'Share trip location only while travelling and confirm the vehicle plate.', type: 'sos' as const, created_at: new Date().toISOString() },
  { id: 'a4', title: 'New Route Added', message: 'Phakalane to CBD corridor is being piloted this week.', type: 'info' as const, created_at: new Date().toISOString() },
];

export function fuzzyPlaceMatch(query: string, value: string) {
  const cleanQuery = query.trim().toLowerCase();
  const cleanValue = value.toLowerCase();
  if (!cleanQuery) return true;
  if (cleanValue.includes(cleanQuery)) return true;
  let hits = 0;
  for (const char of cleanQuery) {
    if (cleanValue.includes(char)) hits += 1;
  }
  return hits / Math.max(cleanQuery.length, 1) > 0.7;
}
