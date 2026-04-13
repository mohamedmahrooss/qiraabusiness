import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GeoPriceData {
  country_code: string;
  currency: string;
  prices: Record<string, { monthly: number; annual: number }>;
  is_egyptian: boolean;
}

const DEFAULT_DATA: GeoPriceData = {
  country_code: "US",
  currency: "USD",
  prices: {
    basic: { monthly: 5, annual: 48 },
    pro: { monthly: 19, annual: 182 },
    enterprise: { monthly: 65, annual: 624 },
    topup: { monthly: 15, annual: 15 },
  },
  is_egyptian: false,
};

let cachedData: GeoPriceData | null = null;

export const useGeoPrice = () => {
  const [data, setData] = useState<GeoPriceData>(cachedData || DEFAULT_DATA);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;

    const fetch = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke("geo-pricing");
        if (!error && result) {
          cachedData = result as GeoPriceData;
          setData(cachedData);
        }
      } catch {
        // fallback to defaults
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { ...data, loading };
};
