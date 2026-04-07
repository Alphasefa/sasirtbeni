const brandDomains: Record<string, string> = {
  audi: "audi.com",
  bmw: "bmw.com",
  "mercedes-benz": "mercedes-benz.com",
  volkswagen: "volkswagen.com",
  toyota: "toyota.com",
  hyundai: "hyundai.com",
  kia: "kia.com",
  renault: "renault.com",
  peugeot: "peugeot.com",
  fiat: "fiat.com",
  opel: "opel.com",
  ford: "ford.com",
  honda: "honda.com",
  nissan: "nissan.com",
  mazda: "mazda.com",
  suzuki: "suzuki.com",
  lexus: "lexus.com",
  mitsubishi: "mitsubishi-motors.com",
  subaru: "subaru.com",
  jaguar: "jaguar.com",
  porsche: "porsche.com",
  ferrari: "ferrari.com",
  lamborghini: "lamborghini.com",
  bentley: "bentley.com",
  citroen: "citroen.com",
  skoda: "skoda-auto.com",
  seat: "seat.com",
  cupra: "cupraofficial.com",
  dacia: "dacia.com",
  volvo: "volvo.com",
  genesis: "genesis.com",
  byd: "byd.com",
  geely: "geely.com",
  chery: "chery.com",
};

export function getBrandLogo(brandId: string): string | null {
  const domain = brandDomains[brandId.toLowerCase()];
  if (!domain) return null;
  return `https://logo.clearbit.io/${domain}?size=128`;
}
