
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: 'owner' | 'giver';
  profile_image?: string | null;
  is_verified: boolean;
  created_at: string;
};

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  age: number;
  species: 'dog' | 'cat';
  gender?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
};

export type ServiceRequest = {
  id: string;
  pet_id: string;
  owner_id: string;
  service_type: 'walk' | 'grooming' | 'boarding' | 'training';
  location?: string | null;
  date?: string | null;
  time_from?: string | null;
  time_to?: string | null;
  duration?: number | null;
  status: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
};

export type ServiceOffer = {
  id: string;
  request_id: string;
  giver_id: string;
  message?: string | null;
  price_ils: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

export type Service = {
  id: string;
  offer_id: string;
  request_id: string;
  start_time?: string | null;
  end_time?: string | null;
  location_url?: string | null;
  photo_url?: string | null;
  status: 'in_progress' | 'completed' | 'cancelled';
  rating?: number | null;
  tip_ils?: number | null;
  created_at: string;
};

export type Verification = {
  id: string;
  user_id: string;
  selfie_url?: string | null;
  id_image_url?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
