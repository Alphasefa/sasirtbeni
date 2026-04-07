import vehicleData from "../shared/data/vehicles.json";
import fs from "fs";
import path from "path";

const { brands } = vehicleData as {
  brands: { id: string; name: string; country: string; logo: string }[];
};

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
};

async function fetchBrandLogo(brandId: string): Promise<string | null> {
  const domain = brandDomains[brandId.toLowerCase()];
  if (!domain) return null;

  const apiKey = process.env.BRANDFETCH_API_KEY;
  if (!apiKey) {
    console.log("BRANDFETCH_API_KEY not set, skipping...");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.brandfetch.io/v2/brands/${domain}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    const logo = data.images?.find(
      (img: any) => img.type === "logo" && img.width >= 200,
    );
    return logo?.url || null;
  } catch {
    return null;
  }
}

async function main() {
  const apiKey = process.env.BRANDFETCH_API_KEY;
  if (!apiKey) {
    console.log("Please set BRANDFETCH_API_KEY in .env");
    return;
  }

  console.log("Fetching logos...");

  const logos: Record<string, string> = {};

  for (const brand of brands) {
    const logo = await fetchBrandLogo(brand.id);
    if (logo) {
      logos[brand.id] = logo;
      console.log(`✓ ${brand.name}: ${logo}`);
    } else {
      console.log(`✗ ${brand.name}: not found`);
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "src/shared/data/brand-logos.json",
  );
  fs.writeFileSync(outputPath, JSON.stringify(logos, null, 2));
  console.log(`Saved to ${outputPath}`);
}

main();
