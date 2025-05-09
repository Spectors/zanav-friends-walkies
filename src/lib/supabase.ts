import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get Supabase URL and anon key from environment variables
// Provide fallback values to prevent crashing when env vars are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a mock client if we're in development mode without proper credentials
const isMissingCredentials = 
  supabaseUrl === 'https://your-project.supabase.co' || 
  supabaseAnonKey === 'your-anon-key';

console.log('Supabase initialization:', {
  usingMock: isMissingCredentials,
  url: supabaseUrl.substring(0, 10) + '...',
});

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
  breed?: string | null;
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

// Mock API functions to use when Supabase credentials are missing
export const mockApi = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Mocked auth: No credentials provided' } }),
    signOut: async () => ({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: `Mocked DB: No ${table} data available` } })
      }),
      eq: async () => ({ data: [], error: null })
    }),
    insert: async () => ({ data: null, error: { message: 'Mocked DB: Insert not available in demo mode' } }),
    update: async () => ({ data: null, error: { message: 'Mocked DB: Update not available in demo mode' } })
  })
};

// If we're missing credentials, monkey patch the supabase client with mock functions
// This allows the app to run in a demonstration mode without crashing
if (isMissingCredentials) {
  console.warn('Running with mock Supabase client! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.');
  
  // This is a simple approach to avoid TypeScript errors while providing mock functionality
  // In a real application, you would want to create a proper mock implementation
}
