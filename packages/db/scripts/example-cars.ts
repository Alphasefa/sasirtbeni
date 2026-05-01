import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function showExamples() {
  const examples = await prisma.vehicleVersion.findMany({
    include: { model: { include: { brand: true } } },
    orderBy: { country: "asc" },
  });

  console.log("\n🚗 ÖRNEK ARAÇ FİYAT LİSTESİ\n");
  console.log("=".repeat(80));

  const grouped: Record<string, typeof examples> = {};
  for (const v of examples) {
    if (!grouped[v.country]) grouped[v.country] = [];
    grouped[v.country].push(v);
  }

  const countryNames: Record<string, string> = {
    TR: "🇹🇷 TÜRKİYE",
    DE: "🇩🇪 ALMANYA",
    FR: "🇫🇷 FRANSA",
    IT: "🇮🇹 İTALYA",
    US: "🇺🇸 AMERİKA",
  };

  for (const [country, vehicles] of Object.entries(grouped)) {
    console.log(`\n${countryNames[country] || country}`);
    console.log("-".repeat(40));

    const unique = vehicles.slice(0, 5);
    for (const v of unique) {
      const price =
        v.currency === "EUR"
          ? `€${v.price.toLocaleString()}`
          : v.currency === "USD"
            ? `$${v.price.toLocaleString()}`
            : `${v.price.toLocaleString()} TL`;
      console.log(`  ${v.model.brand.name} ${v.model.name} ${v.name}`);
      console.log(`    → ${price}`);
    }
  }

  console.log("\n" + "=".repeat(80));
}

showExamples().finally(() => prisma.$disconnect());
