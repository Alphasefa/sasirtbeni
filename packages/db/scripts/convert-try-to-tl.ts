import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function convertToTL() {
  const currentRate = await prisma.exchangeRate.findUnique({
    where: { currency: "USD" },
  });

  console.log(`💱 Güncel USD kuru: ${currentRate?.rate} TL\n`);

  const tryVersions = await prisma.vehicleVersion.findMany({
    where: { currency: "TRY" },
  });

  console.log(
    `🔄 ${tryVersions.length} versiyon "TRY" -> "TL" olarak güncelleniyor...\n`,
  );

  let updated = 0;
  for (const v of tryVersions) {
    await prisma.vehicleVersion.update({
      where: { id: v.id },
      data: { currency: "TL" },
    });
    updated++;
  }

  console.log(`✅ ${updated} versiyon güncellendi.`);

  const tlCount = await prisma.vehicleVersion.count({
    where: { currency: "TL" },
  });
  console.log(`\n📊 TL para birimli versiyon sayısı: ${tlCount}`);
}

convertToTL()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
