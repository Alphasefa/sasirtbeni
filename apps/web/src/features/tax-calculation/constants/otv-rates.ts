export type EngineCategory =
  | "1600"
  | "1600-2000"
  | "2000+"
  | "hibrit"
  | "elektrik";

export interface OtvBracket {
  maxMatrah: number;
  rate: number;
}

export const ÖTV_RATES: Record<EngineCategory, OtvBracket[]> = {
  "1600": [
    { maxMatrah: 200000, rate: 0.45 },
    { maxMatrah: 350000, rate: 0.5 },
    { maxMatrah: 500000, rate: 0.6 },
    { maxMatrah: Number.POSITIVE_INFINITY, rate: 0.7 },
  ],
  "1600-2000": [
    { maxMatrah: 250000, rate: 0.5 },
    { maxMatrah: 400000, rate: 0.6 },
    { maxMatrah: 550000, rate: 0.7 },
    { maxMatrah: Number.POSITIVE_INFINITY, rate: 0.8 },
  ],
  "2000+": [
    { maxMatrah: 300000, rate: 0.6 },
    { maxMatrah: 450000, rate: 0.7 },
    { maxMatrah: 600000, rate: 0.8 },
    { maxMatrah: Number.POSITIVE_INFINITY, rate: 1.0 },
  ],
  hibrit: [
    { maxMatrah: 280000, rate: 0.45 },
    { maxMatrah: 450000, rate: 0.5 },
    { maxMatrah: 650000, rate: 0.6 },
    { maxMatrah: Number.POSITIVE_INFINITY, rate: 0.7 },
  ],
  elektrik: [
    { maxMatrah: 450000, rate: 0.1 },
    { maxMatrah: 700000, rate: 0.25 },
    { maxMatrah: 1000000, rate: 0.4 },
    { maxMatrah: Number.POSITIVE_INFINITY, rate: 0.6 },
  ],
};

export const KDV_RATE = 0.2;
export const ÖTV_2025_DILIMLER = {
  "1600cc": {
    "1": { min: 0, max: 200000, oran: 0.45 },
    "2": { min: 200001, max: 350000, oran: 0.5 },
    "3": { min: 350001, max: 500000, oran: 0.6 },
    "4": { min: 500001, max: Number.POSITIVE_INFINITY, oran: 0.7 },
  },
  "1601-2000cc": {
    "1": { min: 0, max: 250000, oran: 0.5 },
    "2": { min: 250001, max: 400000, oran: 0.6 },
    "3": { min: 400001, max: 550000, oran: 0.7 },
    "4": { min: 550001, max: Number.POSITIVE_INFINITY, oran: 0.8 },
  },
  "2000+cc": {
    "1": { min: 0, max: 300000, oran: 0.6 },
    "2": { min: 300001, max: 450000, oran: 0.7 },
    "3": { min: 450001, max: 600000, oran: 0.8 },
    "4": { min: 600001, max: Number.POSITIVE_INFINITY, oran: 1.0 },
  },
};
