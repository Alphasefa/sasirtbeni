import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function findOldPrices() {
  const versions = await prisma.vehicleVersion.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      currency: true,
    },
    orderBy: { price: "asc" },
    take: 50,
  });

  console.log("Düşük fiyatlı araçlar (muhtemelen eski kur):");
  console.log("=".repeat(60));

  for (const v of versions) {
    if (v.price && v.price < 100000) {
      console.log(`${v.name}: ${v.price} ${v.currency}`);
    }
  }

  const tryVersions = await prisma.vehicleVersion.findMany({
    where: { currency: "TRY" },
    select: { id: true, name: true, price: true, currency: true },
    take: 20,
  });

  console.log("\n\nTRY para birimli versiyonlar:");
  console.log("=".repeat(60));
  for (const v of tryVersions) {
    console.log(`${v.name}: ${v.price} ${v.currency}`);
  }

  const allCount = await prisma.vehicleVersion.count();
  const tryCount = await prisma.vehicleVersion.count({
    where: { currency: "TRY" },
  });
  const tlCount = await prisma.vehicleVersion.count({
    where: { currency: "TL" },
  });

  console.log(`\n\nToplam: ${allCount}, TRY: ${tryCount}, TL: ${tlCount}`);
}

findOldPrices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
