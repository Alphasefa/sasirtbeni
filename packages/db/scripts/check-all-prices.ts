import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function checkAll() {
  console.log("\n🔍 TÜM FİYATLAR KONTROL EDİLİYOR...\n");

  const versions = await prisma.vehicleVersion.findMany({
    include: { model: { include: { brand: true } } },
  });

  console.log("Para birimlerine göre dağılım:");
  const currencies: Record<string, number> = {};
  for (const v of versions) {
    currencies[v.currency] = (currencies[v.currency] || 0) + 1;
  }
  for (const [c, count] of Object.entries(currencies)) {
    console.log(`  ${c}: ${count} versiyon`);
  }

  // TL olmayanları göster
  console.log("\nTL OLMAYAN FİYATLAR:");
  const nonTL = versions.filter((v) => v.currency !== "TL");
  if (nonTL.length === 0) {
    console.log("  ✓ Tüm fiyatlar TL");
  } else {
    nonTL.slice(0, 10).forEach((v) => {
      console.log(
        `  ${v.model.brand.name} ${v.model.name}: ${v.price} ${v.currency}`,
      );
    });
    if (nonTL.length > 10) console.log(`  ... ve ${nonTL.length - 10} daha`);
  }

  // Örnek fiyatları göster
  console.log("\nÖRNEK FİYATLAR (TL):");
  versions.slice(0, 20).forEach((v, i) => {
    console.log(
      `${i + 1}. ${v.model.brand.name} ${v.model.name} ${v.name}: ${v.price.toLocaleString()} TL`,
    );
  });
}

checkAll().finally(() => prisma.$disconnect());
