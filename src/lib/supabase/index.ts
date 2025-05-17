
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

// Using placeholder URL and key for now
// We'll replace these with actual values when we're ready to connect to Supabase
const supabaseUrl = 'https://placeholder-project.supabase.co';
const supabaseAnonKey = 'placeholder-key';

// Create Supabase client (not connected to any real project yet)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export types for use in other files
export * from './types';
