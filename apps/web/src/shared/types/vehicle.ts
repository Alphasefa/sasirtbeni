export type VehicleBrand = {
  id: string;
  name: string;
  country: string;
  logo?: string;
};

export type VehicleModel = {
  id: string;
  brandId: string;
  name: string;
  startYear: number;
  endYear?: number;
};

export type VehicleVersion = {
  id: string;
  modelId: string;
  name: string;
  engine: string;
  horsepower: number;
  transmission: "manual" | "automatic" | "cvt";
  fuel: "benzin" | "dizel" | "hibrit" | "elektrik";
  price: number;
  currency: "TRY" | "EUR" | "USD";
};

export type Country = "TR" | "DE" | "FR" | "IT" | "ES" | "GB" | "US";

export interface VehiclePrice {
  brand: string;
  model: string;
  version: string;
  engine: string;
  horsepower: number;
  price: number;
  currency: Currency;
  country: Country;
  source: string;
  updatedAt: Date;
}

export type Currency = "TRY" | "EUR" | "USD";

export interface TaxBreakdown {
  basePrice: number;
  exchangeRate: number;
  matrah: number;
  otvRate: number;
  otvAmount: number;
  kdvRate: number;
  kdvAmount: number;
  totalPrice: number;
}

export interface ComparisonResult {
  vehicle: VehiclePrice;
  turkeyPrice: number;
  turkeyTaxBreakdown: TaxBreakdown;
  foreignPrice: number;
  foreignCurrency: Currency;
  difference: number;
  differencePercent: number;
}
