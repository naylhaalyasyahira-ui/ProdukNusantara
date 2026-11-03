import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Initialize Supabase client if configured, otherwise create a mock-safe instance
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * SQL Schema script for Supabase to enforce strict Role-Based Access Control (RBAC)
 * and prevent Pembeli (buyers) from logging into or modifying Penjual/Admin tables.
 */
export const SUPABASE_RLS_SQL_SCHEMA = `-- =========================================================================
-- PRODUKNUSANTARA - SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Mencegah Akun Pembeli Mengakses / Mengubah Data Penjual UMKM & Admin
-- =========================================================================

-- 1. ENUM ROLE PENGGUNA
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');

-- 2. TABEL PROFILES (Terhubung otomatis dengan auth.users Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  role user_role DEFAULT 'buyer' NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Pengguna hanya bisa membaca profil publik atau profil miliknya sendiri
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Policy 2: Pengguna hanya bisa mengupdate profil miliknya sendiri, TETAPI TIDAK BISA MENGUBAH ROLE SENDIRI
CREATE POLICY "Users can update own profile except role" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- Role dikunci! Pembeli tidak bisa self-escalate jadi admin/penjual
  );

-- 3. TABEL STORES (Khusus Penjual UMKM)
CREATE TABLE public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  provinsi TEXT NOT NULL,
  kabupaten TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  desa TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Pembeli hanya bisa melihat toko yang sudah 'approved'
CREATE POLICY "Anyone can view approved stores"
  ON public.stores FOR SELECT
  USING (status = 'approved');

-- HANYA role 'seller' atau 'admin' yang bisa membuat toko
CREATE POLICY "Only sellers can create store"
  ON public.stores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'seller' OR role = 'admin')
    )
  );

-- HANYA Admin yang bisa mengubah status verifikasi toko (approve/reject)
CREATE POLICY "Only admins can change store status"
  ON public.stores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. FUNCTION TRIGGER SAAT USER MENDAFTAR (Supabase Auth Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role := 'buyer';
BEGIN
  -- Cegah pendaftaran otomatis sebagai admin dari publik
  IF (new.raw_user_meta_data->>'role') = 'seller' THEN
    assigned_role := 'seller';
  ELSE
    assigned_role := 'buyer'; -- Default selalu Pembeli
  END IF;

  INSERT INTO public.profiles (id, name, email, phone_number, role, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    assigned_role,
    COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger dijalankan setiap kali ada registrasi akun auth baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
