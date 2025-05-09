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
    signInWithPassword: async ({ email, password }) => {
      const user = mockUserDb.get(email);
      if (user && user.password === password) {
        return { 
          data: { 
            user: { id: user.id, email: user.email }, 
            session: { user: { id: user.id } } 
          }, 
          error: null 
        };
      }
      return { data: { user: null }, error: { message: 'Invalid login credentials' } };
    },
    signUp: async ({ email, password, options }) => {
      // Create a mock user
      const id = 'user_' + Date.now().toString();
      const userData = {
        id,
        email,
        password,
        profile: options?.data || {}
      };
      mockUserDb.set(email, userData);
      
      // Return success response
      return {
        data: { 
          user: { id, email }, 
          session: { user: { id } } 
        }, 
        error: null
      };
    },
    signOut: async () => ({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: (field: string, value: string) => ({
        single: async () => {
          if (table === 'users' && field === 'id') {
            const mockUser = Array.from(mockUserDb.values())
              .find(user => user.id === value);
            
if (mockUser) {
  return { 
    data: { 
      id: mockUser.id, 
      email: mockUser.email,
      full_name: mockUser.profile?.full_name || 'Mock User',
      role: mockUser.profile?.role || 'owner',
      is_verified: false,
      created_at: new Date().toISOString()
    }, 
    error: null 
  };
}
          return { data: null, error: { message: `Mocked DB: No ${table} data available` } };
        }),
      }),
      maybeSingle: async () => ({ data: null, error: null }),
      eq: async () => ({ data: [], error: null })
    }),
    insert: async (data: any) => {
      // Handle insertion based on table
      if (table === 'users') {
        return { data: { ...data, id: 'mock_' + Date.now() }, error: null };
      }
      return { data: { ...data, id: 'mock_' + Date.now() }, error: null };
    },
    update: async () => ({ data: null, error: { message: 'Mocked DB: Update not available in demo mode' } })
  })
};

// If we're missing credentials, monkey patch the supabase client with mock functions
// This allows the app to run in a demonstration mode without crashing
if (isMissingCredentials) {
  console.warn('Running with mock Supabase client! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for full functionality.');
  
  // Apply mock implementations to the supabase client
  supabase.auth.getSession = mockApi.auth.getSession;
  supabase.auth.signInWithPassword = mockApi.auth.signInWithPassword;
  supabase.auth.signUp = mockApi.auth.signUp;
  supabase.auth.signOut = mockApi.auth.signOut;
  
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = (table: string) => {
    // Return our mock implementation first
    const mockImpl = mockApi.from(table);
    const originalImpl = originalFrom(table);
    
    return {
      ...originalImpl,
      select: (...args: any[]) => {
        try {
          return originalImpl.select(...args);
        } catch (e) {
          return mockImpl.select();
        }
      },
      insert: (...args: any[]) => {
        try {
          return originalImpl.insert(...args);
        } catch (e) {
          return mockImpl.insert(args[0]);
        }
      },
      update: (...args: any[]) => {
        try {
          return originalImpl.update(...args);
        } catch (e) {
          return mockImpl.update();
        }
      }
    };
  };
}
