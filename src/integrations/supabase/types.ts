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
          Beneficiary_countries: Json | null
          category_id: string | null
          ciq_id: string | null
          companies_mentioned: Json | null
          content_ar: string
          content_en: string
          content_type: Database["public"]["Enums"]["content_type"]
          country: string | null
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          featured_image: string | null
          id: string
          investment_signal: boolean | null
          is_premium: boolean
          market_gap_report: string | null
          market_gap_status: string | null
          news_published_at: string | null
          published_at: string | null
          raw_news_text: string | null
          source_type: string | null
          source_url: string | null
          sp_ciq_ids_used: string | null
          sp_company_name: string | null
          sp_company_valuation: number | null
          sp_employees: number | null
          sp_enriched: boolean | null
          sp_macro_context: Json | null
          sp_sector: string | null
          sp_total_funding: number | null
          sp_validation_flag: string | null
          startup_stages: Json | null
          status: Database["public"]["Enums"]["article_status"]
          steps_ar: Json | null
          steps_en: Json | null
          subcategory_id: string | null
          title_ar: string
          title_en: string
          updated_at: string
          urgency_level: string | null
        }
        Insert: {
          author_id?: string | null
          Beneficiary_countries?: Json | null
          category_id?: string | null
          ciq_id?: string | null
          companies_mentioned?: Json | null
          content_ar: string
          content_en: string
          content_type?: Database["public"]["Enums"]["content_type"]
          country?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          investment_signal?: boolean | null
          is_premium?: boolean
          market_gap_report?: string | null
          market_gap_status?: string | null
          news_published_at?: string | null
          published_at?: string | null
          raw_news_text?: string | null
          source_type?: string | null
          source_url?: string | null
          sp_ciq_ids_used?: string | null
          sp_company_name?: string | null
          sp_company_valuation?: number | null
          sp_employees?: number | null
          sp_enriched?: boolean | null
          sp_macro_context?: Json | null
          sp_sector?: string | null
          sp_total_funding?: number | null
          sp_validation_flag?: string | null
          startup_stages?: Json | null
          status?: Database["public"]["Enums"]["article_status"]
          steps_ar?: Json | null
          steps_en?: Json | null
          subcategory_id?: string | null
          title_ar: string
          title_en: string
          updated_at?: string
          urgency_level?: string | null
        }
        Update: {
          author_id?: string | null
          Beneficiary_countries?: Json | null
          category_id?: string | null
          ciq_id?: string | null
          companies_mentioned?: Json | null
          content_ar?: string
          content_en?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          country?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image?: string | null
          id?: string
          investment_signal?: boolean | null
          is_premium?: boolean
          market_gap_report?: string | null
          market_gap_status?: string | null
          news_published_at?: string | null
          published_at?: string | null
          raw_news_text?: string | null
          source_type?: string | null
          source_url?: string | null
          sp_ciq_ids_used?: string | null
          sp_company_name?: string | null
          sp_company_valuation?: number | null
          sp_employees?: number | null
          sp_enriched?: boolean | null
          sp_macro_context?: Json | null
          sp_sector?: string | null
          sp_total_funding?: number | null
          sp_validation_flag?: string | null
          startup_stages?: Json | null
          status?: Database["public"]["Enums"]["article_status"]
          steps_ar?: Json | null
          steps_en?: Json | null
          subcategory_id?: string | null
          title_ar?: string
          title_en?: string
          updated_at?: string
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["subcategory_id"]
          },
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
          day_1_sales: number | null
          day_10_revenue: number | null
          day_10_sales: number | null
          day_11_revenue: number | null
          day_11_sales: number | null
          day_12_revenue: number | null
          day_12_sales: number | null
          day_13_revenue: number | null
          day_13_sales: number | null
          day_14_revenue: number | null
          day_14_sales: number | null
          day_15_revenue: number | null
          day_15_sales: number | null
          day_16_revenue: number | null
          day_16_sales: number | null
          day_17_revenue: number | null
          day_17_sales: number | null
          day_18_revenue: number | null
          day_18_sales: number | null
          day_19_revenue: number | null
          day_19_sales: number | null
          day_2_revenue: number | null
          day_2_sales: number | null
          day_20_revenue: number | null
          day_20_sales: number | null
          day_21_revenue: number | null
          day_21_sales: number | null
          day_22_revenue: number | null
          day_22_sales: number | null
          day_23_revenue: number | null
          day_23_sales: number | null
          day_24_revenue: number | null
          day_24_sales: number | null
          day_25_revenue: number | null
          day_25_sales: number | null
          day_26_revenue: number | null
          day_26_sales: number | null
          day_27_revenue: number | null
          day_27_sales: number | null
          day_28_revenue: number | null
          day_28_sales: number | null
          day_29_revenue: number | null
          day_29_sales: number | null
          day_3_revenue: number | null
          day_3_sales: number | null
          day_30_revenue: number | null
          day_30_sales: number | null
          day_31_revenue: number | null
          day_31_sales: number | null
          day_4_revenue: number | null
          day_4_sales: number | null
          day_5_revenue: number | null
          day_5_sales: number | null
          day_6_revenue: number | null
          day_6_sales: number | null
          day_7_revenue: number | null
          day_7_sales: number | null
          day_8_revenue: number | null
          day_8_sales: number | null
          day_9_revenue: number | null
          day_9_sales: number | null
          id: string
          main_sector: string
          market_share_percentage: number | null
          month: number
          quarter: string | null
          quarterly_revenue: number | null
          quarterly_sales: number | null
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
          day_1_sales?: number | null
          day_10_revenue?: number | null
          day_10_sales?: number | null
          day_11_revenue?: number | null
          day_11_sales?: number | null
          day_12_revenue?: number | null
          day_12_sales?: number | null
          day_13_revenue?: number | null
          day_13_sales?: number | null
          day_14_revenue?: number | null
          day_14_sales?: number | null
          day_15_revenue?: number | null
          day_15_sales?: number | null
          day_16_revenue?: number | null
          day_16_sales?: number | null
          day_17_revenue?: number | null
          day_17_sales?: number | null
          day_18_revenue?: number | null
          day_18_sales?: number | null
          day_19_revenue?: number | null
          day_19_sales?: number | null
          day_2_revenue?: number | null
          day_2_sales?: number | null
          day_20_revenue?: number | null
          day_20_sales?: number | null
          day_21_revenue?: number | null
          day_21_sales?: number | null
          day_22_revenue?: number | null
          day_22_sales?: number | null
          day_23_revenue?: number | null
          day_23_sales?: number | null
          day_24_revenue?: number | null
          day_24_sales?: number | null
          day_25_revenue?: number | null
          day_25_sales?: number | null
          day_26_revenue?: number | null
          day_26_sales?: number | null
          day_27_revenue?: number | null
          day_27_sales?: number | null
          day_28_revenue?: number | null
          day_28_sales?: number | null
          day_29_revenue?: number | null
          day_29_sales?: number | null
          day_3_revenue?: number | null
          day_3_sales?: number | null
          day_30_revenue?: number | null
          day_30_sales?: number | null
          day_31_revenue?: number | null
          day_31_sales?: number | null
          day_4_revenue?: number | null
          day_4_sales?: number | null
          day_5_revenue?: number | null
          day_5_sales?: number | null
          day_6_revenue?: number | null
          day_6_sales?: number | null
          day_7_revenue?: number | null
          day_7_sales?: number | null
          day_8_revenue?: number | null
          day_8_sales?: number | null
          day_9_revenue?: number | null
          day_9_sales?: number | null
          id?: string
          main_sector: string
          market_share_percentage?: number | null
          month: number
          quarter?: string | null
          quarterly_revenue?: number | null
          quarterly_sales?: number | null
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
          day_1_sales?: number | null
          day_10_revenue?: number | null
          day_10_sales?: number | null
          day_11_revenue?: number | null
          day_11_sales?: number | null
          day_12_revenue?: number | null
          day_12_sales?: number | null
          day_13_revenue?: number | null
          day_13_sales?: number | null
          day_14_revenue?: number | null
          day_14_sales?: number | null
          day_15_revenue?: number | null
          day_15_sales?: number | null
          day_16_revenue?: number | null
          day_16_sales?: number | null
          day_17_revenue?: number | null
          day_17_sales?: number | null
          day_18_revenue?: number | null
          day_18_sales?: number | null
          day_19_revenue?: number | null
          day_19_sales?: number | null
          day_2_revenue?: number | null
          day_2_sales?: number | null
          day_20_revenue?: number | null
          day_20_sales?: number | null
          day_21_revenue?: number | null
          day_21_sales?: number | null
          day_22_revenue?: number | null
          day_22_sales?: number | null
          day_23_revenue?: number | null
          day_23_sales?: number | null
          day_24_revenue?: number | null
          day_24_sales?: number | null
          day_25_revenue?: number | null
          day_25_sales?: number | null
          day_26_revenue?: number | null
          day_26_sales?: number | null
          day_27_revenue?: number | null
          day_27_sales?: number | null
          day_28_revenue?: number | null
          day_28_sales?: number | null
          day_29_revenue?: number | null
          day_29_sales?: number | null
          day_3_revenue?: number | null
          day_3_sales?: number | null
          day_30_revenue?: number | null
          day_30_sales?: number | null
          day_31_revenue?: number | null
          day_31_sales?: number | null
          day_4_revenue?: number | null
          day_4_sales?: number | null
          day_5_revenue?: number | null
          day_5_sales?: number | null
          day_6_revenue?: number | null
          day_6_sales?: number | null
          day_7_revenue?: number | null
          day_7_sales?: number | null
          day_8_revenue?: number | null
          day_8_sales?: number | null
          day_9_revenue?: number | null
          day_9_sales?: number | null
          id?: string
          main_sector?: string
          market_share_percentage?: number | null
          month?: number
          quarter?: string | null
          quarterly_revenue?: number | null
          quarterly_sales?: number | null
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
          is_annual: boolean
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
          is_annual?: boolean
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
          is_annual?: boolean
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
      qiraa_companies: {
        Row: {
          appstore_url: string | null
          city: string | null
          client_focus: string | null
          company_status: string | null
          company_type: string | null
          company_uuid: string
          country: string | null
          dealroom_path: string | null
          description: string | null
          employees_latest: number | null
          employees_range: string | null
          founders: string | null
          founders_top_past_companies: string | null
          founders_top_university: string | null
          growth_stage: string | null
          has_ai_data: boolean | null
          has_super_founder: boolean | null
          hq_address: string | null
          income_streams: string | null
          innovations_count: number | null
          investors_list: string | null
          is_editorial: boolean | null
          is_verified: boolean | null
          launch_month: number | null
          launch_year: number | null
          linkedin_url: string | null
          logo_url_original: string | null
          logo_url_stored: string | null
          name: string
          patents_count: number | null
          playstore_url: string | null
          sector_main: string | null
          sectors_sub: string | null
          startup_ranking_rating: number | null
          synced_at: string | null
          tags: string | null
          technologies: string | null
          total_funding_usd: number | null
          total_jobs_available: number | null
          twitter_url: string | null
          valuation_max_usd: number | null
          valuation_min_usd: number | null
          valuation_source_round: string | null
          web_visits_12m_growth: string | null
          web_visits_latest: number | null
          year_became_unicorn: number | null
        }
        Insert: {
          appstore_url?: string | null
          city?: string | null
          client_focus?: string | null
          company_status?: string | null
          company_type?: string | null
          company_uuid: string
          country?: string | null
          dealroom_path?: string | null
          description?: string | null
          employees_latest?: number | null
          employees_range?: string | null
          founders?: string | null
          founders_top_past_companies?: string | null
          founders_top_university?: string | null
          growth_stage?: string | null
          has_ai_data?: boolean | null
          has_super_founder?: boolean | null
          hq_address?: string | null
          income_streams?: string | null
          innovations_count?: number | null
          investors_list?: string | null
          is_editorial?: boolean | null
          is_verified?: boolean | null
          launch_month?: number | null
          launch_year?: number | null
          linkedin_url?: string | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          name: string
          patents_count?: number | null
          playstore_url?: string | null
          sector_main?: string | null
          sectors_sub?: string | null
          startup_ranking_rating?: number | null
          synced_at?: string | null
          tags?: string | null
          technologies?: string | null
          total_funding_usd?: number | null
          total_jobs_available?: number | null
          twitter_url?: string | null
          valuation_max_usd?: number | null
          valuation_min_usd?: number | null
          valuation_source_round?: string | null
          web_visits_12m_growth?: string | null
          web_visits_latest?: number | null
          year_became_unicorn?: number | null
        }
        Update: {
          appstore_url?: string | null
          city?: string | null
          client_focus?: string | null
          company_status?: string | null
          company_type?: string | null
          company_uuid?: string
          country?: string | null
          dealroom_path?: string | null
          description?: string | null
          employees_latest?: number | null
          employees_range?: string | null
          founders?: string | null
          founders_top_past_companies?: string | null
          founders_top_university?: string | null
          growth_stage?: string | null
          has_ai_data?: boolean | null
          has_super_founder?: boolean | null
          hq_address?: string | null
          income_streams?: string | null
          innovations_count?: number | null
          investors_list?: string | null
          is_editorial?: boolean | null
          is_verified?: boolean | null
          launch_month?: number | null
          launch_year?: number | null
          linkedin_url?: string | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          name?: string
          patents_count?: number | null
          playstore_url?: string | null
          sector_main?: string | null
          sectors_sub?: string | null
          startup_ranking_rating?: number | null
          synced_at?: string | null
          tags?: string | null
          technologies?: string | null
          total_funding_usd?: number | null
          total_jobs_available?: number | null
          twitter_url?: string | null
          valuation_max_usd?: number | null
          valuation_min_usd?: number | null
          valuation_source_round?: string | null
          web_visits_12m_growth?: string | null
          web_visits_latest?: number | null
          year_became_unicorn?: number | null
        }
        Relationships: []
      }
      qiraa_companies_headcount: {
        Row: {
          company_uuid: string
          employee_count: number | null
          id: number
          record_date: string
        }
        Insert: {
          company_uuid: string
          employee_count?: number | null
          id?: number
          record_date: string
        }
        Update: {
          company_uuid?: string
          employee_count?: number | null
          id?: number
          record_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_companies_headcount_company_uuid_fkey"
            columns: ["company_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_companies"
            referencedColumns: ["company_uuid"]
          },
        ]
      }
      qiraa_companies_traffic: {
        Row: {
          company_uuid: string
          id: number
          record_date: string
          visits_count: number | null
        }
        Insert: {
          company_uuid: string
          id?: number
          record_date: string
          visits_count?: number | null
        }
        Update: {
          company_uuid?: string
          id?: number
          record_date?: string
          visits_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_companies_traffic_company_uuid_fkey"
            columns: ["company_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_companies"
            referencedColumns: ["company_uuid"]
          },
        ]
      }
      qiraa_companies_valuations: {
        Row: {
          company_uuid: string
          id: number
          source_round: string
          valuation_max_usd: number | null
          valuation_min_usd: number | null
          valuation_month: number
          valuation_usd: number | null
          valuation_year: number
        }
        Insert: {
          company_uuid: string
          id?: number
          source_round: string
          valuation_max_usd?: number | null
          valuation_min_usd?: number | null
          valuation_month: number
          valuation_usd?: number | null
          valuation_year: number
        }
        Update: {
          company_uuid?: string
          id?: number
          source_round?: string
          valuation_max_usd?: number | null
          valuation_min_usd?: number | null
          valuation_month?: number
          valuation_usd?: number | null
          valuation_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_companies_valuations_company_uuid_fkey"
            columns: ["company_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_companies"
            referencedColumns: ["company_uuid"]
          },
        ]
      }
      qiraa_company_founders: {
        Row: {
          company_uuid: string
          founder_name: string | null
          founder_path: string | null
          founder_uuid: string
          id: number
          logo_url: string | null
        }
        Insert: {
          company_uuid: string
          founder_name?: string | null
          founder_path?: string | null
          founder_uuid: string
          id?: number
          logo_url?: string | null
        }
        Update: {
          company_uuid?: string
          founder_name?: string | null
          founder_path?: string | null
          founder_uuid?: string
          id?: number
          logo_url?: string | null
        }
        Relationships: []
      }
      qiraa_company_investors: {
        Row: {
          company_uuid: string
          entity_type: string | null
          has_exited: boolean | null
          id: number
          investor_name: string | null
          investor_path: string | null
          investor_type: string | null
          investor_uuid: string
          is_lead: boolean | null
          logo_url: string | null
        }
        Insert: {
          company_uuid: string
          entity_type?: string | null
          has_exited?: boolean | null
          id?: number
          investor_name?: string | null
          investor_path?: string | null
          investor_type?: string | null
          investor_uuid: string
          is_lead?: boolean | null
          logo_url?: string | null
        }
        Update: {
          company_uuid?: string
          entity_type?: string | null
          has_exited?: boolean | null
          id?: number
          investor_name?: string | null
          investor_path?: string | null
          investor_type?: string | null
          investor_uuid?: string
          is_lead?: boolean | null
          logo_url?: string | null
        }
        Relationships: []
      }
      qiraa_inv_org_lps: {
        Row: {
          id: number
          logo_url: string | null
          lp_name: string | null
          lp_path: string | null
          lp_type: string | null
          lp_uuid: string | null
          org_uuid: string
        }
        Insert: {
          id?: number
          logo_url?: string | null
          lp_name?: string | null
          lp_path?: string | null
          lp_type?: string | null
          lp_uuid?: string | null
          org_uuid: string
        }
        Update: {
          id?: number
          logo_url?: string | null
          lp_name?: string | null
          lp_path?: string | null
          lp_type?: string | null
          lp_uuid?: string | null
          org_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_inv_org_lps_org_uuid_fkey"
            columns: ["org_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_inv_organizations"
            referencedColumns: ["org_uuid"]
          },
        ]
      }
      qiraa_inv_org_portfolio: {
        Row: {
          company_name: string | null
          company_path: string | null
          company_type: string | null
          company_uuid: string | null
          has_exited: boolean | null
          id: number
          is_lead: boolean | null
          logo_url: string | null
          org_uuid: string
        }
        Insert: {
          company_name?: string | null
          company_path?: string | null
          company_type?: string | null
          company_uuid?: string | null
          has_exited?: boolean | null
          id?: number
          is_lead?: boolean | null
          logo_url?: string | null
          org_uuid: string
        }
        Update: {
          company_name?: string | null
          company_path?: string | null
          company_type?: string | null
          company_uuid?: string | null
          has_exited?: boolean | null
          id?: number
          is_lead?: boolean | null
          logo_url?: string | null
          org_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_inv_org_portfolio_org_uuid_fkey"
            columns: ["org_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_inv_organizations"
            referencedColumns: ["org_uuid"]
          },
        ]
      }
      qiraa_inv_organizations: {
        Row: {
          city: string | null
          country: string | null
          deal_size_max_usd: number | null
          deal_size_min_usd: number | null
          dealroom_path: string | null
          entity_sub_types: string | null
          fundings_12m_usd: number | null
          fundings_24m_usd: number | null
          investments_num: number | null
          investments_total_usd: number | null
          investor_exit_score: string | null
          investor_exits_funding_usd: number | null
          investor_exits_num: number | null
          investor_total_funding_usd: number | null
          is_founder: boolean | null
          logo_url_original: string | null
          logo_url_stored: string | null
          name: string
          org_type: string | null
          org_uuid: string
          preferred_round: string | null
          synced_at: string | null
          tagline: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          deal_size_max_usd?: number | null
          deal_size_min_usd?: number | null
          dealroom_path?: string | null
          entity_sub_types?: string | null
          fundings_12m_usd?: number | null
          fundings_24m_usd?: number | null
          investments_num?: number | null
          investments_total_usd?: number | null
          investor_exit_score?: string | null
          investor_exits_funding_usd?: number | null
          investor_exits_num?: number | null
          investor_total_funding_usd?: number | null
          is_founder?: boolean | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          name: string
          org_type?: string | null
          org_uuid: string
          preferred_round?: string | null
          synced_at?: string | null
          tagline?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          deal_size_max_usd?: number | null
          deal_size_min_usd?: number | null
          dealroom_path?: string | null
          entity_sub_types?: string | null
          fundings_12m_usd?: number | null
          fundings_24m_usd?: number | null
          investments_num?: number | null
          investments_total_usd?: number | null
          investor_exit_score?: string | null
          investor_exits_funding_usd?: number | null
          investor_exits_num?: number | null
          investor_total_funding_usd?: number | null
          is_founder?: boolean | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          name?: string
          org_type?: string | null
          org_uuid?: string
          preferred_round?: string | null
          synced_at?: string | null
          tagline?: string | null
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
      qiraa_people: {
        Row: {
          city: string | null
          country: string | null
          dealroom_path: string | null
          founded_companies_total_funding_usd: number | null
          founder_score: number | null
          has_super_founder: boolean | null
          investor_exits_num: number | null
          investor_total_funding_usd: number | null
          last_founded_company_year: number | null
          linkedin_url: string | null
          logo_url_original: string | null
          logo_url_stored: string | null
          name: string
          people_rating: number | null
          person_type: string | null
          person_uuid: string
          synced_at: string | null
          tagline: string | null
          top_university: string | null
          top_university_degree: string | null
          twitter_url: string | null
          website_url: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          dealroom_path?: string | null
          founded_companies_total_funding_usd?: number | null
          founder_score?: number | null
          has_super_founder?: boolean | null
          investor_exits_num?: number | null
          investor_total_funding_usd?: number | null
          last_founded_company_year?: number | null
          linkedin_url?: string | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          name: string
          people_rating?: number | null
          person_type?: string | null
          person_uuid: string
          synced_at?: string | null
          tagline?: string | null
          top_university?: string | null
          top_university_degree?: string | null
          twitter_url?: string | null
          website_url?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          dealroom_path?: string | null
          founded_companies_total_funding_usd?: number | null
          founder_score?: number | null
          has_super_founder?: boolean | null
          investor_exits_num?: number | null
          investor_total_funding_usd?: number | null
          last_founded_company_year?: number | null
          linkedin_url?: string | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          name?: string
          people_rating?: number | null
          person_type?: string | null
          person_uuid?: string
          synced_at?: string | null
          tagline?: string | null
          top_university?: string | null
          top_university_degree?: string | null
          twitter_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      qiraa_people_career: {
        Row: {
          id: number
          is_executive: boolean | null
          is_founder: boolean | null
          is_partner: boolean | null
          is_past: boolean | null
          month_end: number | null
          month_start: number | null
          org_name: string | null
          org_path: string | null
          org_type: string | null
          org_uuid: string | null
          person_uuid: string
          titles: string | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          id?: number
          is_executive?: boolean | null
          is_founder?: boolean | null
          is_partner?: boolean | null
          is_past?: boolean | null
          month_end?: number | null
          month_start?: number | null
          org_name?: string | null
          org_path?: string | null
          org_type?: string | null
          org_uuid?: string | null
          person_uuid: string
          titles?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          id?: number
          is_executive?: boolean | null
          is_founder?: boolean | null
          is_partner?: boolean | null
          is_past?: boolean | null
          month_end?: number | null
          month_start?: number | null
          org_name?: string | null
          org_path?: string | null
          org_type?: string | null
          org_uuid?: string | null
          person_uuid?: string
          titles?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_people_career_person_uuid_fkey"
            columns: ["person_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_people"
            referencedColumns: ["person_uuid"]
          },
        ]
      }
      qiraa_people_education: {
        Row: {
          degree: string | null
          id: number
          major: string | null
          person_uuid: string
          university_name: string | null
          university_uuid: string | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          degree?: string | null
          id?: number
          major?: string | null
          person_uuid: string
          university_name?: string | null
          university_uuid?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          degree?: string | null
          id?: number
          major?: string | null
          person_uuid?: string
          university_name?: string | null
          university_uuid?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "qiraa_people_education_person_uuid_fkey"
            columns: ["person_uuid"]
            isOneToOne: false
            referencedRelation: "qiraa_people"
            referencedColumns: ["person_uuid"]
          },
        ]
      }
      qiraa_transactions: {
        Row: {
          acquiror_types: string | null
          acquiror_uuids: string | null
          acquirors: string | null
          city: string | null
          company_name: string | null
          company_uuid: string
          country: string | null
          dealroom_path: string | null
          description: string | null
          ev_ebitda_multiple: number | null
          ev_profit_multiple: number | null
          ev_revenue_multiple: number | null
          exit_date: string | null
          exited_investor_uuids: string | null
          exited_investors: string | null
          growth_stage: string | null
          id: number
          investor_types: string | null
          investor_uuids: string | null
          investors: string | null
          is_verified: boolean | null
          launch_year: number | null
          logo_url_original: string | null
          logo_url_stored: string | null
          news_source: string | null
          round_amount_usd: number | null
          round_currency: string | null
          round_month: number | null
          round_type: string | null
          round_year: number | null
          sector_main: string | null
          sectors_sub: string | null
          source_round: string | null
          synced_at: string | null
          tags: string | null
          total_ev: number | null
          total_funding_usd: number | null
          transaction_type: string | null
          valuation_max_usd: number | null
          valuation_min_usd: number | null
          valuation_usd: number | null
        }
        Insert: {
          acquiror_types?: string | null
          acquiror_uuids?: string | null
          acquirors?: string | null
          city?: string | null
          company_name?: string | null
          company_uuid: string
          country?: string | null
          dealroom_path?: string | null
          description?: string | null
          ev_ebitda_multiple?: number | null
          ev_profit_multiple?: number | null
          ev_revenue_multiple?: number | null
          exit_date?: string | null
          exited_investor_uuids?: string | null
          exited_investors?: string | null
          growth_stage?: string | null
          id?: number
          investor_types?: string | null
          investor_uuids?: string | null
          investors?: string | null
          is_verified?: boolean | null
          launch_year?: number | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          news_source?: string | null
          round_amount_usd?: number | null
          round_currency?: string | null
          round_month?: number | null
          round_type?: string | null
          round_year?: number | null
          sector_main?: string | null
          sectors_sub?: string | null
          source_round?: string | null
          synced_at?: string | null
          tags?: string | null
          total_ev?: number | null
          total_funding_usd?: number | null
          transaction_type?: string | null
          valuation_max_usd?: number | null
          valuation_min_usd?: number | null
          valuation_usd?: number | null
        }
        Update: {
          acquiror_types?: string | null
          acquiror_uuids?: string | null
          acquirors?: string | null
          city?: string | null
          company_name?: string | null
          company_uuid?: string
          country?: string | null
          dealroom_path?: string | null
          description?: string | null
          ev_ebitda_multiple?: number | null
          ev_profit_multiple?: number | null
          ev_revenue_multiple?: number | null
          exit_date?: string | null
          exited_investor_uuids?: string | null
          exited_investors?: string | null
          growth_stage?: string | null
          id?: number
          investor_types?: string | null
          investor_uuids?: string | null
          investors?: string | null
          is_verified?: boolean | null
          launch_year?: number | null
          logo_url_original?: string | null
          logo_url_stored?: string | null
          news_source?: string | null
          round_amount_usd?: number | null
          round_currency?: string | null
          round_month?: number | null
          round_type?: string | null
          round_year?: number | null
          sector_main?: string | null
          sectors_sub?: string | null
          source_round?: string | null
          synced_at?: string | null
          tags?: string | null
          total_ev?: number | null
          total_funding_usd?: number | null
          transaction_type?: string | null
          valuation_max_usd?: number | null
          valuation_min_usd?: number | null
          valuation_usd?: number | null
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
      sp_api_config: {
        Row: {
          config_key: string
          config_value: string
          description: string | null
          expires_at: string | null
          id: number
          is_secret: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          description?: string | null
          expires_at?: string | null
          id?: number
          is_secret?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          description?: string | null
          expires_at?: string | null
          id?: number
          is_secret?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sp_companies: {
        Row: {
          business_desc: string | null
          ciq_id: string
          city: string | null
          company_name: string
          company_status: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          dealroom_uuid: string | null
          ebitda_est_usd: number | null
          employee_growth: number | null
          employees: number | null
          founded_year: number | null
          id: number
          industry: string | null
          is_mena_entity: boolean | null
          last_valuation_usd: number | null
          match_method: string | null
          revenue_est_usd: number | null
          sector: string | null
          sp_last_synced: string | null
          sub_industry: string | null
          total_funding_usd: number | null
          updated_at: string | null
          validation_status: string | null
          website_url: string | null
        }
        Insert: {
          business_desc?: string | null
          ciq_id: string
          city?: string | null
          company_name: string
          company_status?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          dealroom_uuid?: string | null
          ebitda_est_usd?: number | null
          employee_growth?: number | null
          employees?: number | null
          founded_year?: number | null
          id?: number
          industry?: string | null
          is_mena_entity?: boolean | null
          last_valuation_usd?: number | null
          match_method?: string | null
          revenue_est_usd?: number | null
          sector?: string | null
          sp_last_synced?: string | null
          sub_industry?: string | null
          total_funding_usd?: number | null
          updated_at?: string | null
          validation_status?: string | null
          website_url?: string | null
        }
        Update: {
          business_desc?: string | null
          ciq_id?: string
          city?: string | null
          company_name?: string
          company_status?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          dealroom_uuid?: string | null
          ebitda_est_usd?: number | null
          employee_growth?: number | null
          employees?: number | null
          founded_year?: number | null
          id?: number
          industry?: string | null
          is_mena_entity?: boolean | null
          last_valuation_usd?: number | null
          match_method?: string | null
          revenue_est_usd?: number | null
          sector?: string | null
          sp_last_synced?: string | null
          sub_industry?: string | null
          total_funding_usd?: number | null
          updated_at?: string | null
          validation_status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sp_headcount: {
        Row: {
          ciq_id: string
          company_name: string | null
          employees: number | null
          fetched_at: string | null
          growth_pct: number | null
          id: number
          raw_json: Json | null
          record_month: number | null
          record_year: number
        }
        Insert: {
          ciq_id: string
          company_name?: string | null
          employees?: number | null
          fetched_at?: string | null
          growth_pct?: number | null
          id?: number
          raw_json?: Json | null
          record_month?: number | null
          record_year: number
        }
        Update: {
          ciq_id?: string
          company_name?: string | null
          employees?: number | null
          fetched_at?: string | null
          growth_pct?: number | null
          id?: number
          raw_json?: Json | null
          record_month?: number | null
          record_year?: number
        }
        Relationships: []
      }
      sp_key_developments: {
        Row: {
          ciq_id: string
          company_name: string | null
          country: string | null
          event_date: string | null
          event_type: string | null
          fetched_at: string | null
          headline: string | null
          id: number
          linked_analytics_id: string | null
          raw_json: Json | null
          sector: string | null
          situation: string | null
          sp_event_id: string | null
        }
        Insert: {
          ciq_id: string
          company_name?: string | null
          country?: string | null
          event_date?: string | null
          event_type?: string | null
          fetched_at?: string | null
          headline?: string | null
          id?: number
          linked_analytics_id?: string | null
          raw_json?: Json | null
          sector?: string | null
          situation?: string | null
          sp_event_id?: string | null
        }
        Update: {
          ciq_id?: string
          company_name?: string | null
          country?: string | null
          event_date?: string | null
          event_type?: string | null
          fetched_at?: string | null
          headline?: string | null
          id?: number
          linked_analytics_id?: string | null
          raw_json?: Json | null
          sector?: string | null
          situation?: string | null
          sp_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sp_key_developments_linked_analytics_id_fkey"
            columns: ["linked_analytics_id"]
            isOneToOne: false
            referencedRelation: "analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      sp_mena_countries: {
        Row: {
          country_code: string
          country_name: string
          country_name_ar: string | null
        }
        Insert: {
          country_code: string
          country_name: string
          country_name_ar?: string | null
        }
        Update: {
          country_code?: string
          country_name?: string
          country_name_ar?: string | null
        }
        Relationships: []
      }
      sp_mena_entity_cache: {
        Row: {
          ciq_id: string
          company_name_clean: string
          company_name_raw: string
          country_code: string
          country_name: string | null
          created_at: string | null
          id: number
          is_mena_confirmed: boolean | null
          match_score: number | null
          source: string | null
          times_matched: number | null
          updated_at: string | null
        }
        Insert: {
          ciq_id: string
          company_name_clean: string
          company_name_raw: string
          country_code: string
          country_name?: string | null
          created_at?: string | null
          id?: number
          is_mena_confirmed?: boolean | null
          match_score?: number | null
          source?: string | null
          times_matched?: number | null
          updated_at?: string | null
        }
        Update: {
          ciq_id?: string
          company_name_clean?: string
          company_name_raw?: string
          country_code?: string
          country_name?: string | null
          created_at?: string | null
          id?: number
          is_mena_confirmed?: boolean | null
          match_score?: number | null
          source?: string | null
          times_matched?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sp_professionals: {
        Row: {
          ciq_id: string
          company_name: string | null
          dealroom_person_uuid: string | null
          fetched_at: string | null
          id: number
          is_current: boolean | null
          person_name: string | null
          raw_json: Json | null
          since_year: number | null
          title: string | null
        }
        Insert: {
          ciq_id: string
          company_name?: string | null
          dealroom_person_uuid?: string | null
          fetched_at?: string | null
          id?: number
          is_current?: boolean | null
          person_name?: string | null
          raw_json?: Json | null
          since_year?: number | null
          title?: string | null
        }
        Update: {
          ciq_id?: string
          company_name?: string | null
          dealroom_person_uuid?: string | null
          fetched_at?: string | null
          id?: number
          is_current?: boolean | null
          person_name?: string | null
          raw_json?: Json | null
          since_year?: number | null
          title?: string | null
        }
        Relationships: []
      }
      sp_sync_log: {
        Row: {
          countries: string[] | null
          date_from: string | null
          date_to: string | null
          duration_ms: number | null
          error_message: string | null
          finished_at: string | null
          id: number
          records_fetched: number | null
          records_inserted: number | null
          started_at: string | null
          status: string
          sync_type: string
        }
        Insert: {
          countries?: string[] | null
          date_from?: string | null
          date_to?: string | null
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: number
          records_fetched?: number | null
          records_inserted?: number | null
          started_at?: string | null
          status: string
          sync_type: string
        }
        Update: {
          countries?: string[] | null
          date_from?: string | null
          date_to?: string | null
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: number
          records_fetched?: number | null
          records_inserted?: number | null
          started_at?: string | null
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      sp_transactions: {
        Row: {
          acquirors: Json | null
          ciq_id: string
          company_name: string | null
          country: string | null
          currency: string | null
          fetched_at: string | null
          id: number
          investors: Json | null
          linked_analytics_id: string | null
          post_money_val_usd: number | null
          raw_json: Json | null
          round_type: string | null
          sector: string | null
          sp_transaction_id: string | null
          status: string | null
          transaction_date: string | null
          transaction_type: string | null
          transaction_value_usd: number | null
        }
        Insert: {
          acquirors?: Json | null
          ciq_id: string
          company_name?: string | null
          country?: string | null
          currency?: string | null
          fetched_at?: string | null
          id?: number
          investors?: Json | null
          linked_analytics_id?: string | null
          post_money_val_usd?: number | null
          raw_json?: Json | null
          round_type?: string | null
          sector?: string | null
          sp_transaction_id?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
          transaction_value_usd?: number | null
        }
        Update: {
          acquirors?: Json | null
          ciq_id?: string
          company_name?: string | null
          country?: string | null
          currency?: string | null
          fetched_at?: string | null
          id?: number
          investors?: Json | null
          linked_analytics_id?: string | null
          post_money_val_usd?: number | null
          raw_json?: Json | null
          round_type?: string | null
          sector?: string | null
          sp_transaction_id?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
          transaction_value_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sp_transactions_linked_analytics_id_fkey"
            columns: ["linked_analytics_id"]
            isOneToOne: false
            referencedRelation: "analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_features_decisions: {
        Row: {
          core_promise: string
          created_at: string | null
          execution_payload: Json
          feature_codename: string
          id: string
          mvp_features_array: Json
          status: string | null
          target_audience: string | null
          tech_stack: Json
          ux_user_journey: Json
          ux_visual_identity: string | null
        }
        Insert: {
          core_promise: string
          created_at?: string | null
          execution_payload: Json
          feature_codename: string
          id?: string
          mvp_features_array?: Json
          status?: string | null
          target_audience?: string | null
          tech_stack?: Json
          ux_user_journey?: Json
          ux_visual_identity?: string | null
        }
        Update: {
          core_promise?: string
          created_at?: string | null
          execution_payload?: Json
          feature_codename?: string
          id?: string
          mvp_features_array?: Json
          status?: string | null
          target_audience?: string | null
          tech_stack?: Json
          ux_user_journey?: Json
          ux_visual_identity?: string | null
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string | null
          name_ar: string
          name_en: string
          slug: string
          subcategory_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          name_ar: string
          name_en: string
          slug: string
          subcategory_id?: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          name_ar?: string
          name_en?: string
          slug?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
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
