export const FARES = {
  combi: { base: 4.50, perKm: 0.80 },
  bus: { base: 3.50, perKm: 0.60 },
  specialTaxi: { base: 8.00, perKm: 1.50 },
} as const;

export const CURRENCY = 'BWP';

export function calculateFare(type: keyof typeof FARES, distanceKm: number): number {
  const fare = FARES[type];
  return Math.round((fare.base + fare.perKm * distanceKm) * 100) / 100;
}
