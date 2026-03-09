export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          author_id: string | null
          category_id: string | null
          content_ar: string
          content_en: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          featured_image: string | null
          id: string
          is_premium: boolean
          published_at: string | null
          status: Database["public"]["Enums"]["article_status"]
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content_ar: string
          content_en: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          is_premium?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["article_status"]
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content_ar?: string
          content_en?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          is_premium?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["article_status"]
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          name_ar: string
          name_en: string
          slug: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          name_ar: string
          name_en: string
          slug: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
        }
        Relationships: []
      }
      market_indicators: {
        Row: {
          company_name: string | null
          country: string
          created_at: string
          day_1_revenue: number | null
          day_10_revenue: number | null
          day_11_revenue: number | null
          day_12_revenue: number | null
          day_13_revenue: number | null
          day_14_revenue: number | null
          day_15_revenue: number | null
          day_16_revenue: number | null
          day_17_revenue: number | null
          day_18_revenue: number | null
          day_19_revenue: number | null
          day_2_revenue: number | null
          day_20_revenue: number | null
          day_21_revenue: number | null
          day_22_revenue: number | null
          day_23_revenue: number | null
          day_24_revenue: number | null
          day_25_revenue: number | null
          day_26_revenue: number | null
          day_27_revenue: number | null
          day_28_revenue: number | null
          day_29_revenue: number | null
          day_3_revenue: number | null
          day_30_revenue: number | null
          day_31_revenue: number | null
          day_4_revenue: number | null
          day_5_revenue: number | null
          day_6_revenue: number | null
          day_7_revenue: number | null
          day_8_revenue: number | null
          day_9_revenue: number | null
          id: string
          main_sector: string
          market_share_percentage: number | null
          month: number
          quarter: string | null
          quarterly_revenue: number | null
          store_products: number
          sub_sector: string | null
          total_revenue: number
          total_sales: number
          updated_at: string
          year: number
        }
        Insert: {
          company_name?: string | null
          country: string
          created_at?: string
          day_1_revenue?: number | null
          day_10_revenue?: number | null
          day_11_revenue?: number | null
          day_12_revenue?: number | null
          day_13_revenue?: number | null
          day_14_revenue?: number | null
          day_15_revenue?: number | null
          day_16_revenue?: number | null
          day_17_revenue?: number | null
          day_18_revenue?: number | null
          day_19_revenue?: number | null
          day_2_revenue?: number | null
          day_20_revenue?: number | null
          day_21_revenue?: number | null
          day_22_revenue?: number | null
          day_23_revenue?: number | null
          day_24_revenue?: number | null
          day_25_revenue?: number | null
          day_26_revenue?: number | null
          day_27_revenue?: number | null
          day_28_revenue?: number | null
          day_29_revenue?: number | null
          day_3_revenue?: number | null
          day_30_revenue?: number | null
          day_31_revenue?: number | null
          day_4_revenue?: number | null
          day_5_revenue?: number | null
          day_6_revenue?: number | null
          day_7_revenue?: number | null
          day_8_revenue?: number | null
          day_9_revenue?: number | null
          id?: string
          main_sector: string
          market_share_percentage?: number | null
          month: number
          quarter?: string | null
          quarterly_revenue?: number | null
          store_products?: number
          sub_sector?: string | null
          total_revenue?: number
          total_sales?: number
          updated_at?: string
          year: number
        }
        Update: {
          company_name?: string | null
          country?: string
          created_at?: string
          day_1_revenue?: number | null
          day_10_revenue?: number | null
          day_11_revenue?: number | null
          day_12_revenue?: number | null
          day_13_revenue?: number | null
          day_14_revenue?: number | null
          day_15_revenue?: number | null
          day_16_revenue?: number | null
          day_17_revenue?: number | null
          day_18_revenue?: number | null
          day_19_revenue?: number | null
          day_2_revenue?: number | null
          day_20_revenue?: number | null
          day_21_revenue?: number | null
          day_22_revenue?: number | null
          day_23_revenue?: number | null
          day_24_revenue?: number | null
          day_25_revenue?: number | null
          day_26_revenue?: number | null
          day_27_revenue?: number | null
          day_28_revenue?: number | null
          day_29_revenue?: number | null
          day_3_revenue?: number | null
          day_30_revenue?: number | null
          day_31_revenue?: number | null
          day_4_revenue?: number | null
          day_5_revenue?: number | null
          day_6_revenue?: number | null
          day_7_revenue?: number | null
          day_8_revenue?: number | null
          day_9_revenue?: number | null
          id?: string
          main_sector?: string
          market_share_percentage?: number | null
          month?: number
          quarter?: string | null
          quarterly_revenue?: number | null
          store_products?: number
          sub_sector?: string | null
          total_revenue?: number
          total_sales?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_id: string | null
          payment_provider: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          daily_articles_read: number
          full_name: string
          has_qiraa_mind: boolean
          last_reset_date: string
          monthly_articles_read: number
          qiraa_mind_tokens: number
          subscription_end_date: string | null
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          subscription_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_articles_read?: number
          full_name: string
          has_qiraa_mind?: boolean
          last_reset_date?: string
          monthly_articles_read?: number
          qiraa_mind_tokens?: number
          subscription_end_date?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_articles_read?: number
          full_name?: string
          has_qiraa_mind?: boolean
          last_reset_date?: string
          monthly_articles_read?: number
          qiraa_mind_tokens?: number
          subscription_end_date?: string | null
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          subscription_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qiraa_mind_documents: {
        Row: {
          content: string
          created_at: string
          document_type: string | null
          file_path: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          source_month: string | null
          source_year: number | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          content: string
          created_at?: string
          document_type?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          source_month?: string | null
          source_year?: number | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          document_type?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          source_month?: string | null
          source_year?: number | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      qiraa_mind_history: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          category_id: string | null
          cover_image: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          download_count: number
          file_url: string | null
          id: string
          price: number
          required_plan: Database["public"]["Enums"]["subscription_plan"]
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          download_count?: number
          file_url?: string | null
          id?: string
          price?: number
          required_plan?: Database["public"]["Enums"]["subscription_plan"]
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          download_count?: number
          file_url?: string | null
          id?: string
          price?: number
          required_plan?: Database["public"]["Enums"]["subscription_plan"]
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          analytic_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          analytic_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          analytic_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_articles_article_id_fkey"
            columns: ["analytic_id"]
            isOneToOne: false
            referencedRelation: "analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          downloaded_at: string
          id: string
          report_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          report_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      article_status: "draft" | "published" | "archived"
      content_type: "article" | "report" | "brief"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_plan: "free" | "basic" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      article_status: ["draft", "published", "archived"],
      content_type: ["article", "report", "brief"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_plan: ["free", "basic", "pro", "enterprise"],
    },
  },
} as const
