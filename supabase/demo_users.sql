-- Demo users for Smart Public Transport BW.
-- Run this in Supabase SQL Editor after applying the profile schema update.
-- Demo commuter: commuter.demo@gmail.com / Demo1234!
-- Demo driver:   driver.demo@gmail.com / Driver1234!

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  commuter_id UUID := '10000000-0000-0000-0000-000000000001';
  driver_id UUID := '10000000-0000-0000-0000-000000000002';
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES
    (
      '00000000-0000-0000-0000-000000000000',
      commuter_id,
      'authenticated',
      'authenticated',
      'commuter.demo@gmail.com',
      crypt('Demo1234!', gen_salt('bf')),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Commuter","role":"commuter","phone":"+267 7111 0001"}'::jsonb,
      now(),
      now()
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      driver_id,
      'authenticated',
      'authenticated',
      'driver.demo@gmail.com',
      crypt('Driver1234!', gen_salt('bf')),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Driver","role":"driver","phone":"+267 7222 0002","vehicle_type":"combi","license_plate":"B 321 DEM","operating_base":"Main Mall Rank"}'::jsonb,
      now(),
      now()
    )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    confirmed_at = COALESCE(auth.users.confirmed_at, now()),
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES
    (
      gen_random_uuid(),
      commuter_id,
      commuter_id::text,
      jsonb_build_object('sub', commuter_id::text, 'email', 'commuter.demo@gmail.com', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    ),
    (
      gen_random_uuid(),
      driver_id,
      driver_id::text,
      jsonb_build_object('sub', driver_id::text, 'email', 'driver.demo@gmail.com', 'email_verified', true),
      'email',
      now(),
      now(),
      now()
    )
  ON CONFLICT (provider, provider_id) DO UPDATE
  SET
    identity_data = EXCLUDED.identity_data,
    updated_at = now();

  INSERT INTO public.profiles (
    id,
    full_name,
    phone,
    role,
    avatar_url,
    vehicle_type,
    license_plate,
    operating_base
  )
  VALUES
    (
      commuter_id,
      'Demo Commuter',
      '+267 7111 0001',
      'commuter',
      NULL,
      NULL,
      NULL,
      NULL
    ),
    (
      driver_id,
      'Demo Driver',
      '+267 7222 0002',
      'driver',
      NULL,
      'combi',
      'B 321 DEM',
      'Main Mall Rank'
    )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url,
    vehicle_type = EXCLUDED.vehicle_type,
    license_plate = EXCLUDED.license_plate,
    operating_base = EXCLUDED.operating_base,
    updated_at = now();
END $$;
