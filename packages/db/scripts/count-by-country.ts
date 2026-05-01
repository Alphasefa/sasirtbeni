import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function countByCountry() {
  const countries = await prisma.vehicleVersion.groupBy({
    by: ["country"],
    _count: { id: true },
  });

  console.log("\n📊 ÜLKELERE GÖRE FİYAT SAYISI:\n");
  for (const c of countries) {
    const countryName =
      c.country === "TR"
        ? "Türkiye"
        : c.country === "DE"
          ? "Almanya"
          : c.country;
    console.log(`  ${countryName}: ${c._count.id} versiyon`);
  }

  const tr = countries.find((c) => c.country === "TR")?._count.id || 0;
  const other = countries
    .filter((c) => c.country !== "TR")
    .reduce((sum, c) => sum + c._count.id, 0);

  console.log(`\n  Türkiye: ${tr}`);
  console.log(`  Yurt Dışı: ${other}`);
}

countByCountry().finally(() => prisma.$disconnect());
