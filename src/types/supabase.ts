
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: 'owner' | 'giver'
          profile_image: string | null
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          role: 'owner' | 'giver'
          profile_image?: string | null
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: 'owner' | 'giver'
          profile_image?: string | null
          is_verified?: boolean
          created_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          owner_id: string
          name: string
          age: number | null
          species: 'dog' | 'cat'
          gender: string | null
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          age?: number | null
          species: 'dog' | 'cat'
          gender?: string | null
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          age?: number | null
          species?: 'dog' | 'cat'
          gender?: string | null
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          pet_id: string
          owner_id: string
          service_type: 'walk' | 'grooming' | 'boarding' | 'training'
          location: string | null
          date: string | null
          time_from: string | null
          time_to: string | null
          duration: number | null
          status: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          owner_id: string
          service_type: 'walk' | 'grooming' | 'boarding' | 'training'
          location?: string | null
          date?: string | null
          time_from?: string | null
          time_to?: string | null
          duration?: number | null
          status?: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          owner_id?: string
          service_type?: 'walk' | 'grooming' | 'boarding' | 'training'
          location?: string | null
          date?: string | null
          time_from?: string | null
          time_to?: string | null
          duration?: number | null
          status?: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      service_offers: {
        Row: {
          id: string
          request_id: string
          giver_id: string
          message: string | null
          price_ils: number
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          giver_id: string
          message?: string | null
          price_ils: number
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          giver_id?: string
          message?: string | null
          price_ils?: number
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          offer_id: string
          request_id: string
          start_time: string | null
          end_time: string | null
          location_url: string | null
          photo_url: string | null
          status: 'in_progress' | 'completed' | 'cancelled'
          rating: number | null
          tip_ils: number | null
          created_at: string
        }
        Insert: {
          id?: string
          offer_id: string
          request_id: string
          start_time?: string | null
          end_time?: string | null
          location_url?: string | null
          photo_url?: string | null
          status?: 'in_progress' | 'completed' | 'cancelled'
          rating?: number | null
          tip_ils?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          offer_id?: string
          request_id?: string
          start_time?: string | null
          end_time?: string | null
          location_url?: string | null
          photo_url?: string | null
          status?: 'in_progress' | 'completed' | 'cancelled'
          rating?: number | null
          tip_ils?: number | null
          created_at?: string
        }
      }
      verifications: {
        Row: {
          id: string
          user_id: string
          selfie_url: string | null
          id_image_url: string | null
          verified_by: string | null
          verified_at: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          selfie_url?: string | null
          id_image_url?: string | null
          verified_by?: string | null
          verified_at?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          selfie_url?: string | null
          id_image_url?: string | null
          verified_by?: string | null
          verified_at?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}

<lov-add-dependency>@supabase/supabase-js@latest</lov-add-dependency>
