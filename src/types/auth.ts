
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export type UserProfile = Database['public']['Tables']['users']['Row'];

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
