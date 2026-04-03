import type { TaxBreakdown } from "@/shared/types/vehicle";
import {
  type EngineCategory,
  KDV_RATE,
  ÖTV_RATES,
} from "../constants/otv-rates";

export function getEngineCategory(
  engineCC: number,
  fuel: string,
): EngineCategory {
  const isElectric = fuel === "elektrik";
  const isHybrid = fuel === "hibrit";

  if (isElectric) return "elektrik";
  if (isHybrid) return "hibrit";
  if (engineCC <= 1600) return "1600";
  if (engineCC <= 2000) return "1600-2000";
  return "2000+";
}

export function getOtvRate(
  matrah: number,
  engineCC: number,
  fuel: string,
): number {
  const category = getEngineCategory(engineCC, fuel);
  const brackets = ÖTV_RATES[category];

  for (const bracket of brackets) {
    if (matrah <= bracket.maxMatrah) {
      return bracket.rate;
    }
  }

  return brackets[brackets.length - 1].rate;
}

export function calculateTax(
  basePrice: number,
  exchangeRate: number,
  engineCC: number,
  fuel = "benzin",
): TaxBreakdown {
  const matrah = basePrice * exchangeRate;
  const otvRate = getOtvRate(matrah, engineCC, fuel);
  const otvAmount = matrah * otvRate;
  const kdvBase = matrah + otvAmount;
  const kdvAmount = kdvBase * KDV_RATE;
  const totalPrice = kdvBase + kdvAmount;

  return {
    basePrice,
    exchangeRate,
    matrah,
    otvRate,
    otvAmount,
    kdvRate: KDV_RATE,
    kdvAmount,
    totalPrice,
  };
}

export function formatCurrency(amount: number, currency = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function extractEngineCC(engineString: string): number {
  const match = engineString.match(/(\d+)\s*cc/i);
  if (match) return Number.parseInt(match[1]);

  const numMatch = engineString.match(/^(\d+)/);
  if (numMatch) {
    const num = Number.parseInt(numMatch[1]);
    if (num <= 300) return num * 100;
    if (num <= 3000) return num;
  }

  return 1600;
}

export function detectFuel(engineString: string): string {
  const lower = engineString.toLowerCase();
  if (
    lower.includes("electric") ||
    lower.includes("elektrik") ||
    lower.includes("ev")
  )
    return "elektrik";
  if (
    lower.includes("hybrid") ||
    lower.includes("hibrit") ||
    lower.includes("gte") ||
    lower.includes("phev")
  )
    return "hibrit";
  if (
    lower.includes("diesel") ||
    lower.includes("dizel") ||
    lower.includes("tdi") ||
    lower.includes("cdi")
  )
    return "dizel";
  return "benzin";
}
