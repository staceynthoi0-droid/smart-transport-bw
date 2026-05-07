import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_ROUTES, MOCK_VEHICLES } from '@/constants/mock-data';

export type Vehicle = typeof MOCK_VEHICLES[number];

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try fetching from Supabase, fall back to mock data
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('vehicles').select('*');
        if (!error && data && data.length > 0) {
          setVehicles(data.map((v: any) => {
            const mockVehicle = MOCK_VEHICLES.find(vehicle => vehicle.id === v.id);
            const route = MOCK_ROUTES.find(item => item.id === (v.route_id || mockVehicle?.route_id));
            const totalSeats = v.total_seats ?? mockVehicle?.total_seats ?? 15;
            const seatsAvailable = v.seats_available ?? mockVehicle?.seats_available ?? totalSeats;
            return {
            id: v.id,
            type: (v.type || mockVehicle?.type || 'combi') as Vehicle['type'],
            route_id: v.route_id || mockVehicle?.route_id || route?.id || '',
            plate: v.plate || mockVehicle?.plate || 'B --- ---',
            colour: v.colour || mockVehicle?.colour || 'White',
            lat: v.lat ?? mockVehicle?.lat ?? -24.6547,
            lng: v.lng ?? mockVehicle?.lng ?? 25.9083,
            seats_available: seatsAvailable,
            total_seats: totalSeats,
            driver_name: v.driver_name || mockVehicle?.driver_name || 'Driver',
            eta_minutes: v.eta_minutes ?? mockVehicle?.eta_minutes ?? 10,
            availability: seatsAvailable === 0 ? 'Almost full' : seatsAvailable < totalSeats / 2 ? 'Half-full' : 'Empty',
          };
          }));
        }
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('vehicles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setVehicles(prev => prev.map(v =>
            v.id === (payload.new as any).id
              ? { ...v, ...(payload.new as any) }
              : v
          ));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { vehicles, loading };
}
