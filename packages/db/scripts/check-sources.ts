import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function checkSources() {
  console.log("\n📌 FİYAT KAYNAKLARI:\n");

  const vehicles = await prisma.vehicleVersion.findMany({
    select: { source: true, country: true },
  });

  const sources: Record<string, string> = {};
  for (const v of vehicles) {
    sources[v.source] = v.country;
  }

  console.log("Ülke | Kaynak");
  console.log("------|-------");
  for (const [source, country] of Object.entries(sources)) {
    const countryName =
      country === "TR"
        ? "Türkiye"
        : country === "DE"
          ? "Almanya"
          : country === "US"
            ? "ABD"
            : country === "FR"
              ? "Fransa"
              : country === "IT"
                ? "İtalya"
                : country;
    console.log(`${countryName.padEnd(10)}| ${source}`);
  }

  console.log("\n🔍 Örnek sorgulama:");
  const teslaTR = await prisma.vehicleVersion.findFirst({
    where: { model: { name: "Model 3" }, country: "TR" },
    include: { model: { include: { brand: true } } },
  });

  const teslaUS = await prisma.vehicleVersion.findFirst({
    where: { model: { name: "Model 3" }, country: "US" },
    include: { model: { include: { brand: true } } },
  });

  console.log(`\nTesla Model 3 Türkiye:`);
  console.log(`  Fiyat: ${teslaTR?.price.toLocaleString()} TL`);
  console.log(`  Kaynak: ${teslaTR?.source}`);

  console.log(`\nTesla Model 3 ABD:`);
  console.log(`  Fiyat: $${teslaUS?.price.toLocaleString()}`);
  console.log(`  Kaynak: ${teslaUS?.source}`);
}

checkSources().finally(() => prisma.$disconnect());
