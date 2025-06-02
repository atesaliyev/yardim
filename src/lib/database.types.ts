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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      guides: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          category_id: string
          author_id: string
          status: 'draft' | 'published'
          views: number
          rating: number
          created_at: string
          updated_at: string
          meta_description: string | null
          meta_keywords: string | null
          overview: string | null
          steps: Json | null
          important_notes: string | null
          faq: Json | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          category_id: string
          author_id: string
          status?: 'draft' | 'published'
          views?: number
          rating?: number
          created_at?: string
          updated_at?: string
          meta_description?: string | null
          meta_keywords?: string | null
          overview?: string | null
          steps?: Json | null
          important_notes?: string | null
          faq?: Json | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          category_id?: string
          author_id?: string
          status?: 'draft' | 'published'
          views?: number
          rating?: number
          created_at?: string
          updated_at?: string
          meta_description?: string | null
          meta_keywords?: string | null
          overview?: string | null
          steps?: Json | null
          important_notes?: string | null
          faq?: Json | null
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
  }
}