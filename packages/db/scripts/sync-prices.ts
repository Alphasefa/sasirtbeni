import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const updatedPrices: Record<string, number> = {
  "Fiat Egea Sedan 1.4 Fire Easy": 1184900,
  "Fiat Egea Cross 1.4 Fire Street": 1270520,
  "Fiat Topolino 6 kW/8 HP": 605900,
  "Dacia Sandero 1.0 TCe Expression": 1313000,
  "Dacia Jogger 1.0 Extreme Eco-G": 1492000,
  "Dacia Duster 1.0 TCe 4x4": 1645000,
  "Togg T10X V1 RWD Standart": 1505000,
  "Togg T10X V2 RWD": 1598000,
  "Togg T10F V1 RWD": 1878000,
  "Renault Clio 1.0 TCE Joy": 1179000,
  "Renault Megane 1.3 TCE Joy": 1399000,
  "Renault Austral 1.2 TCE Mild Hybrid": 1899000,
  "Toyota Corolla 1.5 Hybrid Dream": 1549000,
  "Toyota C-HR 1.8 Hybrid Dream": 1699000,
  "Toyota RAV4 2.0 Hybrid Adventure": 2699000,
  "Volkswagen Polo 1.0 TSI Life": 1299000,
  "Volkswagen Golf 1.5 TSI Life": 1549000,
  "Volkswagen T-Roc 1.5 TSI Life": 1799000,
  "Tesla Model Y RWD": 2394000,
  "Tesla Model Y Long Range": 2994000,
  "Tesla Model 3 RWD": 2194000,
  "Hyundai i20 1.4 MPI Style": 1049000,
  "Hyundai Tucson 1.6 TGDI": 1899000,
  "Peugeot 208 1.2 PureTech Active": 1099000,
  "Peugeot 3008 1.2 PureTech GT": 1899000,
  "Ford Puma 1.0 Titanium": 1514000,
  "Ford Explorer EV Select": 1720000,
  "Skoda Octavia 1.5 TSI Style": 1649000,
  "Skoda Karoq 1.5 TSI": 1749000,
  "Opel Corsa 1.2 Edition": 989000,
  "Opel Astra 1.2 GS": 1349000,
  "BYD Seal U Comfort": 1899000,
  "BYD Dolphin Dynamic": 1299000,
  "Kia Picanto 1.2 AT": 849000,
  "Kia Sportage 1.6 DCT": 1899000,
};

async function syncPrices() {
  console.log("Fiyatlar güncelleniyor...\n");

  let updatedCount = 0;

  for (const [versionName, newPrice] of Object.entries(updatedPrices)) {
    const version = await prisma.vehicleVersion.findFirst({
      where: { name: { contains: versionName.split(" ").slice(-2).join(" ") } },
      include: { model: { include: { brand: true } } },
    });

    if (version && version.price !== newPrice) {
      const oldPrice = version.price;
      const change = (((newPrice - oldPrice) / oldPrice) * 100).toFixed(1);

      await prisma.vehicleVersion.update({
        where: { id: version.id },
        data: { price: newPrice },
      });

      const direction = newPrice > oldPrice ? "↑" : "↓";
      console.log(
        `  ${direction} ${version.model.brand.name} ${version.model.name}: ${oldPrice.toLocaleString()} → ${newPrice.toLocaleString()} TL (${change}%)`,
      );
      updatedCount++;
    }
  }

  console.log(`\n✓ ${updatedCount} fiyat güncellendi.`);
  console.log(`Son güncelleme: ${new Date().toLocaleString()}`);
}

syncPrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
