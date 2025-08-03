-- Clean existing categories and insert new custom categories for QIRAA platform

-- Delete all existing categories
DELETE FROM public.categories;

-- Insert new custom categories with English and Arabic support
INSERT INTO public.categories (name_en, name_ar, slug, description_en, description_ar) VALUES
(
  'Startup Trends',
  'اتجاهات الشركات الناشئة',
  'startup-trends',
  'Latest insights and trends in the startup ecosystem',
  'أحدث الرؤى والاتجاهات في نظام الشركات الناشئة'
),
(
  'MENA Markets',
  'أسواق الشرق الأوسط وشمال أفريقيا',
  'mena-markets',
  'Regional economic trends and market analysis for MENA region',
  'الاتجاهات الاقتصادية الإقليمية وتحليل السوق لمنطقة الشرق الأوسط وشمال أفريقيا'
),
(
  'AI & Data Analysis',
  'الذكاء الاصطناعي وتحليل البيانات',
  'ai-data-analysis',
  'Artificial intelligence trends and data-driven insights',
  'اتجاهات الذكاء الاصطناعي والرؤى المستندة إلى البيانات'
),
(
  'Investment Reports',
  'تقارير الاستثمار',
  'investment-reports',
  'Comprehensive investment analysis and market opportunities',
  'تحليل استثماري شامل وفرص السوق'
),
(
  'Consumer Behavior',
  'سلوك المستهلك',
  'consumer-behavior',
  'Understanding consumer patterns and market preferences',
  'فهم أنماط المستهلكين وتفضيلات السوق'
),
(
  'Market Entry Strategies',
  'استراتيجيات دخول السوق',
  'market-entry-strategies',
  'Strategic approaches for entering new markets',
  'المناهج الاستراتيجية لدخول الأسواق الجديدة'
),
(
  'Competitive Landscape',
  'تحليل المنافسة',
  'competitive-landscape',
  'Market competition analysis and competitive intelligence',
  'تحليل المنافسة في السوق والذكاء التنافسي'
);