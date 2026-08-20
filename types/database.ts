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
        Relationships: []
      }
      game_stats: {
        Row: {
          user_id: string
          puzzles_solved: number
          games_played: number
          win_rate: number
          flawless_streak: number
          highest_streak: number
          daily_streak: number
          last_played_date: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          puzzles_solved?: number
          games_played?: number
          win_rate?: number
          flawless_streak?: number
          highest_streak?: number
          daily_streak?: number
          last_played_date?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          puzzles_solved?: number
          games_played?: number
          win_rate?: number
          flawless_streak?: number
          highest_streak?: number
          daily_streak?: number
          last_played_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      levels: {
        Row: {
          level_number: number
          board_data: Json
          created_at: string
        }
        Insert: {
          level_number: number
          board_data: Json
          created_at?: string
        }
        Update: {
          level_number?: number
          board_data?: Json
          created_at?: string
        }
        Relationships: []
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
