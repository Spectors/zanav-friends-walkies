
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';
import type { 
  AuthResponse, 
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials, 
  SignUpWithPasswordCredentials
} from '@supabase/supabase-js';
import { applyMockToClient } from './mock';
export * from './types';

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

// If we're missing credentials, monkey patch the supabase client with mock functions
// This allows the app to run in a demonstration mode without crashing
if (isMissingCredentials) {
  applyMockToClient(supabase);
}

// Re-export types from @supabase/supabase-js for use in other files
export type {
  AuthResponse,
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials
};
