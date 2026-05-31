drop extension if exists "pg_net";

create sequence "public"."dealroom_funding_rounds_id_seq";

create sequence "public"."qiraa_companies_headcount_id_seq";

create sequence "public"."qiraa_companies_traffic_id_seq";

create sequence "public"."qiraa_companies_valuations_id_seq";

create sequence "public"."qiraa_company_founders_id_seq";

create sequence "public"."qiraa_company_investors_id_seq";

create sequence "public"."qiraa_inv_org_lps_id_seq";

create sequence "public"."qiraa_inv_org_portfolio_id_seq";

create sequence "public"."qiraa_people_career_id_seq";

create sequence "public"."qiraa_people_education_id_seq";

create sequence "public"."sp_api_config_id_seq";

create sequence "public"."sp_companies_id_seq";

create sequence "public"."sp_headcount_id_seq";

create sequence "public"."sp_key_developments_id_seq";

create sequence "public"."sp_mena_entity_cache_id_seq";

create sequence "public"."sp_professionals_id_seq";

create sequence "public"."sp_sync_log_id_seq";

create sequence "public"."sp_transactions_id_seq";

drop trigger if exists "update_articles_updated_at" on "public"."articles";

drop policy "Published articles are viewable by everyone" on "public"."articles";

drop policy "Users can insert own reading history" on "public"."user_articles";

drop policy "Users can view own reading history" on "public"."user_articles";

revoke delete on table "public"."articles" from "anon";

revoke insert on table "public"."articles" from "anon";

revoke references on table "public"."articles" from "anon";

revoke select on table "public"."articles" from "anon";

revoke trigger on table "public"."articles" from "anon";

revoke truncate on table "public"."articles" from "anon";

revoke update on table "public"."articles" from "anon";

revoke delete on table "public"."articles" from "authenticated";

revoke insert on table "public"."articles" from "authenticated";

revoke references on table "public"."articles" from "authenticated";

revoke select on table "public"."articles" from "authenticated";

revoke trigger on table "public"."articles" from "authenticated";

revoke truncate on table "public"."articles" from "authenticated";

revoke update on table "public"."articles" from "authenticated";

revoke delete on table "public"."articles" from "service_role";

revoke insert on table "public"."articles" from "service_role";

revoke references on table "public"."articles" from "service_role";

revoke select on table "public"."articles" from "service_role";

revoke trigger on table "public"."articles" from "service_role";

revoke truncate on table "public"."articles" from "service_role";

revoke update on table "public"."articles" from "service_role";

revoke delete on table "public"."user_articles" from "anon";

revoke insert on table "public"."user_articles" from "anon";

revoke references on table "public"."user_articles" from "anon";

revoke select on table "public"."user_articles" from "anon";

revoke trigger on table "public"."user_articles" from "anon";

revoke truncate on table "public"."user_articles" from "anon";

revoke update on table "public"."user_articles" from "anon";

revoke delete on table "public"."user_articles" from "authenticated";

revoke insert on table "public"."user_articles" from "authenticated";

revoke references on table "public"."user_articles" from "authenticated";

revoke select on table "public"."user_articles" from "authenticated";

revoke trigger on table "public"."user_articles" from "authenticated";

revoke truncate on table "public"."user_articles" from "authenticated";

revoke update on table "public"."user_articles" from "authenticated";

revoke delete on table "public"."user_articles" from "service_role";

revoke insert on table "public"."user_articles" from "service_role";

revoke references on table "public"."user_articles" from "service_role";

revoke select on table "public"."user_articles" from "service_role";

revoke trigger on table "public"."user_articles" from "service_role";

revoke truncate on table "public"."user_articles" from "service_role";

revoke update on table "public"."user_articles" from "service_role";

alter table "public"."articles" drop constraint "articles_author_id_fkey";

alter table "public"."articles" drop constraint "articles_category_id_fkey";

alter table "public"."user_articles" drop constraint "user_articles_article_id_fkey";

alter table "public"."user_articles" drop constraint "user_articles_user_id_article_id_key";

alter table "public"."user_articles" drop constraint "user_articles_user_id_fkey";

alter table "public"."articles" drop constraint "articles_pkey";

alter table "public"."user_articles" drop constraint "user_articles_pkey";

drop index if exists "public"."articles_pkey";

drop index if exists "public"."user_articles_pkey";

drop index if exists "public"."user_articles_user_id_article_id_key";

drop table "public"."articles";

drop table "public"."user_articles";


  create table "public"."analytics" (
    "id" uuid not null default gen_random_uuid(),
    "title_en" text not null,
    "title_ar" text not null,
    "content_en" text not null,
    "content_ar" text not null,
    "excerpt_en" text,
    "excerpt_ar" text,
    "category_id" uuid,
    "content_type" public.content_type not null default 'article'::public.content_type,
    "status" public.article_status not null default 'draft'::public.article_status,
    "is_premium" boolean not null default false,
    "featured_image" text,
    "author_id" uuid,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "subcategory_id" uuid,
    "steps_ar" jsonb,
    "steps_en" jsonb,
    "source_url" text,
    "source_type" text default 'rss'::text,
    "news_published_at" timestamp with time zone,
    "sp_enriched" boolean default false,
    "ciq_id" text,
    "sp_company_name" text,
    "sp_sector" character varying,
    "country" text,
    "sp_company_valuation" numeric,
    "sp_total_funding" numeric,
    "sp_employees" integer,
    "urgency_level" text,
    "market_gap_report" text,
    "Beneficiary_countries" jsonb default '[]'::jsonb,
    "companies_mentioned" jsonb default '[]'::jsonb,
    "startup_stages" jsonb default '[]'::jsonb,
    "investment_signal" boolean default false,
    "raw_news_text" text,
    "sp_macro_context" jsonb,
    "sp_validation_flag" text default 'not_checked'::text,
    "sp_ciq_ids_used" text,
    "market_gap_status" character varying
      );


alter table "public"."analytics" enable row level security;


  create table "public"."qiraa_companies" (
    "company_uuid" text not null,
    "name" text not null,
    "dealroom_path" text,
    "description" text,
    "company_status" text,
    "company_type" text,
    "country" text,
    "city" text,
    "hq_address" text,
    "sector_main" text,
    "sectors_sub" text,
    "tags" text,
    "client_focus" text,
    "income_streams" text,
    "technologies" text,
    "launch_year" integer,
    "launch_month" integer,
    "employees_latest" integer,
    "employees_range" text,
    "total_jobs_available" integer,
    "startup_ranking_rating" integer,
    "growth_stage" text,
    "valuation_min_usd" numeric,
    "valuation_max_usd" numeric,
    "valuation_source_round" text,
    "total_funding_usd" numeric,
    "founders" text,
    "founders_top_university" text,
    "founders_top_past_companies" text,
    "has_super_founder" boolean,
    "linkedin_url" text,
    "twitter_url" text,
    "appstore_url" text,
    "playstore_url" text,
    "logo_url_original" text,
    "logo_url_stored" text,
    "web_visits_latest" numeric,
    "web_visits_12m_growth" text,
    "is_verified" boolean,
    "is_editorial" boolean,
    "has_ai_data" boolean,
    "year_became_unicorn" integer,
    "innovations_count" integer,
    "patents_count" integer,
    "synced_at" timestamp with time zone default now(),
    "investors_list" text
      );


alter table "public"."qiraa_companies" enable row level security;


  create table "public"."qiraa_companies_headcount" (
    "id" bigint not null default nextval('public.qiraa_companies_headcount_id_seq'::regclass),
    "company_uuid" text not null,
    "record_date" text not null,
    "employee_count" numeric
      );


alter table "public"."qiraa_companies_headcount" enable row level security;


  create table "public"."qiraa_companies_traffic" (
    "id" bigint not null default nextval('public.qiraa_companies_traffic_id_seq'::regclass),
    "company_uuid" text not null,
    "record_date" text not null,
    "visits_count" numeric
      );


alter table "public"."qiraa_companies_traffic" enable row level security;


  create table "public"."qiraa_companies_valuations" (
    "id" bigint not null default nextval('public.qiraa_companies_valuations_id_seq'::regclass),
    "company_uuid" text not null,
    "valuation_year" integer not null,
    "valuation_month" integer not null,
    "source_round" text not null,
    "valuation_usd" numeric,
    "valuation_min_usd" numeric,
    "valuation_max_usd" numeric
      );


alter table "public"."qiraa_companies_valuations" enable row level security;


  create table "public"."qiraa_company_founders" (
    "id" bigint not null default nextval('public.qiraa_company_founders_id_seq'::regclass),
    "company_uuid" text not null,
    "founder_uuid" text not null,
    "founder_name" text,
    "founder_path" text,
    "logo_url" text
      );


alter table "public"."qiraa_company_founders" enable row level security;


  create table "public"."qiraa_company_investors" (
    "id" bigint not null default nextval('public.qiraa_company_investors_id_seq'::regclass),
    "company_uuid" text not null,
    "investor_uuid" text not null,
    "investor_name" text,
    "investor_type" text,
    "investor_path" text,
    "is_lead" boolean default false,
    "has_exited" boolean default false,
    "logo_url" text,
    "entity_type" text
      );


alter table "public"."qiraa_company_investors" enable row level security;


  create table "public"."qiraa_inv_org_lps" (
    "id" bigint not null default nextval('public.qiraa_inv_org_lps_id_seq'::regclass),
    "org_uuid" text not null,
    "lp_uuid" text,
    "lp_name" text,
    "lp_path" text,
    "lp_type" text,
    "logo_url" text
      );


alter table "public"."qiraa_inv_org_lps" enable row level security;


  create table "public"."qiraa_inv_org_portfolio" (
    "id" bigint not null default nextval('public.qiraa_inv_org_portfolio_id_seq'::regclass),
    "org_uuid" text not null,
    "company_uuid" text,
    "company_name" text,
    "company_path" text,
    "company_type" text,
    "has_exited" boolean default false,
    "is_lead" boolean default false,
    "logo_url" text
      );


alter table "public"."qiraa_inv_org_portfolio" enable row level security;


  create table "public"."qiraa_inv_organizations" (
    "org_uuid" text not null,
    "name" text not null,
    "dealroom_path" text,
    "tagline" text,
    "org_type" text,
    "entity_sub_types" text,
    "is_founder" boolean default false,
    "country" text,
    "city" text,
    "preferred_round" text,
    "investments_num" integer default 0,
    "investments_total_usd" numeric,
    "investor_exits_num" integer default 0,
    "investor_exit_score" text,
    "investor_exits_funding_usd" numeric,
    "investor_total_funding_usd" numeric,
    "fundings_12m_usd" numeric,
    "fundings_24m_usd" numeric,
    "deal_size_min_usd" numeric,
    "deal_size_max_usd" numeric,
    "logo_url_original" text,
    "logo_url_stored" text,
    "synced_at" timestamp with time zone default now()
      );


