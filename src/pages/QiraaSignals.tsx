import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, HelpCircle, Lock, Download, BarChart3, PieChart as PieChartIcon, DollarSign, ShoppingCart } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type MarketIndicator = Database['public']['Tables']['market_indicators']['Row'] & {
  store_products?: number;
};

const QiraaSignals = () => {
  const { isRTL } = useLanguage();
  const t = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedMainSector, setSelectedMainSector] = useState("");
  const [selectedSubSector, setSelectedSubSector] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("sector-average");
  const [isMonthlyView, setIsMonthlyView] = useState(true);
  const [firstMonth, setFirstMonth] = useState("");
  const [secondMonth, setSecondMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketIndicator[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [mainSectors, setMainSectors] = useState<string[]>([]);
  const [subSectors, setSubSectors] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [showRevenue, setShowRevenue] = useState(true);

  // جلب البيانات الفريدة للفلاتر
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: indicators, error } = await supabase
          .from('market_indicators')
          .select('country, main_sector, sub_sector, company_name');

        if (error) throw error;

        if (indicators) {
          const uniqueCountries = [...new Set(indicators.map(i => i.country))].filter(Boolean);
          const uniqueSectors = [...new Set(indicators.map(i => i.main_sector))].filter(Boolean);
          setCountries(uniqueCountries);
          setMainSectors(uniqueSectors);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Cascading Filters: تحديث القطاعات والقطاعات الفرعية والشركات عند تغيير الدولة
  useEffect(() => {
    const fetchCascadingFilters = async () => {
      if (!selectedCountry) {
        setMainSectors([]);
        setSubSectors([]);
        setCompanies([]);
        return;
      }

      try {
        const { data: indicators, error } = await supabase
          .from('market_indicators')
          .select('main_sector, sub_sector, company_name')
          .eq('country', selectedCountry);

        if (error) throw error;

        if (indicators) {
          const uniqueSectors = [...new Set(indicators.map(i => i.main_sector))].filter(Boolean);
          setMainSectors(uniqueSectors);
          
          // إعادة تعيين الفلاتر التالية
          setSelectedMainSector("");
          setSelectedSubSector("");
          setSelectedCompany("sector-average");
        }
      } catch (error) {
        console.error('Error fetching cascading filters:', error);
      }
    };

    fetchCascadingFilters();
  }, [selectedCountry]);

  // تحديث القطاعات الفرعية عند تغيير القطاع الرئيسي
  useEffect(() => {
    const fetchSubSectors = async () => {
      if (!selectedMainSector || !selectedCountry) {
        setSubSectors([]);
        return;
      }

      try {
        const { data: indicators, error } = await supabase
          .from('market_indicators')
          .select('sub_sector')
          .eq('country', selectedCountry)
          .eq('main_sector', selectedMainSector);

        if (error) throw error;

        if (indicators) {
          const unique = [...new Set(indicators.map(i => i.sub_sector))].filter(Boolean) as string[];
          setSubSectors(unique);
          
          // إعادة تعيين الفلاتر التالية
          setSelectedSubSector("");
          setSelectedCompany("sector-average");
        }
      } catch (error) {
        console.error('Error fetching sub sectors:', error);
      }
    };

    fetchSubSectors();
  }, [selectedMainSector, selectedCountry]);

  // تحديث الشركات عند تغيير القطاع الفرعي
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!selectedSubSector || !selectedCountry) {
        setCompanies([]);
        return;
      }

      try {
        const { data: indicators, error } = await supabase
          .from('market_indicators')
          .select('company_name')
          .eq('country', selectedCountry)
          .eq('sub_sector', selectedSubSector);

        if (error) throw error;

        if (indicators) {
          const unique = [...new Set(indicators.map(i => i.company_name))].filter(Boolean) as string[];
          setCompanies(unique);
          
          // إعادة تعيين الشركة
          setSelectedCompany("sector-average");
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [selectedSubSector, selectedCountry]);

  // جلب البيانات بناءً على الفلاتر
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from('market_indicators').select('*');

        if (selectedCountry) query = query.eq('country', selectedCountry);
        if (selectedMainSector) query = query.eq('main_sector', selectedMainSector);
        if (selectedSubSector) query = query.eq('sub_sector', selectedSubSector);
        if (selectedCompany && selectedCompany !== 'sector-average') {
          query = query.eq('company_name', selectedCompany);
        }

        const { data: indicators, error } = await query;

        if (error) throw error;

        setData(indicators || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(isRTL ? 'خطأ في جلب البيانات' : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry, selectedMainSector, selectedSubSector, selectedCompany]);

  const months = isRTL 
    ? ["يناير 2025", "فبراير 2025", "مارس 2025", "أبريل 2025", "مايو 2025", "يونيو 2025", "يوليو 2025", "أغسطس 2025", "سبتمبر 2025", "أكتوبر 2025", "نوفمبر 2025", "ديسمبر 2025"]
    : ["January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025"];

  const years = ["2022", "2023", "2024", "2025"];

  // استخراج بيانات الشهر من MarketIndicator
  const getMonthData = (monthString: string) => {
    const monthIndex = months.indexOf(monthString);
    if (monthIndex === -1) return null;

    const monthNum = monthIndex + 1;
    const year = parseInt(selectedYear);

    return data.find(d => d.month === monthNum && d.year === year);
  };

  // حساب البيانات للشهر الأول والثاني
  const firstMonthData = firstMonth ? getMonthData(firstMonth) : null;
  const secondMonthData = secondMonth ? getMonthData(secondMonth) : null;

  // حساب التغيير بين الشهرين
  const calculateChange = (val1: number, val2: number) => {
    if (val1 === 0) return 0;
    return ((val2 - val1) / val1) * 100;
  };

  const monthlyKPIs = {
    totalRevenue: {
      month1: firstMonthData?.total_revenue || 0,
      month2: secondMonthData?.total_revenue || 0,
      change: firstMonthData && secondMonthData 
        ? calculateChange(firstMonthData.total_revenue, secondMonthData.total_revenue) 
        : 0
    },
    totalSales: {
      month1: firstMonthData?.total_sales || 0,
      month2: secondMonthData?.total_sales || 0,
      change: firstMonthData && secondMonthData 
        ? calculateChange(firstMonthData.total_sales, secondMonthData.total_sales) 
        : 0
    }
  };

  // تحويل بيانات الإيرادات اليومية والمبيعات للرسم البياني
  const getDailyData = () => {
    if (!firstMonthData) return [];

    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dayKey = `day_${i}_revenue` as keyof MarketIndicator;
      const month1Revenue = firstMonthData?.[dayKey] as number | null;
      const month2Revenue = secondMonthData?.[dayKey] as number | null;

      if (month1Revenue !== null || month2Revenue !== null) {
        days.push({
          day: i,
          month1Revenue: month1Revenue || 0,
          month2Revenue: month2Revenue || 0,
          // تقدير المبيعات اليومية (يمكن تعديله حسب البيانات الفعلية)
          month1Sales: month1Revenue ? Math.round(month1Revenue / 100) : 0,
          month2Sales: month2Revenue ? Math.round(month2Revenue / 100) : 0,
        });
      }
    }
    return days;
  };

  const dailyData = getDailyData();

  // البيانات السنوية
  const getAnnualData = () => {
    const year = parseInt(selectedYear);
    const yearData = data.filter(d => d.year === year);

    const totalRevenue = yearData.reduce((sum, d) => sum + d.total_revenue, 0);
    const totalSales = yearData.reduce((sum, d) => sum + d.total_sales, 0);

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const quarterlyData = quarters.map(q => {
      const qData = yearData.filter(d => d.quarter === q);
      return {
        quarter: q,
        revenue: qData.reduce((sum, d) => sum + (d.quarterly_revenue || 0), 0)
      };
    });

    const bestQuarter = quarterlyData.reduce((max, q) => 
      q.revenue > max.revenue ? q : max, quarterlyData[0]
    );

    return {
      totalRevenue,
      totalSales,
      bestQuarter: bestQuarter?.quarter || 'Q1',
      quarterlyData
    };
  };

  const annualData = getAnnualData();

  // بيانات الحصة السوقية
  const marketShareData = secondMonthData?.market_share_percentage 
    ? [
        { name: t.selectedCompany, value: secondMonthData.market_share_percentage, color: "#8b5cf6" },
        { name: t.competitors, value: 100 - secondMonthData.market_share_percentage, color: "#e5e7eb" }
      ]
    : [
        { name: t.selectedCompany, value: 35, color: "#8b5cf6" },
        { name: t.competitors, value: 65, color: "#e5e7eb" }
      ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const KPICard = ({ title, value, tooltip, currency = false }: {
    title: string;
    value: number;
    tooltip: string;
    currency?: boolean;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency ? formatCurrency(value) : value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );

  // Custom Tooltip للرسم البياني
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold mb-2">
            {isRTL ? `اليوم ${label}` : `Day ${label}`}
          </p>
          
          {showRevenue ? (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm">
                    {isRTL ? 'الشهر الأول' : 'First Month'}:
                  </span>
                  <span className="font-bold">{formatCurrency(payload[0]?.value || 0)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="h-3 w-3" />
                  <span>{isRTL ? 'المبيعات' : 'Sales'}:</span>
                  <span>{Math.round((payload[0]?.value || 0) / 100).toLocaleString()}</span>
                </div>
              </div>
              
              {payload[1] && (
                <>
                  <div className="border-t border-border my-2"></div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">
                        {isRTL ? 'الشهر الثاني' : 'Second Month'}:
                      </span>
                      <span className="font-bold">{formatCurrency(payload[1]?.value || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShoppingCart className="h-3 w-3" />
                      <span>{isRTL ? 'المبيعات' : 'Sales'}:</span>
                      <span>{Math.round((payload[1]?.value || 0) / 100).toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm">
                    {isRTL ? 'الشهر الأول' : 'First Month'}:
                  </span>
                  <span className="font-bold">{(payload[0]?.value || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span>{isRTL ? 'الإيرادات' : 'Revenue'}:</span>
                  <span>{formatCurrency((payload[0]?.value || 0) * 100)}</span>
                </div>
              </div>
              
              {payload[1] && (
                <>
                  <div className="border-t border-border my-2"></div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">
                        {isRTL ? 'الشهر الثاني' : 'Second Month'}:
                      </span>
                      <span className="font-bold">{(payload[1]?.value || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>{isRTL ? 'الإيرادات' : 'Revenue'}:</span>
                      <span>{formatCurrency((payload[1]?.value || 0) * 100)}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t.qiraaSignalsTitle}
          </h1>
          <h2 className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t.qiraaSignalsSubtitle}
          </h2>
        </div>

        {/* Filters Panel */}
        <Card>
          <CardHeader>
            <CardTitle>{t.filtersControlPanel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.country}</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectCountry} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.mainSector}</label>
                <Select 
                  value={selectedMainSector} 
                  onValueChange={setSelectedMainSector}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectSector} />
                  </SelectTrigger>
                  <SelectContent>
                    {mainSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.subSector}</label>
                <Select 
                  value={selectedSubSector} 
                  onValueChange={setSelectedSubSector}
                  disabled={!selectedMainSector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectSubSector} />
                  </SelectTrigger>
                  <SelectContent>
                    {subSectors.map((subSector) => (
                      <SelectItem key={subSector} value={subSector}>{subSector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.companyName}</label>
                <Select 
                  value={selectedCompany} 
                  onValueChange={setSelectedCompany}
                  disabled={!selectedSubSector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectCompany} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sector-average">{t.sectorAverage}</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                {isRTL 
                  ? "ملاحظة: هذه المبيعات والإيرادات تقديرية وتعكس مبيعات الموقع الإلكتروني فقط."
                  : "Note: These sales and revenues are estimates and reflect online store sales only."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data View Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <span className={`text-sm font-medium ${!isMonthlyView ? 'text-muted-foreground' : ''}`}>
                {t.monthlyView}
              </span>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${!isMonthlyView ? 'bg-primary' : 'bg-input'}`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    !isMonthlyView 
                      ? (isRTL ? 'translate-x-6' : 'translate-x-6') 
                      : (isRTL ? 'translate-x-1' : 'translate-x-1')
                  }`}
                />
                <button
                  className="absolute inset-0 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => setIsMonthlyView(!isMonthlyView)}
                  aria-label={isRTL ? "تبديل العرض" : "Toggle view"}
                />
              </div>
              <span className={`text-sm font-medium ${isMonthlyView ? 'text-muted-foreground' : ''}`}>
                {t.annualView}
              </span>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </CardContent>
          </Card>
        )}

        {/* Monthly View */}
        {isMonthlyView && !loading && (
          <div className="space-y-6">
            {/* Date Selectors */}
            <Card>
              <CardHeader>
                <CardTitle>{t.selectMonthsComparison}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.selectFirstMonth}</label>
                    <Select value={firstMonth} onValueChange={setFirstMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectFirstMonth} />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t.selectSecondMonth}</label>
                    <Select value={secondMonth} onValueChange={setSecondMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSecondMonth} />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs - عرض فوري للشهر الأول */}
            {firstMonthData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard
                  title={t.totalRevenue}
                  value={firstMonthData.total_revenue}
                  tooltip={t.totalRevenueTooltip}
                  currency={true}
                />
                <KPICard
                  title={t.totalSales}
                  value={firstMonthData.total_sales}
                  tooltip={t.totalSalesTooltip}
                />
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isRTL ? "المنتجات المتاحة" : "Store Products"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {firstMonthData.store_products?.toLocaleString() || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Toggle بين الإيرادات والمبيعات */}
            {dailyData.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {showRevenue 
                        ? (isRTL ? "الإيرادات اليومية" : "Daily Revenue")
                        : (isRTL ? "المبيعات اليومية" : "Daily Sales")}
                    </CardTitle>
                    
                    {/* أزرار التبديل */}
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant={showRevenue ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowRevenue(true)}
                        className="gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        {isRTL ? "الإيرادات" : "Revenue"}
                      </Button>
                      <Button
                        variant={!showRevenue ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowRevenue(false)}
                        className="gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {isRTL ? "المبيعات" : "Sales"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      {showRevenue ? (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="month1Revenue" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2} 
                            name={isRTL ? "الشهر الأول" : "First Month"}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          {secondMonthData && (
                            <Line 
                              type="monotone" 
                              dataKey="month2Revenue" 
                              stroke="#10b981" 
                              strokeWidth={2} 
                              name={isRTL ? "الشهر الثاني" : "Second Month"}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="month1Sales" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2} 
                            name={isRTL ? "الشهر الأول" : "First Month"}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          {secondMonthData && (
                            <Line 
                              type="monotone" 
                              dataKey="month2Sales" 
                              stroke="#10b981" 
                              strokeWidth={2} 
                              name={isRTL ? "الشهر الثاني" : "Second Month"}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          )}
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Annual View */}
        {!isMonthlyView && !loading && (
          <div className="space-y-6">
            {/* Year Selector */}
            <Card>
              <CardHeader>
                <CardTitle>{t.selectYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectYearLabel} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Annual Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t.totalAnnualRevenue}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(annualData.totalRevenue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t.totalAnnualSales}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{annualData.totalSales.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t.bestQuarter}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{annualData.bestQuarter}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{isRTL ? "المنتجات المتاحة" : "Store Products"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.filter(d => d.year === parseInt(selectedYear))
                      .reduce((sum, d) => sum + (d.store_products || 0), 0)
                      .toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quarterly Revenue Chart */}
            {annualData.quarterlyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t.quarterlyRevenue} (USD)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full" style={{ maxWidth: '100%' }}>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={annualData.quarterlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quarter" />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Advanced Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t.advancedAnalysis}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Market Share */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                {t.marketShareAnalysis}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Export Data */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    {t.exportData}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.exportDataDescription}
                  </p>
                </div>
                <Button disabled variant="outline" className="gap-2">
                  <Lock className="h-4 w-4" />
                  {t.proFeature}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QiraaSignals;
