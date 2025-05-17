export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      pets: {
        Row: {
          age: number | null
          created_at: string | null
          description: string | null
          gender: string | null
          id: string
          image_url: string | null
          name: string
          owner_id: string
          species: Database["public"]["Enums"]["pet_species"]
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          name: string
          owner_id: string
          species: Database["public"]["Enums"]["pet_species"]
        }
        Update: {
          age?: number | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string
          species?: Database["public"]["Enums"]["pet_species"]
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_offers: {
        Row: {
          created_at: string | null
          giver_id: string
          id: string
          message: string | null
          price_ils: number
          request_id: string
          status: Database["public"]["Enums"]["offer_status"] | null
        }
        Insert: {
          created_at?: string | null
          giver_id: string
          id?: string
          message?: string | null
          price_ils: number
          request_id: string
          status?: Database["public"]["Enums"]["offer_status"] | null
        }
        Update: {
          created_at?: string | null
          giver_id?: string
          id?: string
          message?: string | null
          price_ils?: number
          request_id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "service_offers_giver_id_fkey"
            columns: ["giver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string | null
          date: string | null
          duration: number | null
          id: string
          location: string | null
          owner_id: string
          pet_id: string
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["request_status"] | null
          time_from: string | null
          time_to: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          duration?: number | null
          id?: string
          location?: string | null
          owner_id: string
          pet_id: string
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["request_status"] | null
          time_from?: string | null
          time_to?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          duration?: number | null
          id?: string
          location?: string | null
          owner_id?: string
          pet_id?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["request_status"] | null
          time_from?: string | null
          time_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          location_url: string | null
          offer_id: string
          photo_url: string | null
          rating: number | null
          request_id: string
          start_time: string | null
          status: Database["public"]["Enums"]["service_status"] | null
          tip_ils: number | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          location_url?: string | null
          offer_id: string
          photo_url?: string | null
          rating?: number | null
          request_id: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          tip_ils?: number | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          location_url?: string | null
          offer_id?: string
          photo_url?: string | null
          rating?: number | null
          request_id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          tip_ils?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "service_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          phone?: string | null
          profile_image?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string | null
          id: string
          id_image_url: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_image_url?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_image_url?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      offer_status: "pending" | "accepted" | "rejected"
      pet_species: "dog" | "cat"
      request_status:
        | "open"
        | "matched"
        | "in_progress"
        | "completed"
        | "cancelled"
      service_status: "in_progress" | "completed" | "cancelled"
      service_type: "walk" | "grooming" | "boarding" | "training"
      user_role: "owner" | "giver"
      verification_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      offer_status: ["pending", "accepted", "rejected"],
      pet_species: ["dog", "cat"],
      request_status: [
        "open",
        "matched",
        "in_progress",
        "completed",
        "cancelled",
      ],
      service_status: ["in_progress", "completed", "cancelled"],
      service_type: ["walk", "grooming", "boarding", "training"],
      user_role: ["owner", "giver"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
