alter table "public"."qiraa_people_career" drop constraint "qiraa_career_unique";

drop index if exists "public"."qiraa_career_unique";

alter table "public"."qiraa_companies" add column "diffbot_id" text;

alter table "public"."qiraa_inv_organizations" add column "aum_usd" numeric;

alter table "public"."qiraa_inv_organizations" add column "fund_size_usd" numeric;

alter table "public"."qiraa_inv_organizations" add column "geographies_focus" text;

alter table "public"."qiraa_inv_organizations" add column "latest_fund_year" integer;

alter table "public"."qiraa_inv_organizations" add column "linkedin_url" text;

alter table "public"."qiraa_inv_organizations" add column "sectors_focus" text;

alter table "public"."qiraa_inv_organizations" add column "stages_focus" text;

alter table "public"."qiraa_inv_organizations" add column "website_url" text;

alter table "public"."qiraa_transactions" add column "lead_investor_uuid" text;

alter table "public"."qiraa_transactions" add column "sp_enriched" boolean default false;

CREATE UNIQUE INDEX idx_career_unique ON public.qiraa_people_career USING btree (person_uuid, org_uuid, year_start) WHERE ((org_uuid IS NOT NULL) AND (year_start IS NOT NULL));

CREATE UNIQUE INDEX qiraa_companies_diffbot_id_key ON public.qiraa_companies USING btree (diffbot_id);

alter table "public"."qiraa_companies" add constraint "qiraa_companies_diffbot_id_key" UNIQUE using index "qiraa_companies_diffbot_id_key";


