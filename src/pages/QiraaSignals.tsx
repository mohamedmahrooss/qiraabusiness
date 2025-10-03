import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, HelpCircle, Lock, Download, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MarketIndicator {
  id: string;
  country: string;
  main_sector: string;
  sub_sector: string | null;
  company_name: string | null;
  year: number;
  month: number;
  day_1_revenue: number | null;
  day_2_revenue: number | null;
  day_3_revenue: number | null;
  day_4_revenue: number | null;
  day_5_revenue: number | null;
  day_6_revenue: number | null;
  day_7_revenue: number | null;
  day_8_revenue: number | null;
  day_9_revenue: number | null;
  day_10_revenue: number | null;
  day_11_revenue: number | null;
  day_12_revenue: number | null;
  day_13_revenue: number | null;
  day_14_revenue: number | null;
  day_15_revenue: number | null;
  day_16_revenue: number | null;
  day_17_revenue: number | null;
  day_18_revenue: number | null;
  day_19_revenue: number | null;
  day_20_revenue: number | null;
  day_21_revenue: number | null;
  day_22_revenue: number | null;
  day_23_revenue: number | null;
  day_24_revenue: number | null;
  day_25_revenue: number | null;
  day_26_revenue: number | null;
  day_27_revenue: number | null;
  day_28_revenue: number | null;
  day_29_revenue: number | null;
  day_30_revenue: number | null;
  day_31_revenue: number | null;
  total_revenue: number;
  total_sales: number;
  quarter: string | null;
  quarterly_revenue: number | null;
  market_share_percentage: number | null;
}

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
  const [selectedYear, setSelectedYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketIndicator[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [mainSectors, setMainSectors] = useState<string[]>([]);
  const [subSectors, setSubSectors] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);

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

  // تحديث القطاعات الفرعية عند تغيير القطاع الرئيسي
  useEffect(() => {
    const fetchSubSectors = async () => {
      if (!selectedMainSector) {
        setSubSectors([]);
        return;
      }

      try {
        const { data: indicators, error } = await supabase
          .from('market_indicators')
          .select('sub_sector')
          .eq('main_sector', selectedMainSector);

        if (error) throw error;

        if (indicators) {
          const unique = [...new Set(indicators.map(i => i.sub_sector))].filter(Boolean) as string[];
          setSubSectors(unique);
        }
      } catch (error) {
        console.error('Error fetching sub sectors:', error);
      }
    };

    fetchSubSectors();
  }, [selectedMainSector]);

  // تحديث الشركات عند تغيير القطاع الفرعي
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!selectedSubSector) {
        setCompanies([]);
        return;
      }

      try {
        const { data: indicators, error } = await supabase
          .from('market_indicators')
          .select('company_name')
          .eq('sub_sector', selectedSubSector);

        if (error) throw error;

        if (indicators) {
          const unique = [...new Set(indicators.map(i => i.company_name))].filter(Boolean) as string[];
          setCompanies(unique);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [selectedSubSector]);

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

  // تحويل بيانات الإيرادات اليومية للرسم البياني
  const getDailyRevenueData = () => {
    if (!firstMonthData && !secondMonthData) return [];

    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dayKey = `day_${i}_revenue` as keyof MarketIndicator;
      const month1Value = firstMonthData?.[dayKey] as number | null;
      const month2Value = secondMonthData?.[dayKey] as number | null;

      if (month1Value !== null || month2Value !== null) {
        days.push({
          day: i.toString(),
          month1: month1Value || 0,
          month2: month2Value || 0
        });
      }
    }
    return days;
  };

  const dailyRevenueData = getDailyRevenueData();

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

  const KPICard = ({ title, value, previousValue, change, tooltip, currency = false }: {
    title: string;
    value: number;
    previousValue: number;
    change: number;
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
        {change > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : change < 0 ? (
          <TrendingDown className="h-4 w-4 text-red-600" />
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{t.firstMonth}</span>
            <span className="text-lg font-bold">
              {currency ? formatCurrency(previousValue) : previousValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{t.secondMonth}</span>
            <span className="text-lg font-bold">
              {currency ? formatCurrency(value) : value.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                <Select value={selectedMainSector} onValueChange={setSelectedMainSector}>
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
                <Select value={selectedSubSector} onValueChange={setSelectedSubSector}>
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
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
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

            {/* KPIs - حذف بطاقة معدل النمو الشهري */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KPICard
                title={t.totalRevenue}
                value={monthlyKPIs.totalRevenue.month2}
                previousValue={monthlyKPIs.totalRevenue.month1}
                change={monthlyKPIs.totalRevenue.change}
                tooltip={t.totalRevenueTooltip}
                currency={true}
              />
              <KPICard
                title={t.totalSales}
                value={monthlyKPIs.totalSales.month2}
                previousValue={monthlyKPIs.totalSales.month1}
                change={monthlyKPIs.totalSales.change}
                tooltip={t.totalSalesTooltip}
              />
            </div>

            {/* Daily Revenue Chart */}
            {dailyRevenueData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t.dailyRevenue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dailyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="month1" stroke="#8b5cf6" strokeWidth={2} name={isRTL ? "الشهر الأول" : "First Month"} />
                      <Line type="monotone" dataKey="month2" stroke="#10b981" strokeWidth={2} name={isRTL ? "الشهر الثاني" : "Second Month"} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>

            {/* Quarterly Revenue Chart */}
            {annualData.quarterlyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t.quarterlyRevenue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={annualData.quarterlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="revenue" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
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
