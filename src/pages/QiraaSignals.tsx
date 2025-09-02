import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, HelpCircle, Lock, Download, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const QiraaSignals = () => {
  const { isRTL } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedMainSector, setSelectedMainSector] = useState("");
  const [selectedSubSector, setSelectedSubSector] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("sector-average");
  const [isMonthlyView, setIsMonthlyView] = useState(true);
  const [firstMonth, setFirstMonth] = useState("");
  const [secondMonth, setSecondMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");

  const countries = ["مصر", "السعودية", "الإمارات", "المغرب", "الولايات المتحدة", "أستراليا", "كندا", "الهند", "لبنان"];
  const mainSectors = ["النقل", "SaaS", "التكنولوجيا المالية", "الأزياء", "الأثاث", "الرياضة", "الجمال والعناية الشخصية", "الطعام والمشروبات", "الإلكترونيات", "التبريد", "الرعاية الصحية", "الزراعة", "الألعاب"];
  
  const subSectorMap: { [key: string]: string[] } = {
    "SaaS": ["الملابس", "الإلكترونيات", "طعام الأطفال", "الوجبات الخفيفة", "المشروبات", "الألعاب", "الأجهزة المنزلية", "الأثاث", "إكسسوارات السيارات", "النظارات", "المجوهرات", "إكسسوارات الأزياء", "الحلويات والمخبوزات"],
    "التكنولوجيا المالية": ["المدفوعات الرقمية", "الاستثمار", "التأمين", "الائتمان"],
    "الأزياء": ["الملابس الرجالية", "الملابس النسائية", "الأحذية", "الحقائب", "الإكسسوارات"],
  };

  const months = [
    "يناير 2025", "فبراير 2025", "مارس 2025", "أبريل 2025", "مايو 2025", "يونيو 2025",
    "يوليو 2025", "أغسطس 2025", "سبتمبر 2025", "أكتوبر 2025", "نوفمبر 2025", "ديسمبر 2025"
  ];

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
    { name: "الشركة المختارة", value: 35, color: "#8b5cf6" },
    { name: "المنافسون", value: 65, color: "#e5e7eb" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
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
            <span className="text-xs text-muted-foreground">الشهر الأول:</span>
            <span className="text-lg font-bold">
              {currency ? formatCurrency(previousValue) : previousValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">الشهر الثاني:</span>
            <span className="text-lg font-bold">
              {currency ? formatCurrency(value) : value.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">التغيير:</span>
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
            مؤشرات قراءة (QIRAA Signals)
          </h1>
          <h2 className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            بيانات مبيعات حصرية لاتخاذ قرارات استثمارية وتشغيلية أذكى في منطقة الشرق الأوسط وشمال أفريقيا
          </h2>
        </div>

        {/* Filters Panel */}
        <Card>
          <CardHeader>
            <CardTitle>لوحة التحكم والفلاتر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الدولة</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">القطاع الرئيسي</label>
                <Select value={selectedMainSector} onValueChange={setSelectedMainSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القطاع" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">القطاع الفرعي</label>
                <Select value={selectedSubSector} onValueChange={setSelectedSubSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القطاع الفرعي" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMainSector && subSectorMap[selectedMainSector]?.map((subSector) => (
                      <SelectItem key={subSector} value={subSector}>{subSector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">اسم الشركة</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sector-average">متوسط أداء القطاع</SelectItem>
                    <SelectItem value="company1">شركة المثال الأول</SelectItem>
                    <SelectItem value="company2">شركة المثال الثاني</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data View Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <span className={`text-sm font-medium ${!isMonthlyView ? 'text-muted-foreground' : ''}`}>
                نظرة شهرية
              </span>
              <Switch checked={!isMonthlyView} onCheckedChange={(checked) => setIsMonthlyView(!checked)} />
              <span className={`text-sm font-medium ${isMonthlyView ? 'text-muted-foreground' : ''}`}>
                نظرة سنوية
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
                <CardTitle>اختيار الأشهر للمقارنة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اختر الشهر الأول:</label>
                    <Select value={firstMonth} onValueChange={setFirstMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشهر الأول" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اختر الشهر الثاني للمقارنة:</label>
                    <Select value={secondMonth} onValueChange={setSecondMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الشهر الثاني" />
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
                title="إجمالي الإيرادات"
                value={monthlyKPIs.totalRevenue.month2}
                previousValue={monthlyKPIs.totalRevenue.month1}
                change={monthlyKPIs.totalRevenue.change}
                tooltip="إجمالي الإيرادات المحققة خلال الشهر بالعملة المحلية"
                currency={true}
              />
              <KPICard
                title="إجمالي المبيعات"
                value={monthlyKPIs.totalSales.month2}
                previousValue={monthlyKPIs.totalSales.month1}
                change={monthlyKPIs.totalSales.change}
                tooltip="عدد المبيعات الإجمالي المحقق خلال الشهر"
              />
              <KPICard
                title="معدل النمو الشهري"
                value={monthlyKPIs.monthlyGrowth.month2}
                previousValue={monthlyKPIs.monthlyGrowth.month1}
                change={monthlyKPIs.monthlyGrowth.change}
                tooltip="النسبة المئوية للتغيير في الإيرادات مقارنة بالشهر السابق"
              />
            </div>

            {/* Daily Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  الإيرادات اليومية (دولار أمريكي)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dailyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="month1" stroke="#8b5cf6" strokeWidth={2} name="الشهر الأول" />
                    <Line type="monotone" dataKey="month2" stroke="#10b981" strokeWidth={2} name="الشهر الثاني" />
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
                <CardTitle>اختيار السنة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر السنة" />
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
                  <CardTitle className="text-sm">إجمالي الإيرادات السنوية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(annualSummary.totalRevenue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إجمالي المبيعات السنوية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{annualSummary.totalSales.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">أفضل ربع أداءً</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{annualSummary.bestQuarter}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معدل النمو السنوي</CardTitle>
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
                  الاتجاه السنوي للإيرادات
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
            <CardTitle className="text-xl">أدوات تحليل متقدمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Benchmarking */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                مقارنة الشركات
              </h3>
              <p className="text-muted-foreground">
                اختر ما يصل إلى 3 شركات من نفس القطاع لمقارنة أدائها الشهري أو السنوي جنباً إلى جنب
              </p>
              <Select>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="اختر الشركات للمقارنة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comp1">شركة المثال الأول</SelectItem>
                  <SelectItem value="comp2">شركة المثال الثاني</SelectItem>
                  <SelectItem value="comp3">شركة المثال الثالث</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Market Share Analysis */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                تحليل الحصة السوقية
              </h3>
              <p className="text-muted-foreground">
                اكتشف الحصة السوقية المقدرة للشركة داخل قطاعها الفرعي
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
                تصدير البيانات
              </h3>
              <p className="text-muted-foreground">
                قم بتنزيل البيانات المحددة كملف CSV لتحليلاتك الخاصة
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <Download className="h-4 w-4" />
                      تصدير إلى CSV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ميزة متاحة في الخطة الاحترافية</p>
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