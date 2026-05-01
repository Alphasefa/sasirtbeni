import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

prisma.exchangeRate.findMany().then((rates) => {
  console.log("Veritabanındaki Kurlar:");
  rates.forEach((r) => console.log(`  ${r.currency}: ${r.rate} TL`));
  prisma.$disconnect();
});
