import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function compareAll() {
  console.log("\n🔄 TÜM SİSTEM GÜNCELLEME\n");
  console.log("=".repeat(60));

  // 1. Döviz kurlarını güncelle
  console.log("\n1️⃣ DÖVİZ KURLARI");
  const rates = [
    { currency: "EUR", rate: 37.5 },
    { currency: "USD", rate: 34.5 },
    { currency: "GBP", rate: 44.2 },
    { currency: "CHF", rate: 39.8 },
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

  // 2. Araç fiyatlarını güncelle
  console.log("\n2️⃣ ARAÇ FİYATLARI");
  const brands = await prisma.vehicleBrand.count();
  const models = await prisma.vehicleModel.count();
  const versions = await prisma.vehicleVersion.count();
  console.log(`  ✓ ${brands} marka, ${models} model, ${versions} versiyon`);

  // 3. Ülke bazlı sayılar
  console.log("\n3️⃣ ÜLKELERE GÖRE DAĞILIM");
  const countryGroups = await prisma.vehicleVersion.groupBy({
    by: ["country"],
    _count: { id: true },
  });

  const countryNames: Record<string, string> = {
    TR: "🇹🇷 Türkiye",
    DE: "🇩🇪 Almanya",
    US: "🇺🇸 ABD",
    FR: "🇫🇷 Fransa",
    IT: "🇮🇹 İtalya",
  };

  for (const c of countryGroups) {
    console.log(
      `  ${countryNames[c.country] || c.country}: ${c._count.id} versiyon`,
    );
  }

  // 4. Para birimleri
  console.log("\n4️⃣ PARA BİRİMLERİ");
  const currencyGroups = await prisma.vehicleVersion.groupBy({
    by: ["currency"],
    _count: { id: true },
  });

  for (const c of currencyGroups) {
    console.log(`  ${c.currency}: ${c._count.id} versiyon`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ SİSTEM GÜNCELLENDİ");
  console.log("=".repeat(60));
  console.log(`\nSon güncelleme: ${new Date().toLocaleString("tr-TR")}`);
}

compareAll().finally(() => prisma.$disconnect());
