export function detectFuelType(engine: string): string {
  const e = engine.toLowerCase();
  if (e.includes("hybrid") || e.includes("hev") || e.includes("phev"))
    return "Hybrid";
  if (e.includes("tdi") || e.includes("diesel") || e.includes("co2"))
    return "Dizel";
  if (
    e.includes("tfsi") ||
    e.includes("tsi") ||
    e.includes("fsi") ||
    e.includes("turbo") ||
    e.includes("benzin") ||
    e.includes("petrol")
  )
    return "Benzin";
  if (e.includes("electric") || e.includes("ev") || e.includes("bev"))
    return "Elektrik";
  return "Benzin";
}

export function detectTransmission(engine: string): string {
  const e = engine.toLowerCase();
  if (
    e.includes("s tronic") ||
    e.includes("dct") ||
    e.includes("automatic") ||
    e.includes("tip-tronic") ||
    e.includes("tiptronic") ||
    e.includes("8at") ||
    e.includes("7at") ||
    e.includes("6at") ||
    e.includes("cvt")
  )
    return "Otomatik";
  if (e.includes("manual") || e.includes("5 ileri") || e.includes("6 ileri"))
    return "Manuel";
  return "Otomatik";
}

export function detectEngineCC(engine: string): number {
  const match = engine.match(/(\d+\.?\d*)\s*(V?\d+)?/);
  if (match) {
    const cc = parseFloat(match[1]);
    return cc * 1000;
  }
  return 0;
}

export const fuelTypes = ["Benzin", "Dizel", "Hybrid", "Elektrik"];
export const transmissions = ["Manuel", "Otomatik"];
export const priceRanges = [
  { label: "Tümü", min: 0, max: Infinity },
  { label: "0-500K", min: 0, max: 500000 },
  { label: "500K-1M", min: 500000, max: 1000000 },
  { label: "1M-2M", min: 1000000, max: 2000000 },
  { label: "2M-5M", min: 2000000, max: 5000000 },
  { label: "5M+", min: 5000000, max: Infinity },
];
