import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const sampleVehicles = [
  {
    brand: { name: "Renault", country: "Fransa" },
    model: { name: "Clio", startYear: 2023, endYear: null },
    version: {
      name: "1.0 TCE Joy",
      engine: "1.0L Turbo",
      horsepower: 90,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 979000,
      currency: "TRY",
      country: "TR",
      source: "Renault Türkiye",
    },
  },
  {
    brand: { name: "Renault", country: "Fransa" },
    model: { name: "Megane", startYear: 2023, endYear: null },
    version: {
      name: "1.3 TCE Joy",
      engine: "1.3L Turbo",
      horsepower: 130,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1149000,
      currency: "TRY",
      country: "TR",
      source: "Renault Türkiye",
    },
  },
  {
    brand: { name: "Fiat", country: "İtalya" },
    model: { name: "Egea", startYear: 2023, endYear: null },
    version: {
      name: "1.4 Fire Easy",
      engine: "1.4L",
      horsepower: 95,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 849000,
      currency: "TRY",
      country: "TR",
      source: "Fiat Türkiye",
    },
  },
  {
    brand: { name: "Toyota", country: "Japonya" },
    model: { name: "Corolla", startYear: 2024, endYear: null },
    version: {
      name: "1.5 Dream",
      engine: "1.5L Hybrid",
      horsepower: 120,
      transmission: "Otomatik",
      fuel: "Hibrit",
      price: 1369000,
      currency: "TRY",
      country: "TR",
      source: "Toyota Türkiye",
    },
  },
  {
    brand: { name: "Tesla", country: "ABD" },
    model: { name: "Model Y", startYear: 2024, endYear: null },
    version: {
      name: "RWD",
      engine: "Elektrik",
      horsepower: 245,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 2394000,
      currency: "TRY",
      country: "TR",
      source: "Tesla Türkiye",
    },
  },
  {
    brand: { name: "Togg", country: "Türkiye" },
    model: { name: "T10X", startYear: 2024, endYear: null },
    version: {
      name: "V2 RWD",
      engine: "Elektrik",
      horsepower: 218,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1598000,
      currency: "TRY",
      country: "TR",
      source: "Togg",
    },
  },
  {
    brand: { name: "Volkswagen", country: "Almanya" },
    model: { name: "Golf", startYear: 2024, endYear: null },
    version: {
      name: "1.5 TSI Life",
      engine: "1.5L Turbo",
      horsepower: 130,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1299000,
      currency: "TRY",
      country: "TR",
      source: "Volkswagen Türkiye",
    },
  },
  {
    brand: { name: "Hyundai", country: "Güney Kore" },
    model: { name: "i20", startYear: 2024, endYear: null },
    version: {
      name: "1.4 MPI Style",
      engine: "1.4L",
      horsepower: 100,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 919000,
      currency: "TRY",
      country: "TR",
      source: "Hyundai Türkiye",
    },
  },
  {
    brand: { name: "Peugeot", country: "Fransa" },
    model: { name: "208", startYear: 2024, endYear: null },
    version: {
      name: "1.2 PureTech Active",
      engine: "1.2L Turbo",
      horsepower: 100,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 969000,
      currency: "TRY",
      country: "TR",
      source: "Peugeot Türkiye",
    },
  },
  {
    brand: { name: "Dacia", country: "Romanya" },
    model: { name: "Sandero", startYear: 2024, endYear: null },
    version: {
      name: "1.0 TCe Essential",
      engine: "1.0L Turbo",
      horsepower: 90,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 749000,
      currency: "TRY",
      country: "TR",
      source: "Dacia Türkiye",
    },
  },
];

async function importVehicles() {
  console.log("Araç verileri içe aktarılıyor...");

  let importedCount = 0;

  for (const vehicle of sampleVehicles) {
    const { brand, model, version } = vehicle;

    try {
      let brandRecord = await prisma.vehicleBrand.findUnique({
        where: { name: brand.name },
      });

      if (!brandRecord) {
        brandRecord = await prisma.vehicleBrand.create({
          data: { name: brand.name, country: brand.country },
        });
        console.log(`  ✓ Marka eklendi: ${brand.name}`);
      }

      let modelRecord = await prisma.vehicleModel.findUnique({
        where: { brandId_name: { brandId: brandRecord.id, name: model.name } },
      });

      if (!modelRecord) {
        modelRecord = await prisma.vehicleModel.create({
          data: {
            brandId: brandRecord.id,
            name: model.name,
            startYear: model.startYear,
            endYear: model.endYear ?? undefined,
          },
        });
        console.log(`  ✓ Model eklendi: ${brand.name} ${model.name}`);
      }

      await prisma.vehicleVersion.create({
        data: {
          modelId: modelRecord.id,
          name: version.name,
          engine: version.engine,
          horsepower: version.horsepower,
          transmission: version.transmission,
          fuel: version.fuel,
          price: version.price,
          currency: version.currency,
          country: version.country,
          source: version.source,
        },
      });
      console.log(
        `  ✓ Versiyon eklendi: ${brand.name} ${model.name} ${version.name} - ${version.price.toLocaleString()} TL`,
      );

      importedCount++;
    } catch (error: any) {
      console.error(
        `  ✗ Hata: ${vehicle.brand.name} ${vehicle.model.name}`,
        error.message,
      );
    }
  }

  console.log(`\nToplam ${importedCount} araç içe aktarıldı.`);
}

importVehicles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
