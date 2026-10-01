"use client";

import {
  Battery,
  Car,
  Headphones,
  MapPin,
  Phone,
  Shield,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import vehicleData from "@/shared/data/vehicles.json";

const { brands, models } = vehicleData as {
  brands: { id: string; name: string; country: string; logo: string }[];
  models: Record<
    string,
    {
      id: string;
      name: string;
      versions: { engine: string; hp: number; tr: number; de: number }[];
    }[]
  >;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(price);
}

const services = [
  { icon: Wrench, title: "Tamir & Bakım", description: "Batarya kontrolü, şarj sistemi bakımı, elektrik motoru servisi" },
  { icon: Truck, title: "Çekici Hizmeti", description: "7/24 yol yardımı, sahada şarj desteği, Türkiye geneli" },
  { icon: Battery, title: "Batarya Desteği", description: "Batarya diagnostik, değişim, garanti kapsamı" },
  { icon: Shield, title: "Garanti Servisi", description: "Üretici garantisi kapsamında ücretsiz kontrol ve parça değişimi" },
  { icon: MapPin, title: "Şarj İstasyonu", description: "Ev tipi, iş yeri şarj kurulumu ve abonelik" },
  { icon: Headphones, title: "7/24 Destek", description: "Teknik destek, satış sonrası, online randevu" },
];

const chargingPartners = [
  { name: "Tesla Supercharger", count: 45 },
  { name: "Eşarj", count: 120 },
  { name: "ZES", count: 85 },
  { name: "Voltrun", count: 60 },
  { name: "Enerjisa", count: 40 },
];

export default function ElectricHybridPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const electricModels: {
    brandId: string;
    brandName: string;
    modelId: string;
    modelName: string;
    engine: string;
    hp: number;
    tr: number;
    type: "electric" | "hybrid";
  }[] = [];

  for (const [brandId, brandModels] of Object.entries(models)) {
    for (const model of brandModels) {
      for (const version of model.versions) {
        const e = version.engine.toLowerCase();
        const isElectric = e.includes("ev") || e.includes("electric") || e.includes("e-tron") || e.includes("iq") || e.includes("rz") || e.includes("eletre");
        const isHybrid = e.includes("hybrid") || e.includes("hev") || e.includes("phev") || e.includes("plug-in") || e.includes("e-tech");
        if (isElectric || isHybrid) {
          const brandInfo = brands.find((b) => b.id === brandId);
          electricModels.push({
            brandId,
            brandName: brandInfo?.name || brandId,
            modelId: model.id,
            modelName: model.name,
            engine: version.engine,
            hp: version.hp,
            tr: version.tr,
            type: isElectric ? "electric" : "hybrid",
          });
        }
      }
    }
  }

  const sortedModels = electricModels.sort((a, b) => a.tr - b.tr);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 py-8 text-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
            <Zap className="h-4 w-4" /> Elektrikli Araç Desteği
          </div>
          <h1 className="mb-3 text-3xl font-bold">Elektrikli & Hibrit Araç Hizmetleri</h1>
          <p className="mx-auto mb-6 max-w-xl text-emerald-100">Tamir, bakım, çekici hizmeti ve daha fazlası. Elektrikli araç sahipleri için özel destek.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#services" className="rounded-xl bg-white px-6 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50">Hizmetlerimiz</a>
            <a href="#vehicles" className="rounded-xl border-2 border-white px-6 py-2.5 font-semibold text-white hover:bg-white/10">Araçları İncele</a>
          </div>
        </div>
      </section>

      <section id="services" className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Hizmetlerimiz</h2>
            <p className="text-slate-500">Elektrikli ve hibrit araç sahipleri için kapsamlı destek</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedService(selectedService === service.title ? null : service.title)}
                className={`rounded-xl border bg-white p-5 text-left transition-all hover:shadow-lg ${
                  selectedService === service.title ? "border-emerald-500 shadow-lg" : "border-slate-200"
                }`}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-bold text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-500">{service.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setSelectedService(null)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-white sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="font-bold text-slate-900">{selectedService}</h3>
              <button onClick={() => setSelectedService(null)} className="rounded-full p-2 hover:bg-slate-100">
                <span className="text-slate-400">✕</span>
              </button>
            </div>
            <div className="p-5">
              {selectedService === "7/24 Destek" ? (
                <div className="space-y-4">
                  <a href="tel:+908503200400" className="flex items-center gap-4 rounded-xl bg-emerald-50 p-4 hover:bg-emerald-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white"><Phone className="h-6 w-6" /></div>
                    <div><div className="font-bold text-slate-900">Destek Hattı</div><div className="text-lg font-bold text-emerald-600">0850 320 04 00</div></div>
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <a href="https://wa.me/908503200400" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 p-4 text-center hover:border-emerald-300 hover:bg-emerald-50">
                      <div className="mb-1 text-2xl">💬</div><div className="text-sm font-medium">WhatsApp</div>
                    </a>
                    <Link href="/dealers" className="rounded-xl border border-slate-200 p-4 text-center hover:border-emerald-300 hover:bg-emerald-50">
                      <div className="mb-1 text-2xl">🏪</div><div className="text-sm font-medium">Servis Bul</div>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">En yakın servis noktaları için Google Haritalar'da arama yapın:</p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(selectedService + " elektrikli araç")}/@41.0082,28.9784,12z`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    <MapPin className="h-5 w-5" /> Google Haritalar'da Ara
                  </a>
                  <a href="tel:+908503200400" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-medium text-slate-700 hover:bg-slate-50">
                    <Phone className="h-4 w-4" /> Bizi Arayın
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section id="vehicles" className="bg-white py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Elektrikli & Hibrit Araçlar</h2>
              <p className="text-sm text-slate-500">Türkiye&apos;deki {sortedModels.length} elektrikli/hibrit araç</p>
            </div>
            <Link href="/compare" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Tümünü Karşılaştır</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedModels.slice(0, 9).map((car, idx) => (
              <Link
                key={`${car.brandId}-${car.modelId}-${idx}`}
                href={`/compare/${car.brandId}/${car.modelId}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-400 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-600">{car.brandName.charAt(0)}</div>
                    <span className="font-semibold text-slate-900">{car.brandName} {car.modelName}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${car.type === "electric" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                    {car.type === "electric" ? "EV" : "HİBRİT"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{car.engine} • {car.hp} HP</span>
                  <span className="font-bold text-emerald-600">{formatPrice(car.tr)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Şarj İstasyonu Ortakları</h2>
            <p className="text-slate-500">Türkiye genelinde şarj ağı</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {chargingPartners.map((partner) => (
              <div key={partner.name} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">{partner.name.charAt(0)}</div>
                <span className="text-sm font-medium text-slate-700">{partner.name}</span>
                <span className="text-xs text-slate-400">({partner.count})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 p-8 text-center text-white">
            <h2 className="mb-2 text-2xl font-bold">Elektrikli Araç mı Alıyorsun?</h2>
            <p className="mb-4 text-emerald-100">En uygun fiyatlı elektrikli ve hibrit araçları karşılaştır, en yakin bayiyi bul.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/compare" className="rounded-xl bg-white px-6 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50">Araçları İncele</Link>
              <Link href="/dealers" className="rounded-xl border-2 border-white px-6 py-2.5 font-semibold text-white hover:bg-white/10">Bayi Bul</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
