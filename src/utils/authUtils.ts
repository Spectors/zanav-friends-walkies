
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';

export const loadUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

export const createUserProfile = async (userId: string, fullName: string, email: string) => {
  try {
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        full_name: fullName,
        email: email,
        role: 'owner'
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }
  } catch (profileError) {
    console.error('Error creating user profile:', profileError);
  }
};
