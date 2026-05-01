import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function listVehicles() {
  const vehicles = await prisma.vehicleVersion.findMany({
    include: {
      model: { include: { brand: true } },
    },
    orderBy: { price: "asc" },
    take: 25,
  });

  console.log("\n=== GÜNCEL SIFIR ARAÇ FİYATLARI ===\n");
  vehicles.forEach((v, i) => {
    console.log(`${i + 1}. ${v.model.brand.name} ${v.model.name} ${v.name}`);
    console.log(
      `   Fiyat: ${v.price.toLocaleString()} TL | Yakıt: ${v.fuel} | Vites: ${v.transmission}`,
    );
    console.log(`   Güncellenme: ${v.updatedAt.toLocaleDateString()}\n`);
  });
}

listVehicles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