alter table "public"."qiraa_inv_organizations" enable row level security;


  create table "public"."qiraa_people" (
    "person_uuid" text not null,
    "name" text not null,
    "dealroom_path" text,
    "tagline" text,
    "person_type" text,
    "linkedin_url" text,
    "twitter_url" text,
    "website_url" text,
    "country" text,
    "city" text,
    "founder_score" integer,
    "people_rating" integer,
    "last_founded_company_year" integer,
    "has_super_founder" boolean default false,
    "investor_exits_num" integer default 0,
    "investor_total_funding_usd" numeric,
    "founded_companies_total_funding_usd" numeric,
    "top_university" text,
    "top_university_degree" text,
    "logo_url_original" text,
    "logo_url_stored" text,
    "synced_at" timestamp with time zone default now()
      );


alter table "public"."qiraa_people" enable row level security;


  create table "public"."qiraa_people_career" (
    "id" bigint not null default nextval('public.qiraa_people_career_id_seq'::regclass),
    "person_uuid" text not null,
    "org_uuid" text,
    "org_name" text,
    "org_path" text,
    "org_type" text,
    "is_founder" boolean default false,
    "is_executive" boolean default false,
    "is_partner" boolean default false,
    "titles" text,
    "year_start" integer,
    "month_start" integer,
    "year_end" integer,
    "month_end" integer,
    "is_past" boolean default false
      );


alter table "public"."qiraa_people_career" enable row level security;


  create table "public"."qiraa_people_education" (
    "id" bigint not null default nextval('public.qiraa_people_education_id_seq'::regclass),
    "person_uuid" text not null,
    "university_name" text,
    "university_uuid" text,
    "degree" text,
    "major" text,
    "year_start" integer,
    "year_end" integer
      );


alter table "public"."qiraa_people_education" enable row level security;


  create table "public"."qiraa_transactions" (
    "id" bigint not null default nextval('public.dealroom_funding_rounds_id_seq'::regclass),
    "company_uuid" text not null,
    "company_name" text,
    "dealroom_path" text,
    "description" text,
    "launch_year" integer,
    "growth_stage" text,
    "is_verified" boolean default false,
    "country" text,
    "city" text,
    "sector_main" text,
    "sectors_sub" text,
    "tags" text,
    "round_type" text,
    "source_round" text,
    "round_amount_usd" numeric,
    "round_currency" text default 'USD'::text,
    "round_year" integer,
    "round_month" integer,
    "valuation_min_usd" numeric,
    "valuation_max_usd" numeric,
    "total_funding_usd" numeric,
    "investors" text,
    "investor_types" text,
    "logo_url_original" text,
    "logo_url_stored" text,
    "news_source" text,
    "synced_at" timestamp with time zone default now(),
    "transaction_type" text default 'funding_round'::text,
    "exit_date" text,
    "acquirors" text,
    "acquiror_types" text,
    "exited_investors" text,
    "valuation_usd" numeric,
    "total_ev" numeric,
    "ev_revenue_multiple" numeric,
    "ev_ebitda_multiple" numeric,
    "ev_profit_multiple" numeric,
    "investor_uuids" text,
    "acquiror_uuids" text,
    "exited_investor_uuids" text
      );


