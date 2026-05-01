import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function countData() {
  const brands = await prisma.vehicleBrand.count();
  const models = await prisma.vehicleModel.count();
  const versions = await prisma.vehicleVersion.count();

  console.log(`\n📊 Toplam Veri:`);
  console.log(`  Marka: ${brands}`);
  console.log(`  Model: ${models}`);
  console.log(`  Versiyon/Fiyat: ${versions}`);
}

countData().finally(() => prisma.$disconnect());
