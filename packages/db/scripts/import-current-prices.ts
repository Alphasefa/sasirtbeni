import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

interface VehicleData {
  brand: { name: string; country: string };
  model: { name: string; startYear: number; endYear: number | null };
  version: {
    name: string;
    engine: string;
    horsepower: number;
    transmission: string;
    fuel: string;
    price: number;
    currency: string;
    country: string;
    source: string;
  };
}

const currentPrices2025: VehicleData[] = [
  {
    brand: { name: "Fiat", country: "İtalya" },
    model: { name: "Egea Sedan", startYear: 2025, endYear: null },
    version: {
      name: "1.4 Fire Easy",
      engine: "1.4L",
      horsepower: 95,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 1184900,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Fiat", country: "İtalya" },
    model: { name: "Egea Cross", startYear: 2025, endYear: null },
    version: {
      name: "1.4 Fire Street",
      engine: "1.4L",
      horsepower: 95,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 1270520,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Fiat", country: "İtalya" },
    model: { name: "Topolino", startYear: 2025, endYear: null },
    version: {
      name: "6 kW/8 HP",
      engine: "Elektrik",
      horsepower: 8,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 605900,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Dacia", country: "Romanya" },
    model: { name: "Sandero", startYear: 2025, endYear: null },
    version: {
      name: "1.0 TCe Expression",
      engine: "1.0L Turbo",
      horsepower: 90,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 1313000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Dacia", country: "Romanya" },
    model: { name: "Jogger", startYear: 2025, endYear: null },
    version: {
      name: "1.0 Extreme Eco-G",
      engine: "1.0L Turbo",
      horsepower: 100,
      transmission: "Manuel",
      fuel: "Benzin/LPG",
      price: 1492000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Dacia", country: "Romanya" },
    model: { name: "Duster", startYear: 2025, endYear: null },
    version: {
      name: "1.0 TCe 4x4",
      engine: "1.0L Turbo",
      horsepower: 125,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 1645000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Togg", country: "Türkiye" },
    model: { name: "T10X", startYear: 2025, endYear: null },
    version: {
      name: "V1 RWD Standart",
      engine: "Elektrik",
      horsepower: 218,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1505000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Togg", country: "Türkiye" },
    model: { name: "T10X", startYear: 2025, endYear: null },
    version: {
      name: "V2 RWD",
      engine: "Elektrik",
      horsepower: 218,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1598000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Togg", country: "Türkiye" },
    model: { name: "T10F", startYear: 2025, endYear: null },
    version: {
      name: "V1 RWD",
      engine: "Elektrik",
      horsepower: 218,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1878000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Renault", country: "Fransa" },
    model: { name: "Clio", startYear: 2025, endYear: null },
    version: {
      name: "1.0 TCE Joy",
      engine: "1.0L Turbo",
      horsepower: 90,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1179000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Renault", country: "Fransa" },
    model: { name: "Megane", startYear: 2025, endYear: null },
    version: {
      name: "1.3 TCE Joy",
      engine: "1.3L Turbo",
      horsepower: 130,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1399000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Renault", country: "Fransa" },
    model: { name: "Austral", startYear: 2025, endYear: null },
    version: {
      name: "1.2 TCE Mild Hybrid",
      engine: "1.2L Turbo",
      horsepower: 140,
      transmission: "Otomatik",
      fuel: "Hibrit",
      price: 1899000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Toyota", country: "Japonya" },
    model: { name: "Corolla", startYear: 2025, endYear: null },
    version: {
      name: "1.5 Hybrid Dream",
      engine: "1.5L Hybrid",
      horsepower: 120,
      transmission: "Otomatik",
      fuel: "Hibrit",
      price: 1549000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Toyota", country: "Japonya" },
    model: { name: "C-HR", startYear: 2025, endYear: null },
    version: {
      name: "1.8 Hybrid Dream",
      engine: "1.8L Hybrid",
      horsepower: 140,
      transmission: "Otomatik",
      fuel: "Hibrit",
      price: 1699000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Toyota", country: "Japonya" },
    model: { name: "RAV4", startYear: 2025, endYear: null },
    version: {
      name: "2.0 Hybrid Adventure",
      engine: "2.0L Hybrid",
      horsepower: 180,
      transmission: "Otomatik",
      fuel: "Hibrit",
      price: 2699000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Volkswagen", country: "Almanya" },
    model: { name: "Polo", startYear: 2025, endYear: null },
    version: {
      name: "1.0 TSI Life",
      engine: "1.0L Turbo",
      horsepower: 95,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1299000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Volkswagen", country: "Almanya" },
    model: { name: "Golf", startYear: 2025, endYear: null },
    version: {
      name: "1.5 TSI Life",
      engine: "1.5L Turbo",
      horsepower: 130,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1549000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Volkswagen", country: "Almanya" },
    model: { name: "T-Roc", startYear: 2025, endYear: null },
    version: {
      name: "1.5 TSI Life",
      engine: "1.5L Turbo",
      horsepower: 150,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1799000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Tesla", country: "ABD" },
    model: { name: "Model Y", startYear: 2025, endYear: null },
    version: {
      name: "RWD",
      engine: "Elektrik",
      horsepower: 245,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 2394000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Tesla", country: "ABD" },
    model: { name: "Model Y", startYear: 2025, endYear: null },
    version: {
      name: "Long Range",
      engine: "Elektrik",
      horsepower: 384,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 2994000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Tesla", country: "ABD" },
    model: { name: "Model 3", startYear: 2025, endYear: null },
    version: {
      name: "RWD",
      engine: "Elektrik",
      horsepower: 271,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 2194000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Hyundai", country: "Güney Kore" },
    model: { name: "i20", startYear: 2025, endYear: null },
    version: {
      name: "1.4 MPI Style",
      engine: "1.4L",
      horsepower: 100,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1049000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Hyundai", country: "Güney Kore" },
    model: { name: "Tucson", startYear: 2025, endYear: null },
    version: {
      name: "1.6 TGDI",
      engine: "1.6L Turbo",
      horsepower: 160,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1899000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Peugeot", country: "Fransa" },
    model: { name: "208", startYear: 2025, endYear: null },
    version: {
      name: "1.2 PureTech Active",
      engine: "1.2L Turbo",
      horsepower: 100,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1099000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Peugeot", country: "Fransa" },
    model: { name: "3008", startYear: 2025, endYear: null },
    version: {
      name: "1.2 PureTech GT",
      engine: "1.2L Turbo",
      horsepower: 130,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1899000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Ford", country: "ABD" },
    model: { name: "Puma", startYear: 2025, endYear: null },
    version: {
      name: "1.0 Titanium",
      engine: "1.0L EcoBoost",
      horsepower: 125,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1514000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Ford", country: "ABD" },
    model: { name: "Explorer EV", startYear: 2025, endYear: null },
    version: {
      name: "Select",
      engine: "Elektrik",
      horsepower: 170,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1720000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Skoda", country: "Çekya" },
    model: { name: "Octavia", startYear: 2025, endYear: null },
    version: {
      name: "1.5 TSI Style",
      engine: "1.5L Turbo",
      horsepower: 150,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1649000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Skoda", country: "Çekya" },
    model: { name: "Karoq", startYear: 2025, endYear: null },
    version: {
      name: "1.5 TSI",
      engine: "1.5L Turbo",
      horsepower: 150,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1749000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Opel", country: "Almanya" },
    model: { name: "Corsa", startYear: 2025, endYear: null },
    version: {
      name: "1.2 Edition",
      engine: "1.2L",
      horsepower: 75,
      transmission: "Manuel",
      fuel: "Benzin",
      price: 989000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Opel", country: "Almanya" },
    model: { name: "Astra", startYear: 2025, endYear: null },
    version: {
      name: "1.2 GS",
      engine: "1.2L Turbo",
      horsepower: 130,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1349000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "BYD", country: "Çin" },
    model: { name: "Seal U", startYear: 2025, endYear: null },
    version: {
      name: "Comfort",
      engine: "Elektrik",
      horsepower: 218,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1899000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "BYD", country: "Çin" },
    model: { name: "Dolphin", startYear: 2025, endYear: null },
    version: {
      name: "Dynamic",
      engine: "Elektrik",
      horsepower: 177,
      transmission: "Otomatik",
      fuel: "Elektrik",
      price: 1299000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Kia", country: "Güney Kore" },
    model: { name: "Picanto", startYear: 2025, endYear: null },
    version: {
      name: "1.2 AT",
      engine: "1.2L",
      horsepower: 84,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 849000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
  {
    brand: { name: "Kia", country: "Güney Kore" },
    model: { name: "Sportage", startYear: 2025, endYear: null },
    version: {
      name: "1.6 DCT",
      engine: "1.6L Turbo",
      horsepower: 177,
      transmission: "Otomatik",
      fuel: "Benzin",
      price: 1899000,
      currency: "TRY",
      country: "TR",
      source: "sifirarabalar.com",
    },
  },
];

async function importCurrentPrices() {
  console.log("2025 Güncel Sıfır Araç Fiyatları İçe Aktarılıyor...");
  console.log("Kaynak: sifirarabalar.com\n");

  let importedCount = 0;
  let skippedCount = 0;

  for (const vehicle of currentPrices2025) {
    const { brand, model, version } = vehicle;

    try {
      let brandRecord = await prisma.vehicleBrand.findUnique({
        where: { name: brand.name },
      });

      if (!brandRecord) {
        brandRecord = await prisma.vehicleBrand.create({
          data: { name: brand.name, country: brand.country },
        });
      }

      let modelRecord = await prisma.vehicleModel.findFirst({
        where: {
          brandId: brandRecord.id,
          name: { contains: model.name },
        },
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
      }

      const existingVersion = await prisma.vehicleVersion.findFirst({
        where: {
          modelId: modelRecord.id,
          name: version.name,
        },
      });

      if (existingVersion) {
        await prisma.vehicleVersion.update({
          where: { id: existingVersion.id },
          data: {
            price: version.price,
            engine: version.engine,
            horsepower: version.horsepower,
            transmission: version.transmission,
            fuel: version.fuel,
            source: version.source,
          },
        });
        console.log(
          `  ↻ Güncellendi: ${brand.name} ${model.name} ${version.name} - ${version.price.toLocaleString()} TL`,
        );
      } else {
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
          `  + Eklendi: ${brand.name} ${model.name} ${version.name} - ${version.price.toLocaleString()} TL`,
        );
      }

      importedCount++;
    } catch (error: any) {
      console.error(
        `  ✗ Hata: ${vehicle.brand.name} ${vehicle.model.name}`,
        error.message,
      );
      skippedCount++;
    }
  }

  console.log(`\n✓ Toplam ${importedCount} araç güncellendi/eklendi.`);
  console.log(`✗ ${skippedCount} araç atlandı.`);
}

importCurrentPrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
