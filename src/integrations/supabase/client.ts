
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://gjuunitqaivtxxtvfxsu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXVuaXRxYWl2dHh4dHZmeHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTA3MDQsImV4cCI6MjA2MjM4NjcwNH0.qMtSY8WZulgKRgTYXz6VEYeesoxsvxJE748kXwOazng';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
