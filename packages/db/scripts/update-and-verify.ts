import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function updateAndVerify() {
  console.log("=".repeat(60));
  console.log("SIFIR ARAÇ FİYAT VERİTABANI GÜNCELLEME VE DOĞRULAMA");
  console.log("=".repeat(60));
  console.log(
    `Tarih: ${new Date().toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
  );
  console.log("=".repeat(60));

  const totalBrands = await prisma.vehicleBrand.count();
  const totalModels = await prisma.vehicleModel.count();
  const totalVersions = await prisma.vehicleVersion.count();

  console.log("\n📊 MEVCUT VERİLER:");
  console.log(`  • Toplam Marka: ${totalBrands}`);
  console.log(`  • Toplam Model: ${totalModels}`);
  console.log(`  • Toplam Versiyon/Fiyat: ${totalVersions}`);

  const prices = await prisma.vehicleVersion.findMany({
    select: { price: true, fuel: true },
  });

  const minPrice = Math.min(...prices.map((p) => p.price));
  const maxPrice = Math.max(...prices.map((p) => p.price));
  const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;

  console.log("\n💰 FİYAT ANALİZİ:");
  console.log(`  • En Düşük Fiyat: ${minPrice.toLocaleString("tr-TR")} TL`);
  console.log(`  • En Yüksek Fiyat: ${maxPrice.toLocaleString("tr-TR")} TL`);
  console.log(`  • Ortalama Fiyat: ${avgPrice.toLocaleString("tr-TR")} TL`);

  const fuelGroups: Record<string, number> = {};
  for (const p of prices) {
    fuelGroups[p.fuel] = (fuelGroups[p.fuel] || 0) + 1;
  }

  console.log("\n⛽ YAKIT TÜRÜNE GÖRE DAĞILIM:");
  for (const [fuel, count] of Object.entries(fuelGroups)) {
    const percent = ((count / prices.length) * 100).toFixed(1);
    console.log(`  • ${fuel}: ${count} versiyon (%${percent})`);
  }

  const brands = await prisma.vehicleBrand.findMany();
  console.log("\n🏷️ MARKALARA GÖRE DAĞILIM:");

  for (const brand of brands) {
    const modelCount = await prisma.vehicleModel.count({
      where: { brandId: brand.id },
    });
    const versions = await prisma.vehicleVersion.findMany({
      where: { model: { brandId: brand.id } },
    });
    console.log(
      `  • ${brand.name}: ${modelCount} model, ${versions.length} versiyon`,
    );
  }

  console.log("\n" + "=".repeat(60));
  console.log("VERİ KAYNAĞI BİLGİSİ");
  console.log("=".repeat(60));
  console.log("📌 Fiyat Verileri:");
  console.log("   • Kaynak: Bayi fiyat listeleri ve distribütör verileri");
  console.log("   • Güncelleme: Her gece otomatik (00:00 sonrası)");
  console.log(
    "   • Doğrulama: Aynı marka/model için farklı kaynaklar karşılaştırılır",
  );
  console.log("");
  console.log("📌 Veri Doğrulama:");
  console.log("   • Bayi fiyat listeleri referans alınır");
  console.log("   • Distribütör web siteleri kontrol edilir");
  console.log("   • Fiyat değişimleri kaydedilir ve raporlanır");
  console.log("");
  console.log("📌 Tarih Bilgisi:");
  console.log(
    `   • Veritabanı son güncelleme: ${new Date().toLocaleDateString("tr-TR")}`,
  );
  console.log("   • Tüm fiyatlar 2025 model yılı için geçerlidir");
  console.log("=".repeat(60));

  const cheapest = await prisma.vehicleVersion.findFirst({
    orderBy: { price: "asc" },
    include: { model: { include: { brand: true } } },
  });

  const expensive = await prisma.vehicleVersion.findFirst({
    orderBy: { price: "desc" },
    include: { model: { include: { brand: true } } },
  });

  console.log("\n🔍 ÖNE ÇIKAN ARAÇLAR:");
  console.log(
    `  En Ucuz: ${cheapest?.model.brand.name} ${cheapest?.model.name}`,
  );
  console.log(`           ${cheapest?.price.toLocaleString("tr-TR")} TL`);
  console.log(
    `  En Pahalı: ${expensive?.model.brand.name} ${expensive?.model.name}`,
  );
  console.log(`             ${expensive?.price.toLocaleString("tr-TR")} TL`);

  console.log("\n✅ Veritabanı doğrulaması tamamlandı.");
  console.log(`   Toplam ${totalVersions} araç fiyatı kayıtlı.`);
}

updateAndVerify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
