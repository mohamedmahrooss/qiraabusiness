-- إنشاء جدول مؤشرات السوق (QIRAA Signals)
CREATE TABLE public.market_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  main_sector TEXT NOT NULL,
  sub_sector TEXT,
  company_name TEXT,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  
  -- بيانات الإيرادات اليومية (حتى 31 يوم)
  day_1_revenue NUMERIC,
  day_2_revenue NUMERIC,
  day_3_revenue NUMERIC,
  day_4_revenue NUMERIC,
  day_5_revenue NUMERIC,
  day_6_revenue NUMERIC,
  day_7_revenue NUMERIC,
  day_8_revenue NUMERIC,
  day_9_revenue NUMERIC,
  day_10_revenue NUMERIC,
  day_11_revenue NUMERIC,
  day_12_revenue NUMERIC,
  day_13_revenue NUMERIC,
  day_14_revenue NUMERIC,
  day_15_revenue NUMERIC,
  day_16_revenue NUMERIC,
  day_17_revenue NUMERIC,
  day_18_revenue NUMERIC,
  day_19_revenue NUMERIC,
  day_20_revenue NUMERIC,
  day_21_revenue NUMERIC,
  day_22_revenue NUMERIC,
  day_23_revenue NUMERIC,
  day_24_revenue NUMERIC,
  day_25_revenue NUMERIC,
  day_26_revenue NUMERIC,
  day_27_revenue NUMERIC,
  day_28_revenue NUMERIC,
  day_29_revenue NUMERIC,
  day_30_revenue NUMERIC,
  day_31_revenue NUMERIC,
  
  -- المؤشرات الإجمالية
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  total_sales INTEGER NOT NULL DEFAULT 0,
  
  -- البيانات الربعية
  quarter TEXT,
  quarterly_revenue NUMERIC,
  
  -- الحصة السوقية
  market_share_percentage NUMERIC,
  
  -- التواريخ
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين Row Level Security
ALTER TABLE public.market_indicators ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة البيانات
CREATE POLICY "Market indicators are viewable by everyone"
  ON public.market_indicators
  FOR SELECT
  USING (true);

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX idx_market_indicators_country ON public.market_indicators(country);
CREATE INDEX idx_market_indicators_sector ON public.market_indicators(main_sector, sub_sector);
CREATE INDEX idx_market_indicators_date ON public.market_indicators(year, month);
CREATE INDEX idx_market_indicators_company ON public.market_indicators(company_name);

-- تحديث updated_at تلقائياً
CREATE TRIGGER update_market_indicators_updated_at
  BEFORE UPDATE ON public.market_indicators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();