alter table "public"."qiraa_transactions" enable row level security;


  create table "public"."sp_api_config" (
    "id" bigint not null default nextval('public.sp_api_config_id_seq'::regclass),
    "config_key" text not null,
    "config_value" text not null,
    "description" text,
    "is_secret" boolean default true,
    "expires_at" timestamp with time zone,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."sp_api_config" enable row level security;


  create table "public"."sp_companies" (
    "id" bigint not null default nextval('public.sp_companies_id_seq'::regclass),
    "ciq_id" text not null,
    "company_name" text not null,
    "dealroom_uuid" text,
    "business_desc" text,
    "sector" text,
    "industry" text,
    "sub_industry" text,
    "country" text,
    "city" text,
    "company_status" text,
    "employees" integer,
    "employee_growth" numeric,
    "total_funding_usd" numeric,
    "last_valuation_usd" numeric,
    "revenue_est_usd" numeric,
    "ebitda_est_usd" numeric,
    "website_url" text,
    "founded_year" integer,
    "sp_last_synced" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "country_code" text,
    "is_mena_entity" boolean default false,
    "match_method" text default 'quick_match'::text,
    "validation_status" text default 'pending'::text
      );


alter table "public"."sp_companies" enable row level security;


  create table "public"."sp_headcount" (
    "id" bigint not null default nextval('public.sp_headcount_id_seq'::regclass),
    "ciq_id" text not null,
    "company_name" text,
    "record_year" integer not null,
    "record_month" integer,
    "employees" integer,
    "growth_pct" numeric,
    "raw_json" jsonb,
    "fetched_at" timestamp with time zone default now()
      );


alter table "public"."sp_headcount" enable row level security;


  create table "public"."sp_key_developments" (
    "id" bigint not null default nextval('public.sp_key_developments_id_seq'::regclass),
    "ciq_id" text not null,
    "company_name" text,
    "event_date" date,
    "event_type" text,
    "headline" text,
    "situation" text,
    "country" text,
    "sector" text,
    "sp_event_id" text,
    "linked_analytics_id" uuid,
    "raw_json" jsonb,
    "fetched_at" timestamp with time zone default now()
      );


alter table "public"."sp_key_developments" enable row level security;


  create table "public"."sp_mena_countries" (
    "country_code" text not null,
    "country_name" text not null,
    "country_name_ar" text
      );


alter table "public"."sp_mena_countries" enable row level security;


  create table "public"."sp_mena_entity_cache" (
    "id" bigint not null default nextval('public.sp_mena_entity_cache_id_seq'::regclass),
    "company_name_raw" text not null,
    "company_name_clean" text not null,
    "ciq_id" text not null,
    "country_code" text not null,
    "country_name" text,
    "is_mena_confirmed" boolean default true,
    "match_score" numeric default 1.0,
    "source" text default 'auto'::text,
    "times_matched" integer default 1,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."sp_mena_entity_cache" enable row level security;


  create table "public"."sp_professionals" (
    "id" bigint not null default nextval('public.sp_professionals_id_seq'::regclass),
    "ciq_id" text not null,
    "company_name" text,
    "person_name" text,
    "title" text,
    "since_year" integer,
    "is_current" boolean default true,
    "dealroom_person_uuid" text,
    "raw_json" jsonb,
    "fetched_at" timestamp with time zone default now()
      );


alter table "public"."sp_professionals" enable row level security;


  create table "public"."sp_sync_log" (
    "id" bigint not null default nextval('public.sp_sync_log_id_seq'::regclass),
    "sync_type" text not null,
    "status" text not null,
    "records_fetched" integer default 0,
    "records_inserted" integer default 0,
    "date_from" date,
    "date_to" date,
    "countries" text[],
    "error_message" text,
    "duration_ms" integer,
    "started_at" timestamp with time zone default now(),
    "finished_at" timestamp with time zone
      );


alter table "public"."sp_sync_log" enable row level security;


  create table "public"."sp_transactions" (
    "id" bigint not null default nextval('public.sp_transactions_id_seq'::regclass),
    "ciq_id" text not null,
    "company_name" text,
    "transaction_date" date,
    "transaction_type" text,
    "transaction_value_usd" numeric,
    "currency" text default 'USD'::text,
    "investors" jsonb default '[]'::jsonb,
    "acquirors" jsonb default '[]'::jsonb,
    "post_money_val_usd" numeric,
    "round_type" text,
    "status" text,
    "country" text,
    "sector" text,
    "sp_transaction_id" text,
    "linked_analytics_id" uuid,
    "raw_json" jsonb,
    "fetched_at" timestamp with time zone default now()
      );


alter table "public"."sp_transactions" enable row level security;


  create table "public"."strategic_features_decisions" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "feature_codename" text not null,
    "core_promise" text not null,
    "target_audience" text,
    "mvp_features_array" jsonb not null default '[]'::jsonb,
    "tech_stack" jsonb not null default '{}'::jsonb,
    "ux_visual_identity" text,
    "ux_user_journey" jsonb not null default '[]'::jsonb,
    "execution_payload" jsonb not null,
    "status" text default 'APPROVED'::text
      );


alter table "public"."strategic_features_decisions" enable row level security;


  create table "public"."subcategories" (
    "subcategory_id" uuid not null default gen_random_uuid(),
    "category_id" uuid not null,
    "name_ar" text not null,
    "name_en" text not null,
    "slug" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."subcategories" enable row level security;


  create table "public"."user_analytics" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "analytic_id" uuid not null,
    "read_at" timestamp with time zone not null default now()
      );


alter table "public"."user_analytics" enable row level security;

alter table "public"."market_indicators" add column "day_10_sales" integer;

alter table "public"."market_indicators" add column "day_11_sales" integer;

alter table "public"."market_indicators" add column "day_12_sales" integer;

alter table "public"."market_indicators" add column "day_13_sales" integer;

alter table "public"."market_indicators" add column "day_14_sales" integer;

alter table "public"."market_indicators" add column "day_15_sales" integer;

alter table "public"."market_indicators" add column "day_16_sales" integer;

alter table "public"."market_indicators" add column "day_17_sales" integer;

alter table "public"."market_indicators" add column "day_18_sales" integer;

alter table "public"."market_indicators" add column "day_19_sales" integer;

alter table "public"."market_indicators" add column "day_1_sales" integer;

alter table "public"."market_indicators" add column "day_20_sales" integer;

alter table "public"."market_indicators" add column "day_21_sales" integer;

alter table "public"."market_indicators" add column "day_22_sales" integer;

alter table "public"."market_indicators" add column "day_23_sales" integer;

alter table "public"."market_indicators" add column "day_24_sales" integer;

alter table "public"."market_indicators" add column "day_25_sales" integer;

alter table "public"."market_indicators" add column "day_26_sales" integer;

alter table "public"."market_indicators" add column "day_27_sales" integer;

alter table "public"."market_indicators" add column "day_28_sales" integer;

alter table "public"."market_indicators" add column "day_29_sales" integer;

alter table "public"."market_indicators" add column "day_2_sales" integer;

alter table "public"."market_indicators" add column "day_30_sales" integer;

alter table "public"."market_indicators" add column "day_31_sales" integer;

alter table "public"."market_indicators" add column "day_3_sales" integer;

alter table "public"."market_indicators" add column "day_4_sales" integer;

alter table "public"."market_indicators" add column "day_5_sales" integer;

alter table "public"."market_indicators" add column "day_6_sales" integer;

alter table "public"."market_indicators" add column "day_7_sales" integer;

alter table "public"."market_indicators" add column "day_8_sales" integer;

alter table "public"."market_indicators" add column "day_9_sales" integer;

alter table "public"."market_indicators" add column "quarterly_sales" numeric;

alter table "public"."market_indicators" add column "store_products" numeric not null default '0'::numeric;

alter sequence "public"."dealroom_funding_rounds_id_seq" owned by "public"."qiraa_transactions"."id";

alter sequence "public"."qiraa_companies_headcount_id_seq" owned by "public"."qiraa_companies_headcount"."id";

alter sequence "public"."qiraa_companies_traffic_id_seq" owned by "public"."qiraa_companies_traffic"."id";

alter sequence "public"."qiraa_companies_valuations_id_seq" owned by "public"."qiraa_companies_valuations"."id";

alter sequence "public"."qiraa_company_founders_id_seq" owned by "public"."qiraa_company_founders"."id";

alter sequence "public"."qiraa_company_investors_id_seq" owned by "public"."qiraa_company_investors"."id";

alter sequence "public"."qiraa_inv_org_lps_id_seq" owned by "public"."qiraa_inv_org_lps"."id";

alter sequence "public"."qiraa_inv_org_portfolio_id_seq" owned by "public"."qiraa_inv_org_portfolio"."id";

alter sequence "public"."qiraa_people_career_id_seq" owned by "public"."qiraa_people_career"."id";

alter sequence "public"."qiraa_people_education_id_seq" owned by "public"."qiraa_people_education"."id";

alter sequence "public"."sp_api_config_id_seq" owned by "public"."sp_api_config"."id";

alter sequence "public"."sp_companies_id_seq" owned by "public"."sp_companies"."id";

alter sequence "public"."sp_headcount_id_seq" owned by "public"."sp_headcount"."id";

alter sequence "public"."sp_key_developments_id_seq" owned by "public"."sp_key_developments"."id";

alter sequence "public"."sp_mena_entity_cache_id_seq" owned by "public"."sp_mena_entity_cache"."id";

alter sequence "public"."sp_professionals_id_seq" owned by "public"."sp_professionals"."id";

alter sequence "public"."sp_sync_log_id_seq" owned by "public"."sp_sync_log"."id";

alter sequence "public"."sp_transactions_id_seq" owned by "public"."sp_transactions"."id";

CREATE UNIQUE INDEX dealroom_funding_rounds_pkey ON public.qiraa_transactions USING btree (id);

CREATE UNIQUE INDEX dealroom_funding_rounds_unique ON public.qiraa_transactions USING btree (company_uuid, round_type, round_year, round_month, exit_date);

CREATE INDEX idx_analytics_ciq ON public.analytics USING btree (ciq_id);

CREATE INDEX idx_analytics_published ON public.analytics USING btree (news_published_at DESC);

CREATE INDEX idx_analytics_sp_enriched ON public.analytics USING btree (sp_enriched);

CREATE INDEX idx_analytics_steps_ar ON public.analytics USING gin (steps_ar);

CREATE INDEX idx_analytics_steps_en ON public.analytics USING gin (steps_en);

CREATE INDEX idx_analytics_subcategory_id ON public.analytics USING btree (subcategory_id);

CREATE INDEX idx_analytics_urgency ON public.analytics USING btree (urgency_level);

CREATE INDEX idx_cf_company ON public.qiraa_company_founders USING btree (company_uuid);

CREATE INDEX idx_ci_company ON public.qiraa_company_investors USING btree (company_uuid);

CREATE INDEX idx_dt_company ON public.qiraa_transactions USING btree (company_uuid);

CREATE INDEX idx_dt_country ON public.qiraa_transactions USING btree (country);

CREATE INDEX idx_dt_round ON public.qiraa_transactions USING btree (round_type);

CREATE INDEX idx_dt_sector ON public.qiraa_transactions USING btree (sector_main);

CREATE INDEX idx_dt_stage ON public.qiraa_transactions USING btree (source_round);

CREATE INDEX idx_dt_txn_type ON public.qiraa_transactions USING btree (transaction_type);

CREATE INDEX idx_dt_year ON public.qiraa_transactions USING btree (round_year);

CREATE INDEX idx_inv_org_type ON public.qiraa_inv_organizations USING btree (org_type);

CREATE INDEX idx_mena_cache_ciq ON public.sp_mena_entity_cache USING btree (ciq_id);

CREATE INDEX idx_mena_cache_country ON public.sp_mena_entity_cache USING btree (country_code);

CREATE INDEX idx_mena_cache_name ON public.sp_mena_entity_cache USING btree (company_name_clean);

CREATE INDEX idx_people_type ON public.qiraa_people USING btree (person_type);

CREATE INDEX idx_qc_country ON public.qiraa_companies USING btree (country);

CREATE INDEX idx_qc_hc_uuid ON public.qiraa_companies_headcount USING btree (company_uuid);

CREATE INDEX idx_qc_sector ON public.qiraa_companies USING btree (sector_main);

CREATE INDEX idx_qc_stage ON public.qiraa_companies USING btree (growth_stage);

CREATE INDEX idx_qc_tr_uuid ON public.qiraa_companies_traffic USING btree (company_uuid);

CREATE INDEX idx_qc_val_uuid ON public.qiraa_companies_valuations USING btree (company_uuid);

CREATE INDEX idx_sp_comp_name_lower ON public.sp_companies USING btree (lower(company_name));

CREATE INDEX idx_sp_companies_country ON public.sp_companies USING btree (country);

CREATE INDEX idx_sp_companies_dealroom ON public.sp_companies USING btree (dealroom_uuid);

CREATE INDEX idx_sp_companies_sector ON public.sp_companies USING btree (sector);

CREATE INDEX idx_sp_hc_ciq ON public.sp_headcount USING btree (ciq_id);

CREATE INDEX idx_sp_hc_year ON public.sp_headcount USING btree (record_year);

CREATE INDEX idx_sp_kd_ciq ON public.sp_key_developments USING btree (ciq_id);

CREATE INDEX idx_sp_kd_country ON public.sp_key_developments USING btree (country);

CREATE INDEX idx_sp_kd_date ON public.sp_key_developments USING btree (event_date DESC);

CREATE INDEX idx_sp_kd_type ON public.sp_key_developments USING btree (event_type);

CREATE INDEX idx_sp_prof_ciq ON public.sp_professionals USING btree (ciq_id);

CREATE INDEX idx_sp_prof_name ON public.sp_professionals USING btree (person_name);

CREATE INDEX idx_sp_txn_ciq ON public.sp_transactions USING btree (ciq_id);

CREATE INDEX idx_sp_txn_country ON public.sp_transactions USING btree (country);

CREATE INDEX idx_sp_txn_date ON public.sp_transactions USING btree (transaction_date DESC);

CREATE INDEX idx_sp_txn_type ON public.sp_transactions USING btree (transaction_type);

CREATE UNIQUE INDEX qiraa_career_unique ON public.qiraa_people_career USING btree (person_uuid, org_uuid, year_start);

CREATE UNIQUE INDEX qiraa_cf_unique ON public.qiraa_company_founders USING btree (company_uuid, founder_uuid);

CREATE UNIQUE INDEX qiraa_ci_unique ON public.qiraa_company_investors USING btree (company_uuid, investor_uuid);

CREATE UNIQUE INDEX qiraa_companies_headcount_pkey ON public.qiraa_companies_headcount USING btree (id);

CREATE UNIQUE INDEX qiraa_companies_pkey ON public.qiraa_companies USING btree (company_uuid);

CREATE UNIQUE INDEX qiraa_companies_traffic_pkey ON public.qiraa_companies_traffic USING btree (id);

CREATE UNIQUE INDEX qiraa_companies_valuations_pkey ON public.qiraa_companies_valuations USING btree (id);

CREATE UNIQUE INDEX qiraa_company_founders_pkey ON public.qiraa_company_founders USING btree (id);

CREATE UNIQUE INDEX qiraa_company_investors_pkey ON public.qiraa_company_investors USING btree (id);

CREATE UNIQUE INDEX qiraa_edu_unique ON public.qiraa_people_education USING btree (person_uuid, university_uuid, degree, year_start);

CREATE UNIQUE INDEX qiraa_headcount_unique ON public.qiraa_companies_headcount USING btree (company_uuid, record_date);

CREATE UNIQUE INDEX qiraa_inv_org_lps_pkey ON public.qiraa_inv_org_lps USING btree (id);

CREATE UNIQUE INDEX qiraa_inv_org_portfolio_pkey ON public.qiraa_inv_org_portfolio USING btree (id);

CREATE UNIQUE INDEX qiraa_inv_organizations_pkey ON public.qiraa_inv_organizations USING btree (org_uuid);

CREATE UNIQUE INDEX qiraa_lp_unique ON public.qiraa_inv_org_lps USING btree (org_uuid, lp_uuid);

CREATE UNIQUE INDEX qiraa_people_career_pkey ON public.qiraa_people_career USING btree (id);

CREATE UNIQUE INDEX qiraa_people_education_pkey ON public.qiraa_people_education USING btree (id);

CREATE UNIQUE INDEX qiraa_people_pkey ON public.qiraa_people USING btree (person_uuid);

CREATE UNIQUE INDEX qiraa_portfolio_unique ON public.qiraa_inv_org_portfolio USING btree (org_uuid, company_uuid);

CREATE UNIQUE INDEX qiraa_traffic_unique ON public.qiraa_companies_traffic USING btree (company_uuid, record_date);

CREATE UNIQUE INDEX qiraa_valuations_unique ON public.qiraa_companies_valuations USING btree (company_uuid, valuation_year, valuation_month, source_round);

CREATE UNIQUE INDEX sp_api_config_config_key_key ON public.sp_api_config USING btree (config_key);

CREATE UNIQUE INDEX sp_api_config_pkey ON public.sp_api_config USING btree (id);

CREATE UNIQUE INDEX sp_companies_ciq_id_key ON public.sp_companies USING btree (ciq_id);

CREATE UNIQUE INDEX sp_companies_pkey ON public.sp_companies USING btree (id);

CREATE UNIQUE INDEX sp_hc_unique ON public.sp_headcount USING btree (ciq_id, record_year, record_month);

CREATE UNIQUE INDEX sp_headcount_pkey ON public.sp_headcount USING btree (id);

CREATE UNIQUE INDEX sp_kd_unique ON public.sp_key_developments USING btree (ciq_id, event_date, headline);

CREATE UNIQUE INDEX sp_key_developments_pkey ON public.sp_key_developments USING btree (id);

CREATE UNIQUE INDEX sp_mena_cache_unique ON public.sp_mena_entity_cache USING btree (company_name_clean, ciq_id);

CREATE UNIQUE INDEX sp_mena_countries_pkey ON public.sp_mena_countries USING btree (country_code);

CREATE UNIQUE INDEX sp_mena_entity_cache_pkey ON public.sp_mena_entity_cache USING btree (id);

CREATE UNIQUE INDEX sp_prof_unique ON public.sp_professionals USING btree (ciq_id, person_name, title);

CREATE UNIQUE INDEX sp_professionals_pkey ON public.sp_professionals USING btree (id);

CREATE UNIQUE INDEX sp_sync_log_pkey ON public.sp_sync_log USING btree (id);

CREATE UNIQUE INDEX sp_transactions_pkey ON public.sp_transactions USING btree (id);

CREATE UNIQUE INDEX sp_txn_unique ON public.sp_transactions USING btree (ciq_id, transaction_date, transaction_type, transaction_value_usd);

CREATE UNIQUE INDEX strategic_features_decisions_feature_codename_key ON public.strategic_features_decisions USING btree (feature_codename);

CREATE UNIQUE INDEX strategic_features_decisions_pkey ON public.strategic_features_decisions USING btree (id);

CREATE UNIQUE INDEX subcategories_pkey ON public.subcategories USING btree (subcategory_id);

CREATE UNIQUE INDEX subcategories_slug_key ON public.subcategories USING btree (slug);

CREATE UNIQUE INDEX articles_pkey ON public.analytics USING btree (id);

CREATE UNIQUE INDEX user_articles_pkey ON public.user_analytics USING btree (id);

CREATE UNIQUE INDEX user_articles_user_id_article_id_key ON public.user_analytics USING btree (user_id, analytic_id);

alter table "public"."analytics" add constraint "articles_pkey" PRIMARY KEY using index "articles_pkey";

alter table "public"."qiraa_companies" add constraint "qiraa_companies_pkey" PRIMARY KEY using index "qiraa_companies_pkey";

alter table "public"."qiraa_companies_headcount" add constraint "qiraa_companies_headcount_pkey" PRIMARY KEY using index "qiraa_companies_headcount_pkey";

alter table "public"."qiraa_companies_traffic" add constraint "qiraa_companies_traffic_pkey" PRIMARY KEY using index "qiraa_companies_traffic_pkey";

alter table "public"."qiraa_companies_valuations" add constraint "qiraa_companies_valuations_pkey" PRIMARY KEY using index "qiraa_companies_valuations_pkey";

alter table "public"."qiraa_company_founders" add constraint "qiraa_company_founders_pkey" PRIMARY KEY using index "qiraa_company_founders_pkey";

alter table "public"."qiraa_company_investors" add constraint "qiraa_company_investors_pkey" PRIMARY KEY using index "qiraa_company_investors_pkey";

alter table "public"."qiraa_inv_org_lps" add constraint "qiraa_inv_org_lps_pkey" PRIMARY KEY using index "qiraa_inv_org_lps_pkey";

alter table "public"."qiraa_inv_org_portfolio" add constraint "qiraa_inv_org_portfolio_pkey" PRIMARY KEY using index "qiraa_inv_org_portfolio_pkey";

alter table "public"."qiraa_inv_organizations" add constraint "qiraa_inv_organizations_pkey" PRIMARY KEY using index "qiraa_inv_organizations_pkey";

alter table "public"."qiraa_people" add constraint "qiraa_people_pkey" PRIMARY KEY using index "qiraa_people_pkey";

alter table "public"."qiraa_people_career" add constraint "qiraa_people_career_pkey" PRIMARY KEY using index "qiraa_people_career_pkey";

alter table "public"."qiraa_people_education" add constraint "qiraa_people_education_pkey" PRIMARY KEY using index "qiraa_people_education_pkey";

alter table "public"."qiraa_transactions" add constraint "dealroom_funding_rounds_pkey" PRIMARY KEY using index "dealroom_funding_rounds_pkey";

alter table "public"."sp_api_config" add constraint "sp_api_config_pkey" PRIMARY KEY using index "sp_api_config_pkey";

alter table "public"."sp_companies" add constraint "sp_companies_pkey" PRIMARY KEY using index "sp_companies_pkey";

alter table "public"."sp_headcount" add constraint "sp_headcount_pkey" PRIMARY KEY using index "sp_headcount_pkey";

alter table "public"."sp_key_developments" add constraint "sp_key_developments_pkey" PRIMARY KEY using index "sp_key_developments_pkey";

alter table "public"."sp_mena_countries" add constraint "sp_mena_countries_pkey" PRIMARY KEY using index "sp_mena_countries_pkey";

alter table "public"."sp_mena_entity_cache" add constraint "sp_mena_entity_cache_pkey" PRIMARY KEY using index "sp_mena_entity_cache_pkey";

alter table "public"."sp_professionals" add constraint "sp_professionals_pkey" PRIMARY KEY using index "sp_professionals_pkey";

alter table "public"."sp_sync_log" add constraint "sp_sync_log_pkey" PRIMARY KEY using index "sp_sync_log_pkey";

alter table "public"."sp_transactions" add constraint "sp_transactions_pkey" PRIMARY KEY using index "sp_transactions_pkey";

alter table "public"."strategic_features_decisions" add constraint "strategic_features_decisions_pkey" PRIMARY KEY using index "strategic_features_decisions_pkey";

alter table "public"."subcategories" add constraint "subcategories_pkey" PRIMARY KEY using index "subcategories_pkey";

alter table "public"."user_analytics" add constraint "user_articles_pkey" PRIMARY KEY using index "user_articles_pkey";

alter table "public"."analytics" add constraint "analytics_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(subcategory_id) ON DELETE SET NULL not valid;

alter table "public"."analytics" validate constraint "analytics_subcategory_id_fkey";

alter table "public"."analytics" add constraint "analytics_urgency_level_check" CHECK ((urgency_level = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]))) not valid;

