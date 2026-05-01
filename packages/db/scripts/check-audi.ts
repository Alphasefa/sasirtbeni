import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function checkAudi() {
  console.log("\n🚗 AUDİ VERİLERİ KONTROLÜ\n");

  // Tüm markaları kontrol et
  const brands = await prisma.vehicleBrand.findMany({
    orderBy: { name: "asc" },
  });

  console.log("📋 TÜM MARKALAR:\n");
  brands.forEach((b) => console.log(`  ${b.name}`));

  // Audi'yi bul
  const audiBrand = brands.find((b) => b.name.toLowerCase().includes("audi"));

  if (audiBrand) {
    console.log(`\n✅ Audi bulundu: ${audiBrand.name} (ID: ${audiBrand.id})`);

    const audiModels = await prisma.vehicleModel.findMany({
      where: { brandId: audiBrand.id },
    });

    console.log(`\n📊 Audi Modeller (${audiModels.length}):`);
    for (const m of audiModels) {
      const versions = await prisma.vehicleVersion.findMany({
        where: { modelId: m.id },
      });
      console.log(`  • ${m.name}: ${versions.length} versiyon`);
    }
  } else {
    console.log("\n❌ Audi markası bulunamadı!");
  }
}

checkAudi().finally(() => prisma.$disconnect());
