
import type { 
  AuthResponse, 
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials, 
  SignUpWithPasswordCredentials 
} from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

// Create an in-memory mockUserDb for demo mode
const mockUserDb = new Map();

// Mock API functions to use when Supabase credentials are missing
export const mockApi = {
  auth: {
    getSession: async () => {
      return { data: { session: null }, error: null } as AuthResponse;
    },
    signInWithPassword: async (credentials: SignInWithPasswordCredentials) => {
      // Extract email and password from credentials
      // In Supabase, credentials has the shape { email?: string, password: string, ... }
      const email = 'email' in credentials ? credentials.email as string : '';
      const password = credentials.password;
      
      const user = mockUserDb.get(email);
      if (user && user.password === password) {
        return {
          data: {
            user: { 
              id: user.id, 
              email: user.email,
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString()
            },
            session: { 
              access_token: 'mock_token',
              token_type: 'bearer',
              expires_in: 3600,
              refresh_token: 'mock_refresh',
              user: { 
                id: user.id,
                app_metadata: {},
                user_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString()
              }
            }
          },
          error: null
        } as AuthTokenResponsePassword;
      }
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials', status: 400 }
      } as AuthTokenResponsePassword;
    },
    signUp: async (credentials: SignUpWithPasswordCredentials) => {
      // Extract email, password and options from credentials
      // In Supabase, credentials has the shape { email?: string, password: string, options?: {...} }
      const email = 'email' in credentials ? credentials.email as string : '';
      const password = credentials.password;
      const options = credentials.options;
      
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
          user: { 
            id, 
            email,
            app_metadata: {},
            user_metadata: options?.data || {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }, 
          session: { 
            access_token: 'mock_token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock_refresh',
            user: { 
              id,
              app_metadata: {},
              user_metadata: options?.data || {},
              aud: 'authenticated',
              created_at: new Date().toISOString()
            }
          }
        }, 
        error: null
      } as AuthResponse;
    },
    signOut: async () => ({ error: null }) as AuthResponse
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
          }
          return { data: null, error: { message: `Mocked DB: No ${table} data available` } };
        }
      }),
      maybeSingle: async () => ({ data: null, error: null }),
      // Only define eq once as a method
      order: () => ({
        eq: async () => ({ data: [], error: null })
      }),
      // Filter methods
      filter: () => ({
        eq: async () => ({ data: [], error: null })
      })
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

// Apply mock implementations to the supabase client
export function applyMockToClient(supabase: SupabaseClient<Database>) {
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

  return supabase;
}
