import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: "file:./dev.db" }),
});

async function fetchRatesFromTCMB() {
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  try {
    const response = await fetch(`https://www.tcmb.gov.tr/kurlar/${today}.xml`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const usd = xml.match(/<Currency Code="USD">[\s\S]*?<ForexBuying>([\d.]+)/);
    const eur = xml.match(/<Currency Code="EUR">[\s\S]*?<ForexBuying>([\d.]+)/);
    const gbp = xml.match(/<Currency Code="GBP">[\s\S]*?<ForexBuying>([\d.]+)/);
    const chf = xml.match(/<Currency Code="CHF">[\s\S]*?<ForexBuying>([\d.]+)/);

    return {
      USD: usd ? parseFloat(usd[1]) : null,
      EUR: eur ? parseFloat(eur[1]) : null,
      GBP: gbp ? parseFloat(gbp[1]) : null,
      CHF: chf ? parseFloat(chf[1]) : null,
    };
  } catch (error) {
    console.log("TCMB XML parse hatası, alternatif API deneniyor...");
    return null;
  }
}

async function fetchRatesFromAlternative() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=TRY");
    const data = await res.json();

    return {
      USD: 1 / data.rates.USD,
      EUR: 1 / data.rates.EUR,
      GBP: 1 / data.rates.GBP,
      CHF: 1 / data.rates.CHF,
    };
  } catch {
    return null;
  }
}

async function syncRates() {
  console.log("\n💱 DÖVİZ KURLARI GÜNCELLEME");
  console.log("=".repeat(50));

  let rates = await fetchRatesFromTCMB();

  if (!rates) {
    console.log("TCMB başarısız, frankfurter.app deneniyor...");
    rates = await fetchRatesFromAlternative();
  }

  if (!rates) {
    console.log("❌ Hiçbir API'den kur alınamadı!");
    console.log("\n fallback: manuel değerler kullanılıyor");
    rates = {
      USD: 44.54,
      EUR: 52.5,
      GBP: 60.8,
      CHF: 57.16,
    };
  }

  console.log(`\n📅 Tarih: ${new Date().toLocaleDateString("tr-TR")}\n`);

  const currencies = [
    { currency: "USD", rate: rates.USD },
    { currency: "EUR", rate: rates.EUR },
    { currency: "GBP", rate: rates.GBP },
    { currency: "CHF", rate: rates.CHF },
  ];

  for (const rate of currencies) {
    if (!rate.rate) continue;

    try {
      const existing = await prisma.exchangeRate.findUnique({
        where: { currency: rate.currency },
      });

      if (existing) {
        await prisma.exchangeRate.update({
          where: { currency: rate.currency },
          data: {
            rate: rate.rate,
            fetchedAt: new Date(),
          },
        });
        console.log(`  ↻ ${rate.currency}: ${rate.rate.toFixed(4)} TL`);
      } else {
        await prisma.exchangeRate.create({
          data: {
            currency: rate.currency,
            rate: rate.rate,
            fetchedAt: new Date(),
          },
        });
        console.log(`  + ${rate.currency}: ${rate.rate.toFixed(4)} TL`);
      }
    } catch (e) {
      console.log(`  ✗ ${rate.currency} hata`);
    }
  }

  console.log("\n✅ Döviz kurları güncellendi!");

  console.log("\n📊 Mevcut Kurlar:");
  const allRates = await prisma.exchangeRate.findMany();
  for (const r of allRates) {
    console.log(`  ${r.currency}: ${r.rate.toFixed(4)} TL`);
  }
}

syncRates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
