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
const CACHE_DURATION = 60 * 60 * 1000;

function getCachedRates(): ExchangeRates | null {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < CACHE_DURATION) {
      return data.rates;
    }
  } catch {
    return null;
  }
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
    const res = await fetch("https://api.exchangerate-api.com/v1/latest/USD");
    if (!res.ok) throw new Error("Failed to fetch rates");

    const data = await res.json();
    const rates: ExchangeRates = {
      USD: 1,
      EUR: data.rates.EUR || 1.08,
      GBP: data.rates.GBP || 0.78,
      updatedAt: new Date(),
    };

    const tryResim = await fetch(
      "https://api.tcmb.gov.tr/api/kur Dolan?type=json",
    );
    if (tryResim.ok) {
      const tcmbData = await tryResim.json();
      const usdRate = tcmbData.find((k: any) => k.D_Short_Code === "USD");
      const eurRate = tcmbData.find((k: any) => k.D_Short_Code === "EUR");

      if (usdRate && eurRate) {
        rates.USD = 1;
        rates.EUR =
          Number.parseFloat(usdRate.ForexSelling) /
          Number.parseFloat(eurRate.ForexSelling);
      }
    }

    setCachedRates(rates);
    return rates;
  } catch {
    return FALLBACK_RATES;
  }
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
    if (fromCurrency === "TRY") return amount;
    if (fromCurrency === "USD") return amount * rates.USD;
    if (fromCurrency === "EUR") return amount * (rates.USD / rates.EUR);
    return amount;
  };

  return { rates, isLoading, convertToTRY };
}
