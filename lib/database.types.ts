export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: 'passenger' | 'driver' | 'admin';
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      vehicles: {
        Row: {
          id: string;
          type: 'combi' | 'bus' | 'specialTaxi';
          plate: string;
          route_id: string;
          driver_id: string;
          lat: number;
          lng: number;
          seats_available: number;
          total_seats: number;
          status: 'active' | 'inactive' | 'maintenance';
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'updated_at'>;
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>;
      };
      routes: {
        Row: {
          id: string;
          name: string;
          from_location: string;
          to_location: string;
          distance_km: number;
          estimated_duration_min: number;
          fare: number;
          is_active: boolean;
        };
        Insert: Database['public']['Tables']['routes']['Row'];
        Update: Partial<Database['public']['Tables']['routes']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string;
          route_id: string;
          seat_number: number | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          qr_code: string;
          fare: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      driver_requests: {
        Row: {
          id: string;
          driver_id: string;
          vehicle_id: string;
          passenger_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          message: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['driver_requests']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['driver_requests']['Insert']>;
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: 'delay' | 'cancellation' | 'info' | 'sos';
          route_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['alerts']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['alerts']['Insert']>;
      };
    };
  };
}
