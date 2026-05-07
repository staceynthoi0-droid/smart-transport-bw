-- Seed routes
INSERT INTO public.routes (id, name, from_location, to_location, distance_km, estimated_duration_min, fare) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Route 1 – Main Mall to BBS', 'Main Mall', 'BBS Mall', 5.2, 15, 5.50),
  ('22222222-2222-2222-2222-222222222222', 'Route 2 – Station to UB', 'Bus Rank', 'University of Botswana', 8.1, 25, 7.00),
  ('33333333-3333-3333-3333-333333333333', 'Route 3 – Mogoditshane to CBD', 'Mogoditshane', 'CBD', 12.0, 35, 15.00),
  ('44444444-4444-4444-4444-444444444444', 'Route 4 – Tlokweng to Game City', 'Tlokweng Border', 'Game City Mall', 10.5, 30, 9.00);

-- Seed vehicles (driver_id NULL for demo, no auth user yet)
INSERT INTO public.vehicles (id, type, plate, route_id, lat, lng, seats_available, total_seats) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'combi', 'B 123 ABC', '11111111-1111-1111-1111-111111111111', -24.6551, 25.9089, 3, 15),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bus', 'B 456 DEF', '22222222-2222-2222-2222-222222222222', -24.6600, 25.9200, 12, 45),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'combi', 'B 789 GHI', '11111111-1111-1111-1111-111111111111', -24.6480, 25.9050, 0, 15),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'specialTaxi', 'B 101 JKL', '33333333-3333-3333-3333-333333333333', -24.6700, 25.8900, 2, 4),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bus', 'B 202 MNO', '44444444-4444-4444-4444-444444444444', -24.6400, 25.9300, 30, 60);

-- Seed alerts
INSERT INTO public.alerts (title, message, type, route_id) VALUES
  ('Route 1 Delay', 'Heavy traffic near Main Mall. Expect 10 min delay.', 'delay', '11111111-1111-1111-1111-111111111111'),
  ('Route 3 Cancelled', 'Morning service cancelled due to road maintenance.', 'cancellation', '33333333-3333-3333-3333-333333333333'),
  ('New Route Added', 'Route 5 now serves Phakalane–CBD corridor.', 'info', NULL);
