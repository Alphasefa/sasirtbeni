import { useEffect, useState } from "react";

export interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  updatedAt: Date;
}

const FALLBACK_RATES: ExchangeRates = {
  USD: 42.5,
  EUR: 46.5,
  GBP: 54.0,
  updatedAt: new Date(),
};

const CACHE_KEY = "currency_rates";

function getCachedRates(): ExchangeRates | null {
  if (typeof window === "undefined") return null;

  // Clear old cache on first run
  localStorage.removeItem(CACHE_KEY);

  return null;
}

function setCachedRates(rates: ExchangeRates): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      rates,
      timestamp: Date.now(),
    }),
  );
}

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const cached = getCachedRates();
  if (cached) return cached;

  try {
    const res = await fetch("/api/trpc/vehicle.getExchangeRates", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const ratesData = json?.result?.data?.json;
      if (ratesData) {
        const rates: ExchangeRates = {
          USD: ratesData.USD || 1,
          EUR: ratesData.EUR || 1.08,
          GBP: ratesData.GBP || 0.78,
          updatedAt: new Date(),
        };
        setCachedRates(rates);
        return rates;
      }
    }
  } catch {
    // Fallback to TCMB
  }

  try {
    const tryResim = await fetch(
      "https://api.tcmb.gov.tr/kurlar/today?type=json",
    );
    if (tryResim.ok) {
      const tcmbData = await tryResim.json();
      const usdRate = tcmbData.find((k: any) => k.D_Short_Code === "USD");
      const eurRate = tcmbData.find((k: any) => k.D_Short_Code === "EUR");

      if (usdRate && eurRate) {
        const usd = Number.parseFloat(usdRate.ForexSelling);
        const eur = Number.parseFloat(eurRate.ForexSelling);
        const rates: ExchangeRates = {
          USD: usd,
          EUR: eur,
          GBP: 60,
          updatedAt: new Date(),
        };
        setCachedRates(rates);
        return rates;
      }
    }
  } catch {
    // Fallback to default
  }

  return FALLBACK_RATES;
}

export function useCurrency() {
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExchangeRates()
      .then((r) => {
        setRates(r);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const convertToTRY = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === "TRY" || fromCurrency === "TL") return amount;
    if (fromCurrency === "USD") return amount * rates.USD;
    if (fromCurrency === "EUR") return amount * rates.EUR;
    if (fromCurrency === "GBP") return amount * rates.GBP;
    return amount;
  };

  return { rates, isLoading, convertToTRY };
}
