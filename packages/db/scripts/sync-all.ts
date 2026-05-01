import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function syncAll() {
  console.log("\n🔄 TÜM SİSTEM GÜNCELLEME");
  console.log("=".repeat(50));

  // 1. Döviz kurları
  console.log("\n1️⃣ DÖVİZ KURLARI");
  const rates = [
    { currency: "USD", rate: 44.54 },
    { currency: "EUR", rate: 52.5 },
    { currency: "GBP", rate: 60.8 },
    { currency: "CHF", rate: 57.16 },
  ];

  for (const r of rates) {
    const existing = await prisma.exchangeRate.findUnique({
      where: { currency: r.currency },
    });
    if (existing) {
      await prisma.exchangeRate.update({
        where: { currency: r.currency },
        data: { rate: r.rate, fetchedAt: new Date() },
      });
    } else {
      await prisma.exchangeRate.create({
        data: { currency: r.currency, rate: r.rate, fetchedAt: new Date() },
      });
    }
  }
  console.log("  ✓ Kurlar güncellendi");

  // 2. Fiyatları TL'ye çevir
  console.log("\n2️⃣ FİYAT ÇEVİRME");
  const versions = await prisma.vehicleVersion.findMany();
  let count = 0;
  for (const v of versions) {
    if (v.currency === "USD" || v.currency === "EUR") {
      const tlPrice = v.price * (v.currency === "USD" ? 44.54 : 52.5);
      await prisma.vehicleVersion.update({
        where: { id: v.id },
        data: {
          price: Math.round(tlPrice),
          currency: "TL",
          source: `${v.source} (TL)`,
        },
      });
      count++;
    }
  }
  console.log(`  ✓ ${count} fiyat TL'ye çevrildi`);

  // 3. Özet
  console.log("\n3️⃣ ÖZET");
  const brands = await prisma.vehicleBrand.count();
  const models = await prisma.vehicleModel.count();
  const prices = await prisma.vehicleVersion.count();
  console.log(`  • Marka: ${brands}`);
  console.log(`  • Model: ${models}`);
  console.log(`  • Fiyat: ${prices}`);

  console.log("\n✅ SİSTEM GÜNCELLENDİ");
  console.log(`Son: ${new Date().toLocaleString("tr-TR")}`);
}

syncAll().finally(() => prisma.$disconnect());
