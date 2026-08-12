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
      profiles: {
        Row: {
          id: string
          display_name: string | null
          highest_level: number
          highest_streak: number
          is_muted: boolean
          volume_multiplier: number
        }
        Insert: {
          id: string
          display_name?: string | null
          highest_level?: number
          highest_streak?: number
          is_muted?: boolean
          volume_multiplier?: number
        }
        Update: {
          id?: string
          display_name?: string | null
          highest_level?: number
          highest_streak?: number
          is_muted?: boolean
          volume_multiplier?: number
        }
      }
      game_stats: {
        Row: {
          user_id: string
          puzzles_solved: number
          win_rate: number
          current_streak: number
          highest_streak: number
          updated_at: string
        }
        Insert: {
          user_id: string
          puzzles_solved?: number
          win_rate?: number
          current_streak?: number
          highest_streak?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          puzzles_solved?: number
          win_rate?: number
          current_streak?: number
          highest_streak?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
