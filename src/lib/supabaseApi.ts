
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Pet = Database['public']['Tables']['pets']['Row'];
type NewPet = Database['public']['Tables']['pets']['Insert'];
type User = Database['public']['Tables']['users']['Row'];
type NewUser = Database['public']['Tables']['users']['Insert'];
type Post = Database['public']['Tables']['posts']['Row'];
type NewPost = Database['public']['Tables']['posts']['Insert'];
type Service = Database['public']['Tables']['services']['Row'];
type NewService = Database['public']['Tables']['services']['Insert'];

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<NewUser>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const createUserProfile = async (profile: NewUser) => {
  const { data, error } = await supabase
    .from('users')
    .insert(profile)
    .select()
    .single();
  return { data, error };
};

// Pet functions
export const getUserPets = async (userId: string) => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createPet = async (pet: NewPet) => {
  const { data, error } = await supabase
    .from('pets')
    .insert(pet)
    .select()
    .single();
  return { data, error };
};

export const updatePet = async (petId: string, updates: Partial<NewPet>) => {
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', petId)
    .select()
    .single();
  return { data, error };
};

export const deletePet = async (petId: string) => {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId);
  return { error };
};

// Community posts functions
export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(full_name, avatar)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createPost = async (post: NewPost) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();
  return { data, error };
};

export const likePost = async (postId: string, userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .insert({ post_id: postId, user_id: userId })
    .select()
    .single();
  return { data, error };
};

export const unlikePost = async (postId: string, userId: string) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  return { error };
};

// Services functions
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      provider:users(full_name, avatar, phone_number)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createService = async (service: NewService) => {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();
  return { data, error };
};

export const getUserServices = async (userId: string) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('provider_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Medical records functions
export const getPetMedicalRecords = async (petId: string) => {
  const { data, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      vet:users(full_name)
    `)
    .eq('pet_id', petId)
    .order('date', { ascending: false });
  return { data, error };
};

export const createMedicalRecord = async (record: Database['public']['Tables']['medical_records']['Insert']) => {
  const { data, error } = await supabase
    .from('medical_records')
    .insert(record)
    .select()
    .single();
  return { data, error };
};

// Vaccinations functions
export const getPetVaccinations = async (petId: string) => {
  const { data, error } = await supabase
    .from('vaccinations')
    .select(`
      *,
      vet:users(full_name)
    `)
    .eq('pet_id', petId)
    .order('date', { ascending: false });
  return { data, error };
};

export const createVaccination = async (vaccination: Database['public']['Tables']['vaccinations']['Insert']) => {
  const { data, error } = await supabase
    .from('vaccinations')
    .insert(vaccination)
    .select()
    .single();
  return { data, error };
};
