import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

interface VehiclePrice {
  brand: string;
  model: string;
  version: string;
  engine: string;
  horsepower: number;
  transmission: string;
  fuel: string;
  price: number;
  currency: string;
  country: string;
  source: string;
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
};

async function fetchWithHeaders(url: string): Promise<string> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

const brands = [
  { slug: "renault", name: "Renault" },
  { slug: "fiat", name: "Fiat" },
  { slug: "toyota", name: "Toyota" },
  { slug: "volkswagen", name: "Volkswagen" },
  { slug: "hyundai", name: "Hyundai" },
  { slug: "peugeot", name: "Peugeot" },
  { slug: "ford", name: "Ford" },
  { slug: "opel", name: "Opel" },
  { slug: "citroen", name: "Citroen" },
  { slug: "skoda", name: "Skoda" },
  { slug: "dacia", name: "Dacia" },
  { slug: "kia", name: "Kia" },
  { slug: "nissan", name: "Nissan" },
  { slug: "seat", name: "Seat" },
  { slug: "suzuki", name: "Suzuki" },
];

async function scrapeVitrin() {
  console.log("Vitrin.com'dan veri çekiliyor...\n");

  const allVehicles: VehiclePrice[] = [];

  for (const brand of brands) {
    try {
      console.log(`  Marka: ${brand.name}`);

      const html = await fetchWithHeaders(
        `https://www.vitrin.com/marka/${brand.slug}`,
      );

      const modelRegex = /<a[^>]*href="\/model\/[^"]*"[^>]*>([^<]+)/gi;
      const models = [...html.matchAll(modelRegex)]
        .map((m) => m[1].trim())
        .filter((v, i, a) => a.indexOf(v) === i);

      for (const model of models.slice(0, 10)) {
        try {
          const modelSlug = model.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const modelHtml = await fetchWithHeaders(
            `https://www.vitrin.com/marka/${brand.slug}/model/${modelSlug}`,
          );

          const priceMatches = [
            ...modelHtml.matchAll(/(\d{1,3}(?:\.\d{3})+)\s*TL/g),
          ];
          const versionMatches = [
            ...modelHtml.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g),
          ];

          for (
            let i = 0;
            i < Math.min(versionMatches.length, priceMatches.length);
            i++
          ) {
            const versionName = versionMatches[i]?.[1]?.trim() || "";
            const priceStr = priceMatches[i]?.[1]?.replace(/\./g, "") || "0";
            const price = parseInt(priceStr, 10);

            if (versionName && price > 0) {
              allVehicles.push({
                brand: brand.name,
                model: model,
                version: versionName,
                engine: "",
                horsepower: 0,
                transmission: "Otomatik",
                fuel: "Benzin",
                price,
                currency: "TRY",
                country: "TR",
                source: "vitrin.com",
              });
            }
          }
        } catch (e) {
          console.log(`    Model hatası: ${model}`);
        }
      }
    } catch (e) {
      console.log(`  Marka hatası: ${brand.name}`);
    }
  }

  return allVehicles;
}

async function saveToDatabase(vehicles: VehiclePrice[]) {
  console.log("\nVeritabanına kaydediliyor...");

  let savedCount = 0;

  for (const v of vehicles) {
    try {
      let brandRecord = await prisma.vehicleBrand.findUnique({
        where: { name: v.brand },
      });

      if (!brandRecord) {
        brandRecord = await prisma.vehicleBrand.create({
          data: { name: v.brand, country: "Diğer" },
        });
      }

      let modelRecord = await prisma.vehicleModel.findFirst({
        where: { brandId: brandRecord.id, name: { contains: v.model } },
      });

      if (!modelRecord) {
        modelRecord = await prisma.vehicleModel.create({
          data: { brandId: brandRecord.id, name: v.model, startYear: 2025 },
        });
      }

      const existing = await prisma.vehicleVersion.findFirst({
        where: {
          modelId: modelRecord.id,
          name: { contains: v.version.split(" ").slice(0, 2).join(" ") },
        },
      });

      if (existing) {
        await prisma.vehicleVersion.update({
          where: { id: existing.id },
          data: { price: v.price },
        });
      } else {
        await prisma.vehicleVersion.create({
          data: {
            modelId: modelRecord.id,
            name: v.version,
            engine: v.engine,
            horsepower: v.horsepower,
            transmission: v.transmission,
            fuel: v.fuel,
            price: v.price,
            currency: v.currency,
            country: v.country,
            source: v.source,
          },
        });
      }
      savedCount++;
    } catch (e) {
      // Skip duplicates
    }
  }

  console.log(`✓ ${savedCount} araç kaydedildi.`);
}

async function main() {
  try {
    const vehicles = await scrapeVitrin();
    await saveToDatabase(vehicles);
  } catch (e) {
    console.error("Hata:", e);
  } finally {
    prisma.$disconnect();
  }
}

main();
