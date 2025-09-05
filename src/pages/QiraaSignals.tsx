import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, HelpCircle, Lock, Download, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";

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

  const countries = isRTL 
    ? ["مصر", "السعودية", "الإمارات", "المغرب", "الولايات المتحدة", "أستراليا", "كندا", "الهند", "لبنان"]
    : ["Egypt", "Saudi Arabia", "UAE", "Morocco", "USA", "Australia", "Canada", "India", "Lebanon"];
  
  const mainSectors = isRTL 
    ? ["النقل", "SaaS", "التكنولوجيا المالية", "الأزياء", "الأثاث", "الرياضة", "الجمال والعناية الشخصية", "الطعام والمشروبات", "الإلكترونيات", "التبريد", "الرعاية الصحية", "الزراعة", "الألعاب"]
    : ["Transportation", "SaaS", "Fintech", "Fashion", "Furniture", "Sports", "Beauty & Personal Care", "Food & Beverages", "Electronics", "Cooling", "Health Care", "Agriculture", "Toys"];
  
  const subSectorMap: { [key: string]: string[] } = isRTL ? {
    "SaaS": ["الملابس", "الإلكترونيات", "طعام الأطفال", "الوجبات الخفيفة", "المشروبات", "الألعاب", "الأجهزة المنزلية", "الأثاث", "إكسسوارات السيارات", "النظارات", "المجوهرات", "إكسسوارات الأزياء", "الحلويات والمخبوزات"],
    "التكنولوجيا المالية": ["المدفوعات الرقمية", "الاستثمار", "التأمين", "الائتمان"],
    "الأزياء": ["الملابس الرجالية", "الملابس النسائية", "الأحذية", "الحقائب", "الإكسسوارات"],
  } : {
    "SaaS": ["Apparel", "Electronics", "Baby Food", "Snacks", "Beverages", "Toys", "Home Appliances", "Furniture", "Car Accessories", "Eye Wear", "Jewelry", "Fashion Accessories", "Desserts & Bakery"],
    "Fintech": ["Digital Payments", "Investment", "Insurance", "Credit"],
    "Fashion": ["Men's Clothing", "Women's Clothing", "Shoes", "Bags", "Accessories"],
  };

  const months = isRTL 
    ? ["يناير 2025", "فبراير 2025", "مارس 2025", "أبريل 2025", "مايو 2025", "يونيو 2025", "يوليو 2025", "أغسطس 2025", "سبتمبر 2025", "أكتوبر 2025", "نوفمبر 2025", "ديسمبر 2025"]
    : ["January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025"];

  const years = ["2022", "2023", "2024", "2025"];

  // Mock data for demonstration
  const monthlyKPIs = {
    totalRevenue: { month1: 250000, month2: 285000, change: 14 },
    totalSales: { month1: 1250, month2: 1420, change: 13.6 },
    monthlyGrowth: { month1: 8.5, month2: 14, change: 5.5 }
  };

  const dailyRevenueData = [
    { day: "1", month1: 8500, month2: 9200 },
    { day: "5", month1: 9200, month2: 10100 },
    { day: "10", month1: 8800, month2: 9800 },
    { day: "15", month1: 9500, month2: 10500 },
    { day: "20", month1: 8900, month2: 9900 },
    { day: "25", month1: 9800, month2: 11200 },
    { day: "30", month1: 9100, month2: 10800 }
  ];

  const annualSummary = {
    totalRevenue: 3200000,
    totalSales: 16800,
    bestQuarter: "Q3",
    yearOverYearGrowth: 24.5
  };

  const quarterlyData = [
    { quarter: "Q1", revenue: 750000 },
    { quarter: "Q2", revenue: 820000 },
    { quarter: "Q3", revenue: 890000 },
    { quarter: "Q4", revenue: 740000 }
  ];

  const marketShareData = [
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
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
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
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{t.change}</span>
            <Badge variant={change > 0 ? "default" : "destructive"}>
              {change > 0 ? "+" : ""}{change}%
            </Badge>
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
                    {selectedMainSector && subSectorMap[selectedMainSector]?.map((subSector) => (
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
                    <SelectItem value="company1">{isRTL ? 'شركة المثال الأول' : 'Example Company 1'}</SelectItem>
                    <SelectItem value="company2">{isRTL ? 'شركة المثال الثاني' : 'Example Company 2'}</SelectItem>
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

        {/* Monthly View */}
        {isMonthlyView && (
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

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <KPICard
                title={t.monthlyGrowth}
                value={monthlyKPIs.monthlyGrowth.month2}
                previousValue={monthlyKPIs.monthlyGrowth.month1}
                change={monthlyKPIs.monthlyGrowth.change}
                tooltip={t.monthlyGrowthTooltip}
              />
            </div>

            {/* Daily Revenue Chart */}
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
          </div>
        )}

        {/* Annual View */}
        {!isMonthlyView && (
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
                  <div className="text-2xl font-bold">{formatCurrency(annualSummary.totalRevenue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t.totalAnnualSales}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{annualSummary.totalSales.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t.bestQuarter}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{annualSummary.bestQuarter}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t.yearOverYearGrowth}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{annualSummary.yearOverYearGrowth}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Quarterly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t.annualTrend}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="revenue" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Advanced Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t.advancedAnalysis}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Benchmarking */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t.companyBenchmarking}
              </h3>
              <p className="text-muted-foreground">
                {t.companyBenchmarkingDesc}
              </p>
              <Select>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder={t.selectCompaniesCompare} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comp1">{isRTL ? 'شركة المثال الأول' : 'Example Company 1'}</SelectItem>
                  <SelectItem value="comp2">{isRTL ? 'شركة المثال الثاني' : 'Example Company 2'}</SelectItem>
                  <SelectItem value="comp3">{isRTL ? 'شركة المثال الثالث' : 'Example Company 3'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Market Share Analysis */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                {t.marketShareAnalysis}
              </h3>
              <p className="text-muted-foreground">
                {t.marketShareDesc}
              </p>
              <div className="flex justify-center">
                <ResponsiveContainer width={300} height={200}>
                  <PieChart>
                    <Pie
                      data={marketShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {marketShareData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Data */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t.exportData}
              </h3>
              <p className="text-muted-foreground">
                {t.exportDataDesc}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <Download className="h-4 w-4" />
                      {t.exportToCsv}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.proFeature}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QiraaSignals;