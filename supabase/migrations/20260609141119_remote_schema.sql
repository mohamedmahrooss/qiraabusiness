alter table "public"."qiraa_transactions" drop constraint "dealroom_funding_rounds_unique";

drop index if exists "public"."dealroom_funding_rounds_unique";

alter table "public"."qiraa_companies" add column "departments_breakdown" jsonb;

alter table "public"."qiraa_companies" add column "estimated_revenue_usd" numeric;

alter table "public"."qiraa_companies" add column "latest_round_type" text;

alter table "public"."qiraa_companies" add column "latest_round_year" integer;

alter table "public"."qiraa_companies" add column "website_url" text;

alter table "public"."qiraa_people" add column "bio" text;

alter table "public"."qiraa_people" add column "full_name" text;

alter table "public"."qiraa_transactions" add column "investor_uuids_array" text[];

alter table "public"."qiraa_transactions" add column "round_valuation_max_usd" numeric;

alter table "public"."qiraa_transactions" add column "round_valuation_min_usd" numeric;

alter table "public"."qiraa_transactions" add column "round_valuation_usd" numeric;

CREATE UNIQUE INDEX idx_tx_exit_unique ON public.qiraa_transactions USING btree (company_uuid, exit_date) WHERE ((transaction_type <> 'funding_round'::text) AND (exit_date IS NOT NULL));

CREATE UNIQUE INDEX idx_tx_funding_unique ON public.qiraa_transactions USING btree (company_uuid, round_type, round_year, round_month) WHERE ((transaction_type = 'funding_round'::text) AND (exit_date IS NULL));

alter table "public"."qiraa_company_founders" add constraint "fk_cf_person" FOREIGN KEY (founder_uuid) REFERENCES qiraa_people(person_uuid) ON DELETE SET NULL not valid;

alter table "public"."qiraa_company_founders" validate constraint "fk_cf_person";

alter table "public"."qiraa_company_investors" add constraint "fk_ci_org" FOREIGN KEY (investor_uuid) REFERENCES qiraa_inv_organizations(org_uuid) ON DELETE SET NULL not valid;

alter table "public"."qiraa_company_investors" validate constraint "fk_ci_org";

alter table "public"."qiraa_transactions" add constraint "fk_tx_company" FOREIGN KEY (company_uuid) REFERENCES qiraa_companies(company_uuid) ON DELETE CASCADE not valid;

alter table "public"."qiraa_transactions" validate constraint "fk_tx_company";


