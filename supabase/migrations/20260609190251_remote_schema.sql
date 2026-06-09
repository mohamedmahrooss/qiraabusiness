CREATE INDEX idx_analytics_country ON public.analytics USING btree (country);

CREATE INDEX idx_co_funding ON public.qiraa_companies USING btree (total_funding_usd DESC NULLS LAST);

CREATE INDEX idx_co_name_gin ON public.qiraa_companies USING gin (to_tsvector('simple'::regconfig, COALESCE(name, ''::text)));

CREATE INDEX idx_co_sector_country ON public.qiraa_companies USING btree (sector_main, country);

CREATE INDEX idx_co_status ON public.qiraa_companies USING btree (company_status);

CREATE INDEX idx_tx_company_uuid ON public.qiraa_transactions USING btree (company_uuid);

CREATE INDEX idx_tx_country_year ON public.qiraa_transactions USING btree (country, round_year DESC);

CREATE INDEX idx_tx_round_year ON public.qiraa_transactions USING btree (round_year DESC, round_month DESC);

CREATE INDEX idx_tx_sector ON public.qiraa_transactions USING btree (sector_main);


