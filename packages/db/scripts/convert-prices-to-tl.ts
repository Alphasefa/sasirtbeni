import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

const rates = {
  USD: 44.54,
  EUR: 52.5,
};

async function convertToTL() {
  console.log("\n💱 FİYATLAR TL'YE ÇEVİRİLİYOR...");
  console.log("Kurlar: USD = 44.54 TL, EUR = 52.50 TL\n");

  const versions = await prisma.vehicleVersion.findMany({
    include: { model: { include: { brand: true } } },
  });

  let updated = 0;

  for (const v of versions) {
    if (v.currency === "USD" || v.currency === "EUR") {
      const tlPrice = v.price * (v.currency === "USD" ? rates.USD : rates.EUR);

      await prisma.vehicleVersion.update({
        where: { id: v.id },
        data: {
          price: Math.round(tlPrice),
          currency: "TL",
          source: `${v.source} (TL karşılığı)`,
        },
      });

      updated++;
    }
  }

  console.log(`✓ ${updated} fiyat TL'ye çevrildi\n`);

  // Show updated prices
  const updatedVersions = await prisma.vehicleVersion.findMany({
    include: { model: { include: { brand: true } } },
    take: 20,
    orderBy: { price: "asc" },
  });

  console.log("📊 GÜNCEL FİYAT LİSTESİ (TL):\n");
  updatedVersions.forEach((v, i) => {
    console.log(`${i + 1}. ${v.model.brand.name} ${v.model.name} ${v.name}`);
    console.log(`   Fiyat: ${v.price.toLocaleString()} TL`);
  });
}

convertToTL().finally(() => prisma.$disconnect());