alter table "public"."analytics" validate constraint "analytics_urgency_level_check";

alter table "public"."analytics" add constraint "articles_author_id_fkey" FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."analytics" validate constraint "articles_author_id_fkey";

alter table "public"."analytics" add constraint "articles_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL not valid;

alter table "public"."analytics" validate constraint "articles_category_id_fkey";

alter table "public"."qiraa_companies_headcount" add constraint "qiraa_companies_headcount_company_uuid_fkey" FOREIGN KEY (company_uuid) REFERENCES public.qiraa_companies(company_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_companies_headcount" validate constraint "qiraa_companies_headcount_company_uuid_fkey";

alter table "public"."qiraa_companies_headcount" add constraint "qiraa_headcount_unique" UNIQUE using index "qiraa_headcount_unique";

alter table "public"."qiraa_companies_traffic" add constraint "qiraa_companies_traffic_company_uuid_fkey" FOREIGN KEY (company_uuid) REFERENCES public.qiraa_companies(company_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_companies_traffic" validate constraint "qiraa_companies_traffic_company_uuid_fkey";

alter table "public"."qiraa_companies_traffic" add constraint "qiraa_traffic_unique" UNIQUE using index "qiraa_traffic_unique";

alter table "public"."qiraa_companies_valuations" add constraint "qiraa_companies_valuations_company_uuid_fkey" FOREIGN KEY (company_uuid) REFERENCES public.qiraa_companies(company_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_companies_valuations" validate constraint "qiraa_companies_valuations_company_uuid_fkey";

alter table "public"."qiraa_companies_valuations" add constraint "qiraa_valuations_unique" UNIQUE using index "qiraa_valuations_unique";

alter table "public"."qiraa_company_founders" add constraint "qiraa_cf_unique" UNIQUE using index "qiraa_cf_unique";

alter table "public"."qiraa_company_investors" add constraint "qiraa_ci_unique" UNIQUE using index "qiraa_ci_unique";

alter table "public"."qiraa_inv_org_lps" add constraint "qiraa_inv_org_lps_org_uuid_fkey" FOREIGN KEY (org_uuid) REFERENCES public.qiraa_inv_organizations(org_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_inv_org_lps" validate constraint "qiraa_inv_org_lps_org_uuid_fkey";

alter table "public"."qiraa_inv_org_lps" add constraint "qiraa_lp_unique" UNIQUE using index "qiraa_lp_unique";

alter table "public"."qiraa_inv_org_portfolio" add constraint "qiraa_inv_org_portfolio_org_uuid_fkey" FOREIGN KEY (org_uuid) REFERENCES public.qiraa_inv_organizations(org_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_inv_org_portfolio" validate constraint "qiraa_inv_org_portfolio_org_uuid_fkey";

alter table "public"."qiraa_inv_org_portfolio" add constraint "qiraa_portfolio_unique" UNIQUE using index "qiraa_portfolio_unique";

alter table "public"."qiraa_people_career" add constraint "qiraa_career_unique" UNIQUE using index "qiraa_career_unique";

alter table "public"."qiraa_people_career" add constraint "qiraa_people_career_person_uuid_fkey" FOREIGN KEY (person_uuid) REFERENCES public.qiraa_people(person_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_people_career" validate constraint "qiraa_people_career_person_uuid_fkey";

alter table "public"."qiraa_people_education" add constraint "qiraa_edu_unique" UNIQUE using index "qiraa_edu_unique";

alter table "public"."qiraa_people_education" add constraint "qiraa_people_education_person_uuid_fkey" FOREIGN KEY (person_uuid) REFERENCES public.qiraa_people(person_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_people_education" validate constraint "qiraa_people_education_person_uuid_fkey";

alter table "public"."qiraa_transactions" add constraint "dealroom_funding_rounds_unique" UNIQUE using index "dealroom_funding_rounds_unique";

alter table "public"."sp_api_config" add constraint "sp_api_config_config_key_key" UNIQUE using index "sp_api_config_config_key_key";

alter table "public"."sp_companies" add constraint "sp_companies_ciq_id_key" UNIQUE using index "sp_companies_ciq_id_key";

alter table "public"."sp_headcount" add constraint "sp_hc_unique" UNIQUE using index "sp_hc_unique";

alter table "public"."sp_key_developments" add constraint "sp_kd_unique" UNIQUE using index "sp_kd_unique";

alter table "public"."sp_key_developments" add constraint "sp_key_developments_linked_analytics_id_fkey" FOREIGN KEY (linked_analytics_id) REFERENCES public.analytics(id) ON DELETE SET NULL not valid;

alter table "public"."sp_key_developments" validate constraint "sp_key_developments_linked_analytics_id_fkey";

alter table "public"."sp_mena_entity_cache" add constraint "sp_mena_cache_unique" UNIQUE using index "sp_mena_cache_unique";

alter table "public"."sp_professionals" add constraint "sp_prof_unique" UNIQUE using index "sp_prof_unique";

alter table "public"."sp_transactions" add constraint "sp_transactions_linked_analytics_id_fkey" FOREIGN KEY (linked_analytics_id) REFERENCES public.analytics(id) ON DELETE SET NULL not valid;

alter table "public"."sp_transactions" validate constraint "sp_transactions_linked_analytics_id_fkey";

alter table "public"."sp_transactions" add constraint "sp_txn_unique" UNIQUE using index "sp_txn_unique";

alter table "public"."strategic_features_decisions" add constraint "strategic_features_decisions_feature_codename_key" UNIQUE using index "strategic_features_decisions_feature_codename_key";

alter table "public"."subcategories" add constraint "subcategories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE not valid;

alter table "public"."subcategories" validate constraint "subcategories_category_id_fkey";

alter table "public"."subcategories" add constraint "subcategories_slug_key" UNIQUE using index "subcategories_slug_key";

alter table "public"."user_analytics" add constraint "user_articles_article_id_fkey" FOREIGN KEY (analytic_id) REFERENCES public.analytics(id) ON DELETE CASCADE not valid;

alter table "public"."user_analytics" validate constraint "user_articles_article_id_fkey";

alter table "public"."user_analytics" add constraint "user_articles_user_id_article_id_key" UNIQUE using index "user_articles_user_id_article_id_key";

alter table "public"."user_analytics" add constraint "user_articles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_analytics" validate constraint "user_articles_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.qiraa_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

grant delete on table "public"."analytics" to "anon";

grant insert on table "public"."analytics" to "anon";

grant references on table "public"."analytics" to "anon";

grant select on table "public"."analytics" to "anon";

grant trigger on table "public"."analytics" to "anon";

grant truncate on table "public"."analytics" to "anon";

grant update on table "public"."analytics" to "anon";

grant delete on table "public"."analytics" to "authenticated";

grant insert on table "public"."analytics" to "authenticated";

grant references on table "public"."analytics" to "authenticated";

grant select on table "public"."analytics" to "authenticated";

grant trigger on table "public"."analytics" to "authenticated";

grant truncate on table "public"."analytics" to "authenticated";

grant update on table "public"."analytics" to "authenticated";

grant delete on table "public"."analytics" to "service_role";

grant insert on table "public"."analytics" to "service_role";

grant references on table "public"."analytics" to "service_role";

grant select on table "public"."analytics" to "service_role";

grant trigger on table "public"."analytics" to "service_role";

grant truncate on table "public"."analytics" to "service_role";

grant update on table "public"."analytics" to "service_role";

grant delete on table "public"."qiraa_companies" to "anon";

grant insert on table "public"."qiraa_companies" to "anon";

grant references on table "public"."qiraa_companies" to "anon";

grant select on table "public"."qiraa_companies" to "anon";

grant trigger on table "public"."qiraa_companies" to "anon";

grant truncate on table "public"."qiraa_companies" to "anon";

grant update on table "public"."qiraa_companies" to "anon";

grant delete on table "public"."qiraa_companies" to "authenticated";

grant insert on table "public"."qiraa_companies" to "authenticated";

grant references on table "public"."qiraa_companies" to "authenticated";

grant select on table "public"."qiraa_companies" to "authenticated";

grant trigger on table "public"."qiraa_companies" to "authenticated";

grant truncate on table "public"."qiraa_companies" to "authenticated";

grant update on table "public"."qiraa_companies" to "authenticated";

grant delete on table "public"."qiraa_companies" to "service_role";

grant insert on table "public"."qiraa_companies" to "service_role";

grant references on table "public"."qiraa_companies" to "service_role";

grant select on table "public"."qiraa_companies" to "service_role";

grant trigger on table "public"."qiraa_companies" to "service_role";

grant truncate on table "public"."qiraa_companies" to "service_role";

grant update on table "public"."qiraa_companies" to "service_role";

grant delete on table "public"."qiraa_companies_headcount" to "anon";

grant insert on table "public"."qiraa_companies_headcount" to "anon";

grant references on table "public"."qiraa_companies_headcount" to "anon";

grant select on table "public"."qiraa_companies_headcount" to "anon";

grant trigger on table "public"."qiraa_companies_headcount" to "anon";

grant truncate on table "public"."qiraa_companies_headcount" to "anon";

grant update on table "public"."qiraa_companies_headcount" to "anon";

grant delete on table "public"."qiraa_companies_headcount" to "authenticated";

grant insert on table "public"."qiraa_companies_headcount" to "authenticated";

grant references on table "public"."qiraa_companies_headcount" to "authenticated";

grant select on table "public"."qiraa_companies_headcount" to "authenticated";

grant trigger on table "public"."qiraa_companies_headcount" to "authenticated";

grant truncate on table "public"."qiraa_companies_headcount" to "authenticated";

grant update on table "public"."qiraa_companies_headcount" to "authenticated";

grant delete on table "public"."qiraa_companies_headcount" to "service_role";

grant insert on table "public"."qiraa_companies_headcount" to "service_role";

grant references on table "public"."qiraa_companies_headcount" to "service_role";

grant select on table "public"."qiraa_companies_headcount" to "service_role";

grant trigger on table "public"."qiraa_companies_headcount" to "service_role";

grant truncate on table "public"."qiraa_companies_headcount" to "service_role";

grant update on table "public"."qiraa_companies_headcount" to "service_role";

grant delete on table "public"."qiraa_companies_traffic" to "anon";

grant insert on table "public"."qiraa_companies_traffic" to "anon";

grant references on table "public"."qiraa_companies_traffic" to "anon";

grant select on table "public"."qiraa_companies_traffic" to "anon";

grant trigger on table "public"."qiraa_companies_traffic" to "anon";

grant truncate on table "public"."qiraa_companies_traffic" to "anon";

grant update on table "public"."qiraa_companies_traffic" to "anon";

grant delete on table "public"."qiraa_companies_traffic" to "authenticated";

grant insert on table "public"."qiraa_companies_traffic" to "authenticated";

grant references on table "public"."qiraa_companies_traffic" to "authenticated";

grant select on table "public"."qiraa_companies_traffic" to "authenticated";

grant trigger on table "public"."qiraa_companies_traffic" to "authenticated";

grant truncate on table "public"."qiraa_companies_traffic" to "authenticated";

grant update on table "public"."qiraa_companies_traffic" to "authenticated";

grant delete on table "public"."qiraa_companies_traffic" to "service_role";

grant insert on table "public"."qiraa_companies_traffic" to "service_role";

grant references on table "public"."qiraa_companies_traffic" to "service_role";

grant select on table "public"."qiraa_companies_traffic" to "service_role";

grant trigger on table "public"."qiraa_companies_traffic" to "service_role";

grant truncate on table "public"."qiraa_companies_traffic" to "service_role";

grant update on table "public"."qiraa_companies_traffic" to "service_role";

grant delete on table "public"."qiraa_companies_valuations" to "anon";

grant insert on table "public"."qiraa_companies_valuations" to "anon";

grant references on table "public"."qiraa_companies_valuations" to "anon";

grant select on table "public"."qiraa_companies_valuations" to "anon";

grant trigger on table "public"."qiraa_companies_valuations" to "anon";

grant truncate on table "public"."qiraa_companies_valuations" to "anon";

grant update on table "public"."qiraa_companies_valuations" to "anon";

grant delete on table "public"."qiraa_companies_valuations" to "authenticated";

grant insert on table "public"."qiraa_companies_valuations" to "authenticated";

grant references on table "public"."qiraa_companies_valuations" to "authenticated";

grant select on table "public"."qiraa_companies_valuations" to "authenticated";

grant trigger on table "public"."qiraa_companies_valuations" to "authenticated";

grant truncate on table "public"."qiraa_companies_valuations" to "authenticated";

grant update on table "public"."qiraa_companies_valuations" to "authenticated";

grant delete on table "public"."qiraa_companies_valuations" to "service_role";

grant insert on table "public"."qiraa_companies_valuations" to "service_role";

grant references on table "public"."qiraa_companies_valuations" to "service_role";

grant select on table "public"."qiraa_companies_valuations" to "service_role";

grant trigger on table "public"."qiraa_companies_valuations" to "service_role";

grant truncate on table "public"."qiraa_companies_valuations" to "service_role";

grant update on table "public"."qiraa_companies_valuations" to "service_role";

grant delete on table "public"."qiraa_company_founders" to "anon";

grant insert on table "public"."qiraa_company_founders" to "anon";

grant references on table "public"."qiraa_company_founders" to "anon";

grant select on table "public"."qiraa_company_founders" to "anon";

grant trigger on table "public"."qiraa_company_founders" to "anon";

grant truncate on table "public"."qiraa_company_founders" to "anon";

grant update on table "public"."qiraa_company_founders" to "anon";

grant delete on table "public"."qiraa_company_founders" to "authenticated";

grant insert on table "public"."qiraa_company_founders" to "authenticated";

grant references on table "public"."qiraa_company_founders" to "authenticated";

grant select on table "public"."qiraa_company_founders" to "authenticated";

grant trigger on table "public"."qiraa_company_founders" to "authenticated";

grant truncate on table "public"."qiraa_company_founders" to "authenticated";

grant update on table "public"."qiraa_company_founders" to "authenticated";

grant delete on table "public"."qiraa_company_founders" to "service_role";

grant insert on table "public"."qiraa_company_founders" to "service_role";

grant references on table "public"."qiraa_company_founders" to "service_role";

grant select on table "public"."qiraa_company_founders" to "service_role";

grant trigger on table "public"."qiraa_company_founders" to "service_role";

grant truncate on table "public"."qiraa_company_founders" to "service_role";

grant update on table "public"."qiraa_company_founders" to "service_role";

grant delete on table "public"."qiraa_company_investors" to "anon";

grant insert on table "public"."qiraa_company_investors" to "anon";

grant references on table "public"."qiraa_company_investors" to "anon";

grant select on table "public"."qiraa_company_investors" to "anon";

grant trigger on table "public"."qiraa_company_investors" to "anon";

grant truncate on table "public"."qiraa_company_investors" to "anon";

grant update on table "public"."qiraa_company_investors" to "anon";

grant delete on table "public"."qiraa_company_investors" to "authenticated";

grant insert on table "public"."qiraa_company_investors" to "authenticated";

grant references on table "public"."qiraa_company_investors" to "authenticated";

grant select on table "public"."qiraa_company_investors" to "authenticated";

grant trigger on table "public"."qiraa_company_investors" to "authenticated";

grant truncate on table "public"."qiraa_company_investors" to "authenticated";

grant update on table "public"."qiraa_company_investors" to "authenticated";

grant delete on table "public"."qiraa_company_investors" to "service_role";

grant insert on table "public"."qiraa_company_investors" to "service_role";

grant references on table "public"."qiraa_company_investors" to "service_role";

grant select on table "public"."qiraa_company_investors" to "service_role";

grant trigger on table "public"."qiraa_company_investors" to "service_role";

grant truncate on table "public"."qiraa_company_investors" to "service_role";

grant update on table "public"."qiraa_company_investors" to "service_role";

grant delete on table "public"."qiraa_inv_org_lps" to "anon";

grant insert on table "public"."qiraa_inv_org_lps" to "anon";

grant references on table "public"."qiraa_inv_org_lps" to "anon";

grant select on table "public"."qiraa_inv_org_lps" to "anon";

grant trigger on table "public"."qiraa_inv_org_lps" to "anon";

grant truncate on table "public"."qiraa_inv_org_lps" to "anon";

grant update on table "public"."qiraa_inv_org_lps" to "anon";

grant delete on table "public"."qiraa_inv_org_lps" to "authenticated";

grant insert on table "public"."qiraa_inv_org_lps" to "authenticated";

grant references on table "public"."qiraa_inv_org_lps" to "authenticated";

grant select on table "public"."qiraa_inv_org_lps" to "authenticated";

grant trigger on table "public"."qiraa_inv_org_lps" to "authenticated";

grant truncate on table "public"."qiraa_inv_org_lps" to "authenticated";

grant update on table "public"."qiraa_inv_org_lps" to "authenticated";

grant delete on table "public"."qiraa_inv_org_lps" to "service_role";

grant insert on table "public"."qiraa_inv_org_lps" to "service_role";

grant references on table "public"."qiraa_inv_org_lps" to "service_role";

grant select on table "public"."qiraa_inv_org_lps" to "service_role";

grant trigger on table "public"."qiraa_inv_org_lps" to "service_role";

grant truncate on table "public"."qiraa_inv_org_lps" to "service_role";

grant update on table "public"."qiraa_inv_org_lps" to "service_role";

grant delete on table "public"."qiraa_inv_org_portfolio" to "anon";

grant insert on table "public"."qiraa_inv_org_portfolio" to "anon";

grant references on table "public"."qiraa_inv_org_portfolio" to "anon";

grant select on table "public"."qiraa_inv_org_portfolio" to "anon";

grant trigger on table "public"."qiraa_inv_org_portfolio" to "anon";

grant truncate on table "public"."qiraa_inv_org_portfolio" to "anon";

grant update on table "public"."qiraa_inv_org_portfolio" to "anon";

grant delete on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant insert on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant references on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant select on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant trigger on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant truncate on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant update on table "public"."qiraa_inv_org_portfolio" to "authenticated";

grant delete on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant insert on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant references on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant select on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant trigger on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant truncate on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant update on table "public"."qiraa_inv_org_portfolio" to "service_role";

grant delete on table "public"."qiraa_inv_organizations" to "anon";

grant insert on table "public"."qiraa_inv_organizations" to "anon";

grant references on table "public"."qiraa_inv_organizations" to "anon";

grant select on table "public"."qiraa_inv_organizations" to "anon";

grant trigger on table "public"."qiraa_inv_organizations" to "anon";

grant truncate on table "public"."qiraa_inv_organizations" to "anon";

grant update on table "public"."qiraa_inv_organizations" to "anon";

grant delete on table "public"."qiraa_inv_organizations" to "authenticated";

grant insert on table "public"."qiraa_inv_organizations" to "authenticated";

grant references on table "public"."qiraa_inv_organizations" to "authenticated";

grant select on table "public"."qiraa_inv_organizations" to "authenticated";

grant trigger on table "public"."qiraa_inv_organizations" to "authenticated";

grant truncate on table "public"."qiraa_inv_organizations" to "authenticated";

grant update on table "public"."qiraa_inv_organizations" to "authenticated";

grant delete on table "public"."qiraa_inv_organizations" to "service_role";

grant insert on table "public"."qiraa_inv_organizations" to "service_role";

grant references on table "public"."qiraa_inv_organizations" to "service_role";

grant select on table "public"."qiraa_inv_organizations" to "service_role";

grant trigger on table "public"."qiraa_inv_organizations" to "service_role";

grant truncate on table "public"."qiraa_inv_organizations" to "service_role";

grant update on table "public"."qiraa_inv_organizations" to "service_role";

grant delete on table "public"."qiraa_people" to "anon";

grant insert on table "public"."qiraa_people" to "anon";

grant references on table "public"."qiraa_people" to "anon";

grant select on table "public"."qiraa_people" to "anon";

grant trigger on table "public"."qiraa_people" to "anon";

grant truncate on table "public"."qiraa_people" to "anon";

grant update on table "public"."qiraa_people" to "anon";

grant delete on table "public"."qiraa_people" to "authenticated";

grant insert on table "public"."qiraa_people" to "authenticated";

grant references on table "public"."qiraa_people" to "authenticated";

grant select on table "public"."qiraa_people" to "authenticated";

grant trigger on table "public"."qiraa_people" to "authenticated";

grant truncate on table "public"."qiraa_people" to "authenticated";

grant update on table "public"."qiraa_people" to "authenticated";

grant delete on table "public"."qiraa_people" to "service_role";

grant insert on table "public"."qiraa_people" to "service_role";

grant references on table "public"."qiraa_people" to "service_role";

grant select on table "public"."qiraa_people" to "service_role";

grant trigger on table "public"."qiraa_people" to "service_role";

grant truncate on table "public"."qiraa_people" to "service_role";

grant update on table "public"."qiraa_people" to "service_role";

grant delete on table "public"."qiraa_people_career" to "anon";

grant insert on table "public"."qiraa_people_career" to "anon";

grant references on table "public"."qiraa_people_career" to "anon";

grant select on table "public"."qiraa_people_career" to "anon";

grant trigger on table "public"."qiraa_people_career" to "anon";

grant truncate on table "public"."qiraa_people_career" to "anon";

grant update on table "public"."qiraa_people_career" to "anon";

grant delete on table "public"."qiraa_people_career" to "authenticated";

grant insert on table "public"."qiraa_people_career" to "authenticated";

grant references on table "public"."qiraa_people_career" to "authenticated";

grant select on table "public"."qiraa_people_career" to "authenticated";

grant trigger on table "public"."qiraa_people_career" to "authenticated";

grant truncate on table "public"."qiraa_people_career" to "authenticated";

grant update on table "public"."qiraa_people_career" to "authenticated";

grant delete on table "public"."qiraa_people_career" to "service_role";

grant insert on table "public"."qiraa_people_career" to "service_role";

grant references on table "public"."qiraa_people_career" to "service_role";

grant select on table "public"."qiraa_people_career" to "service_role";

grant trigger on table "public"."qiraa_people_career" to "service_role";

grant truncate on table "public"."qiraa_people_career" to "service_role";

grant update on table "public"."qiraa_people_career" to "service_role";

grant delete on table "public"."qiraa_people_education" to "anon";

grant insert on table "public"."qiraa_people_education" to "anon";

grant references on table "public"."qiraa_people_education" to "anon";

grant select on table "public"."qiraa_people_education" to "anon";

grant trigger on table "public"."qiraa_people_education" to "anon";

grant truncate on table "public"."qiraa_people_education" to "anon";

grant update on table "public"."qiraa_people_education" to "anon";

grant delete on table "public"."qiraa_people_education" to "authenticated";

grant insert on table "public"."qiraa_people_education" to "authenticated";

grant references on table "public"."qiraa_people_education" to "authenticated";

grant select on table "public"."qiraa_people_education" to "authenticated";

grant trigger on table "public"."qiraa_people_education" to "authenticated";

grant truncate on table "public"."qiraa_people_education" to "authenticated";

grant update on table "public"."qiraa_people_education" to "authenticated";

grant delete on table "public"."qiraa_people_education" to "service_role";

grant insert on table "public"."qiraa_people_education" to "service_role";

grant references on table "public"."qiraa_people_education" to "service_role";

grant select on table "public"."qiraa_people_education" to "service_role";

grant trigger on table "public"."qiraa_people_education" to "service_role";

grant truncate on table "public"."qiraa_people_education" to "service_role";

grant update on table "public"."qiraa_people_education" to "service_role";

grant delete on table "public"."qiraa_transactions" to "anon";

grant insert on table "public"."qiraa_transactions" to "anon";

grant references on table "public"."qiraa_transactions" to "anon";

grant select on table "public"."qiraa_transactions" to "anon";

grant trigger on table "public"."qiraa_transactions" to "anon";

grant truncate on table "public"."qiraa_transactions" to "anon";

grant update on table "public"."qiraa_transactions" to "anon";

grant delete on table "public"."qiraa_transactions" to "authenticated";

grant insert on table "public"."qiraa_transactions" to "authenticated";

grant references on table "public"."qiraa_transactions" to "authenticated";

grant select on table "public"."qiraa_transactions" to "authenticated";

grant trigger on table "public"."qiraa_transactions" to "authenticated";

grant truncate on table "public"."qiraa_transactions" to "authenticated";

grant update on table "public"."qiraa_transactions" to "authenticated";

grant delete on table "public"."qiraa_transactions" to "service_role";

grant insert on table "public"."qiraa_transactions" to "service_role";

grant references on table "public"."qiraa_transactions" to "service_role";

grant select on table "public"."qiraa_transactions" to "service_role";

grant trigger on table "public"."qiraa_transactions" to "service_role";

grant truncate on table "public"."qiraa_transactions" to "service_role";

grant update on table "public"."qiraa_transactions" to "service_role";

grant delete on table "public"."sp_api_config" to "anon";

grant insert on table "public"."sp_api_config" to "anon";

grant references on table "public"."sp_api_config" to "anon";

grant select on table "public"."sp_api_config" to "anon";

grant trigger on table "public"."sp_api_config" to "anon";

grant truncate on table "public"."sp_api_config" to "anon";

grant update on table "public"."sp_api_config" to "anon";

grant delete on table "public"."sp_api_config" to "authenticated";

grant insert on table "public"."sp_api_config" to "authenticated";

grant references on table "public"."sp_api_config" to "authenticated";

grant select on table "public"."sp_api_config" to "authenticated";

grant trigger on table "public"."sp_api_config" to "authenticated";

grant truncate on table "public"."sp_api_config" to "authenticated";

grant update on table "public"."sp_api_config" to "authenticated";

grant delete on table "public"."sp_api_config" to "service_role";

grant insert on table "public"."sp_api_config" to "service_role";

grant references on table "public"."sp_api_config" to "service_role";

grant select on table "public"."sp_api_config" to "service_role";

grant trigger on table "public"."sp_api_config" to "service_role";

grant truncate on table "public"."sp_api_config" to "service_role";

grant update on table "public"."sp_api_config" to "service_role";

grant delete on table "public"."sp_companies" to "anon";

grant insert on table "public"."sp_companies" to "anon";

grant references on table "public"."sp_companies" to "anon";

grant select on table "public"."sp_companies" to "anon";

grant trigger on table "public"."sp_companies" to "anon";

grant truncate on table "public"."sp_companies" to "anon";

grant update on table "public"."sp_companies" to "anon";

grant delete on table "public"."sp_companies" to "authenticated";

grant insert on table "public"."sp_companies" to "authenticated";

grant references on table "public"."sp_companies" to "authenticated";

grant select on table "public"."sp_companies" to "authenticated";

grant trigger on table "public"."sp_companies" to "authenticated";

grant truncate on table "public"."sp_companies" to "authenticated";

grant update on table "public"."sp_companies" to "authenticated";

grant delete on table "public"."sp_companies" to "service_role";

grant insert on table "public"."sp_companies" to "service_role";

grant references on table "public"."sp_companies" to "service_role";

grant select on table "public"."sp_companies" to "service_role";

grant trigger on table "public"."sp_companies" to "service_role";

grant truncate on table "public"."sp_companies" to "service_role";

grant update on table "public"."sp_companies" to "service_role";

grant delete on table "public"."sp_headcount" to "anon";

grant insert on table "public"."sp_headcount" to "anon";

grant references on table "public"."sp_headcount" to "anon";

grant select on table "public"."sp_headcount" to "anon";

grant trigger on table "public"."sp_headcount" to "anon";

grant truncate on table "public"."sp_headcount" to "anon";

grant update on table "public"."sp_headcount" to "anon";

grant delete on table "public"."sp_headcount" to "authenticated";

grant insert on table "public"."sp_headcount" to "authenticated";

grant references on table "public"."sp_headcount" to "authenticated";

grant select on table "public"."sp_headcount" to "authenticated";

grant trigger on table "public"."sp_headcount" to "authenticated";

grant truncate on table "public"."sp_headcount" to "authenticated";

grant update on table "public"."sp_headcount" to "authenticated";

grant delete on table "public"."sp_headcount" to "service_role";

grant insert on table "public"."sp_headcount" to "service_role";

grant references on table "public"."sp_headcount" to "service_role";

grant select on table "public"."sp_headcount" to "service_role";

grant trigger on table "public"."sp_headcount" to "service_role";

grant truncate on table "public"."sp_headcount" to "service_role";

grant update on table "public"."sp_headcount" to "service_role";

grant delete on table "public"."sp_key_developments" to "anon";

grant insert on table "public"."sp_key_developments" to "anon";

grant references on table "public"."sp_key_developments" to "anon";

grant select on table "public"."sp_key_developments" to "anon";

grant trigger on table "public"."sp_key_developments" to "anon";

grant truncate on table "public"."sp_key_developments" to "anon";

grant update on table "public"."sp_key_developments" to "anon";

grant delete on table "public"."sp_key_developments" to "authenticated";

grant insert on table "public"."sp_key_developments" to "authenticated";

grant references on table "public"."sp_key_developments" to "authenticated";

grant select on table "public"."sp_key_developments" to "authenticated";

grant trigger on table "public"."sp_key_developments" to "authenticated";

grant truncate on table "public"."sp_key_developments" to "authenticated";

grant update on table "public"."sp_key_developments" to "authenticated";

grant delete on table "public"."sp_key_developments" to "service_role";

grant insert on table "public"."sp_key_developments" to "service_role";

grant references on table "public"."sp_key_developments" to "service_role";

grant select on table "public"."sp_key_developments" to "service_role";

grant trigger on table "public"."sp_key_developments" to "service_role";

grant truncate on table "public"."sp_key_developments" to "service_role";

grant update on table "public"."sp_key_developments" to "service_role";

grant delete on table "public"."sp_mena_countries" to "anon";

grant insert on table "public"."sp_mena_countries" to "anon";

grant references on table "public"."sp_mena_countries" to "anon";

grant select on table "public"."sp_mena_countries" to "anon";

grant trigger on table "public"."sp_mena_countries" to "anon";

grant truncate on table "public"."sp_mena_countries" to "anon";

grant update on table "public"."sp_mena_countries" to "anon";

grant delete on table "public"."sp_mena_countries" to "authenticated";

grant insert on table "public"."sp_mena_countries" to "authenticated";

grant references on table "public"."sp_mena_countries" to "authenticated";

grant select on table "public"."sp_mena_countries" to "authenticated";

grant trigger on table "public"."sp_mena_countries" to "authenticated";

grant truncate on table "public"."sp_mena_countries" to "authenticated";

grant update on table "public"."sp_mena_countries" to "authenticated";

grant delete on table "public"."sp_mena_countries" to "service_role";

grant insert on table "public"."sp_mena_countries" to "service_role";

grant references on table "public"."sp_mena_countries" to "service_role";

grant select on table "public"."sp_mena_countries" to "service_role";

grant trigger on table "public"."sp_mena_countries" to "service_role";

grant truncate on table "public"."sp_mena_countries" to "service_role";

grant update on table "public"."sp_mena_countries" to "service_role";

grant delete on table "public"."sp_mena_entity_cache" to "anon";

grant insert on table "public"."sp_mena_entity_cache" to "anon";

grant references on table "public"."sp_mena_entity_cache" to "anon";

grant select on table "public"."sp_mena_entity_cache" to "anon";

grant trigger on table "public"."sp_mena_entity_cache" to "anon";

grant truncate on table "public"."sp_mena_entity_cache" to "anon";

grant update on table "public"."sp_mena_entity_cache" to "anon";

grant delete on table "public"."sp_mena_entity_cache" to "authenticated";

grant insert on table "public"."sp_mena_entity_cache" to "authenticated";

grant references on table "public"."sp_mena_entity_cache" to "authenticated";

grant select on table "public"."sp_mena_entity_cache" to "authenticated";

grant trigger on table "public"."sp_mena_entity_cache" to "authenticated";

grant truncate on table "public"."sp_mena_entity_cache" to "authenticated";

grant update on table "public"."sp_mena_entity_cache" to "authenticated";

grant delete on table "public"."sp_mena_entity_cache" to "service_role";

grant insert on table "public"."sp_mena_entity_cache" to "service_role";

grant references on table "public"."sp_mena_entity_cache" to "service_role";

grant select on table "public"."sp_mena_entity_cache" to "service_role";

grant trigger on table "public"."sp_mena_entity_cache" to "service_role";

grant truncate on table "public"."sp_mena_entity_cache" to "service_role";

grant update on table "public"."sp_mena_entity_cache" to "service_role";

grant delete on table "public"."sp_professionals" to "anon";

grant insert on table "public"."sp_professionals" to "anon";

grant references on table "public"."sp_professionals" to "anon";

grant select on table "public"."sp_professionals" to "anon";

grant trigger on table "public"."sp_professionals" to "anon";

grant truncate on table "public"."sp_professionals" to "anon";

grant update on table "public"."sp_professionals" to "anon";

grant delete on table "public"."sp_professionals" to "authenticated";

grant insert on table "public"."sp_professionals" to "authenticated";

grant references on table "public"."sp_professionals" to "authenticated";

grant select on table "public"."sp_professionals" to "authenticated";

grant trigger on table "public"."sp_professionals" to "authenticated";

grant truncate on table "public"."sp_professionals" to "authenticated";

grant update on table "public"."sp_professionals" to "authenticated";

grant delete on table "public"."sp_professionals" to "service_role";

grant insert on table "public"."sp_professionals" to "service_role";

grant references on table "public"."sp_professionals" to "service_role";

grant select on table "public"."sp_professionals" to "service_role";

grant trigger on table "public"."sp_professionals" to "service_role";

grant truncate on table "public"."sp_professionals" to "service_role";

grant update on table "public"."sp_professionals" to "service_role";

grant delete on table "public"."sp_sync_log" to "anon";

grant insert on table "public"."sp_sync_log" to "anon";

grant references on table "public"."sp_sync_log" to "anon";

grant select on table "public"."sp_sync_log" to "anon";

grant trigger on table "public"."sp_sync_log" to "anon";

grant truncate on table "public"."sp_sync_log" to "anon";

grant update on table "public"."sp_sync_log" to "anon";

grant delete on table "public"."sp_sync_log" to "authenticated";

grant insert on table "public"."sp_sync_log" to "authenticated";

grant references on table "public"."sp_sync_log" to "authenticated";

grant select on table "public"."sp_sync_log" to "authenticated";

grant trigger on table "public"."sp_sync_log" to "authenticated";

grant truncate on table "public"."sp_sync_log" to "authenticated";

grant update on table "public"."sp_sync_log" to "authenticated";

grant delete on table "public"."sp_sync_log" to "service_role";

grant insert on table "public"."sp_sync_log" to "service_role";

grant references on table "public"."sp_sync_log" to "service_role";

grant select on table "public"."sp_sync_log" to "service_role";

grant trigger on table "public"."sp_sync_log" to "service_role";

grant truncate on table "public"."sp_sync_log" to "service_role";

grant update on table "public"."sp_sync_log" to "service_role";

grant delete on table "public"."sp_transactions" to "anon";

grant insert on table "public"."sp_transactions" to "anon";

grant references on table "public"."sp_transactions" to "anon";

grant select on table "public"."sp_transactions" to "anon";

grant trigger on table "public"."sp_transactions" to "anon";

grant truncate on table "public"."sp_transactions" to "anon";

grant update on table "public"."sp_transactions" to "anon";

grant delete on table "public"."sp_transactions" to "authenticated";

grant insert on table "public"."sp_transactions" to "authenticated";

grant references on table "public"."sp_transactions" to "authenticated";

grant select on table "public"."sp_transactions" to "authenticated";

grant trigger on table "public"."sp_transactions" to "authenticated";

grant truncate on table "public"."sp_transactions" to "authenticated";

grant update on table "public"."sp_transactions" to "authenticated";

grant delete on table "public"."sp_transactions" to "service_role";

grant insert on table "public"."sp_transactions" to "service_role";

grant references on table "public"."sp_transactions" to "service_role";

grant select on table "public"."sp_transactions" to "service_role";

grant trigger on table "public"."sp_transactions" to "service_role";

grant truncate on table "public"."sp_transactions" to "service_role";

grant update on table "public"."sp_transactions" to "service_role";

grant delete on table "public"."strategic_features_decisions" to "anon";

grant insert on table "public"."strategic_features_decisions" to "anon";

grant references on table "public"."strategic_features_decisions" to "anon";

grant select on table "public"."strategic_features_decisions" to "anon";

grant trigger on table "public"."strategic_features_decisions" to "anon";

grant truncate on table "public"."strategic_features_decisions" to "anon";

grant update on table "public"."strategic_features_decisions" to "anon";

grant delete on table "public"."strategic_features_decisions" to "authenticated";

grant insert on table "public"."strategic_features_decisions" to "authenticated";

grant references on table "public"."strategic_features_decisions" to "authenticated";

grant select on table "public"."strategic_features_decisions" to "authenticated";

grant trigger on table "public"."strategic_features_decisions" to "authenticated";

grant truncate on table "public"."strategic_features_decisions" to "authenticated";

grant update on table "public"."strategic_features_decisions" to "authenticated";

grant delete on table "public"."strategic_features_decisions" to "service_role";

grant insert on table "public"."strategic_features_decisions" to "service_role";

grant references on table "public"."strategic_features_decisions" to "service_role";

grant select on table "public"."strategic_features_decisions" to "service_role";

grant trigger on table "public"."strategic_features_decisions" to "service_role";

grant truncate on table "public"."strategic_features_decisions" to "service_role";

grant update on table "public"."strategic_features_decisions" to "service_role";

grant delete on table "public"."subcategories" to "anon";

grant insert on table "public"."subcategories" to "anon";

grant references on table "public"."subcategories" to "anon";

grant select on table "public"."subcategories" to "anon";

grant trigger on table "public"."subcategories" to "anon";

grant truncate on table "public"."subcategories" to "anon";

grant update on table "public"."subcategories" to "anon";

grant delete on table "public"."subcategories" to "authenticated";

grant insert on table "public"."subcategories" to "authenticated";

grant references on table "public"."subcategories" to "authenticated";

grant select on table "public"."subcategories" to "authenticated";

grant trigger on table "public"."subcategories" to "authenticated";

grant truncate on table "public"."subcategories" to "authenticated";

grant update on table "public"."subcategories" to "authenticated";

grant delete on table "public"."subcategories" to "service_role";

grant insert on table "public"."subcategories" to "service_role";

grant references on table "public"."subcategories" to "service_role";

grant select on table "public"."subcategories" to "service_role";

grant trigger on table "public"."subcategories" to "service_role";

grant truncate on table "public"."subcategories" to "service_role";

grant update on table "public"."subcategories" to "service_role";

grant delete on table "public"."user_analytics" to "anon";

grant insert on table "public"."user_analytics" to "anon";

grant references on table "public"."user_analytics" to "anon";

grant select on table "public"."user_analytics" to "anon";

grant trigger on table "public"."user_analytics" to "anon";

grant truncate on table "public"."user_analytics" to "anon";

grant update on table "public"."user_analytics" to "anon";

grant delete on table "public"."user_analytics" to "authenticated";

grant insert on table "public"."user_analytics" to "authenticated";

grant references on table "public"."user_analytics" to "authenticated";

grant select on table "public"."user_analytics" to "authenticated";

grant trigger on table "public"."user_analytics" to "authenticated";

grant truncate on table "public"."user_analytics" to "authenticated";

grant update on table "public"."user_analytics" to "authenticated";

grant delete on table "public"."user_analytics" to "service_role";

grant insert on table "public"."user_analytics" to "service_role";

grant references on table "public"."user_analytics" to "service_role";

grant select on table "public"."user_analytics" to "service_role";

grant trigger on table "public"."user_analytics" to "service_role";

grant truncate on table "public"."user_analytics" to "service_role";

grant update on table "public"."user_analytics" to "service_role";


  create policy "Full Access for Manus 1"
  on "public"."analytics"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Published articles are viewable by everyone"
  on "public"."analytics"
  as permissive
  for select
  to public
using ((status = 'published'::public.article_status));



  create policy "Full Access for Manus 2"
  on "public"."categories"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Full Access for Manus 3"
  on "public"."market_indicators"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Full Access for Manus 4"
  on "public"."payments"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Full Access for Manus 5"
  on "public"."profiles"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Full Access for Manus 6"
  on "public"."reports"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "sp_config_service_only"
  on "public"."sp_api_config"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "sp_companies_read"
  on "public"."sp_companies"
  as permissive
  for select
  to public
using ((auth.role() = ANY (ARRAY['authenticated'::text, 'service_role'::text])));



  create policy "sp_companies_write"
  on "public"."sp_companies"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "sp_headcount_read"
  on "public"."sp_headcount"
  as permissive
  for select
  to public
using ((auth.role() = ANY (ARRAY['authenticated'::text, 'service_role'::text])));



  create policy "sp_headcount_write"
  on "public"."sp_headcount"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "sp_key_devs_read"
  on "public"."sp_key_developments"
  as permissive
  for select
  to public
using ((auth.role() = ANY (ARRAY['authenticated'::text, 'service_role'::text])));



  create policy "sp_key_devs_write"
  on "public"."sp_key_developments"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "sp_professionals_read"
  on "public"."sp_professionals"
  as permissive
  for select
  to public
using ((auth.role() = ANY (ARRAY['authenticated'::text, 'service_role'::text])));



  create policy "sp_professionals_write"
  on "public"."sp_professionals"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "sp_sync_log_read"
  on "public"."sp_sync_log"
  as permissive
  for select
  to public
using ((auth.role() = 'service_role'::text));



  create policy "sp_transactions_read"
  on "public"."sp_transactions"
  as permissive
  for select
  to public
using ((auth.role() = ANY (ARRAY['authenticated'::text, 'service_role'::text])));



  create policy "sp_transactions_write"
  on "public"."sp_transactions"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Enable ALL for service-role only"
  on "public"."strategic_features_decisions"
  as permissive
  for all
  to public
using (((auth.jwt() ->> 'role'::text) = 'service_role'::text));



  create policy "subcategories are viewable by everyone"
  on "public"."subcategories"
  as permissive
  for select
  to public
using (true);



  create policy "Full Access for Manus 7"
  on "public"."user_analytics"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Users can insert own reading history"
  on "public"."user_analytics"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own reading history"
  on "public"."user_analytics"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Full Access for Manus 8"
  on "public"."user_reports"
  as permissive
  for all
  to anon
using (true)
with check (true);



  create policy "Full Access for Manus 9"
  on "public"."user_roles"
  as permissive
  for all
  to anon
using (true)
with check (true);


CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_sp_companies_updated BEFORE UPDATE ON public.sp_companies FOR EACH ROW EXECUTE FUNCTION public.qiraa_set_updated_at();


  create policy "Full Access for Manus 10 19msfxb_0"
  on "storage"."objects"
  as permissive
  for select
  to anon
using ((bucket_id = 'Reports'::text));



  create policy "Full Access for Manus 10 19msfxb_1"
  on "storage"."objects"
  as permissive
  for insert
  to anon
with check ((bucket_id = 'Reports'::text));



  create policy "Full Access for Manus 10 19msfxb_2"
  on "storage"."objects"
  as permissive
  for update
  to anon
using ((bucket_id = 'Reports'::text));



  create policy "Full Access for Manus 10 19msfxb_3"
  on "storage"."objects"
  as permissive
  for delete
  to anon
using ((bucket_id = 'Reports'::text));



  create policy "Full Access for Manus 11 1g25mwo_0"
  on "storage"."objects"
  as permissive
  for select
  to anon
using ((bucket_id = 'QIRAA_News'::text));



  create policy "Full Access for Manus 11 1g25mwo_1"
  on "storage"."objects"
  as permissive
  for insert
  to anon
with check ((bucket_id = 'QIRAA_News'::text));



  create policy "Full Access for Manus 11 1g25mwo_2"
  on "storage"."objects"
  as permissive
  for update
  to anon
using ((bucket_id = 'QIRAA_News'::text));



  create policy "Full Access for Manus 11 1g25mwo_3"
  on "storage"."objects"
  as permissive
  for delete
  to anon
using ((bucket_id = 'QIRAA_News'::text));



  create policy "Full Access for Manus 12 1j0tuqh_0"
  on "storage"."objects"
  as permissive
  for select
  to anon
using ((bucket_id = 'articles_image'::text));



  create policy "Full Access for Manus 12 1j0tuqh_1"
  on "storage"."objects"
  as permissive
  for insert
  to anon
with check ((bucket_id = 'articles_image'::text));



  create policy "Full Access for Manus 12 1j0tuqh_2"
  on "storage"."objects"
  as permissive
  for update
  to anon
using ((bucket_id = 'articles_image'::text));



  create policy "Full Access for Manus 12 1j0tuqh_3"
  on "storage"."objects"
  as permissive
  for delete
  to anon
using ((bucket_id = 'articles_image'::text));



