"use client";

import {
  ArrowRight,
  Car,
  GitCompare,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AdBanner from "@/components/ad-banner";
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

const countryFlags: Record<string, string> = {
  US: "https://flagcdn.com/w40/us.png",
  DE: "https://flagcdn.com/w40/de.png",
  JP: "https://flagcdn.com/w40/jp.png",
  KR: "https://flagcdn.com/w40/kr.png",
  FR: "https://flagcdn.com/w40/fr.png",
  IT: "https://flagcdn.com/w40/it.png",
  GB: "https://flagcdn.com/w40/gb.png",
  TR: "https://flagcdn.com/w40/tr.png",
  CN: "https://flagcdn.com/w40/cn.png",
};

const popularBrands = [
  "volkswagen",
  "toyota",
  "renault",
  "hyundai",
  "fiat",
  "peugeot",
  "bmw",
  "mercedes",
  "audi",
  "ford",
];

const featuredComparisons = [
  { brand1: "volkswagen", model1: "golf", brand2: "toyota", model2: "corolla" },
  { brand1: "fiat", model1: "egea", brand2: "renault", model2: "clio" },
  { brand1: "bmw", model1: "3", brand2: "mercedes", model2: "c" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const modelList = selectedBrand ? models[selectedBrand] || [] : [];

  const getFirstVersion = (brandId: string, modelId: string) => {
    const brandModels = models[brandId];
    if (!brandModels) return null;
    const model = brandModels.find((m) => m.id === modelId);
    return model?.versions[0] || null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl font-bold">
              🚗
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              FiyatKarşılaştır
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/compare"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
            >
              <GitCompare className="h-5 w-5" />
              Karşılaştır
            </Link>
            <Link
              href="/dealers"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
            >
              Bayiler
            </Link>
            <Link
              href="/dealers"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
            >
              Bayiler
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-b from-blue-600 to-blue-700 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6 text-center">
            <h1 className="mb-3 font-bold text-4xl">
              Dünya vs Türkiye Araç Fiyatları
            </h1>
            <p className="mx-auto max-w-xl text-lg text-blue-100">
              İstediğin aracı seç, Dünya ve Türkiye fiyatlarını karşılaştır. ÖTV
              ve KDV dahil ne kadar vergi ödediğini gör.
            </p>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel("");
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-10 font-medium text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Marka seç</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <Car className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-10 font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Model seç</option>
                  {modelList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              <Link
                href={
                  selectedBrand && selectedModel
                    ? `/compare/${selectedBrand}/${selectedModel}`
                    : "#"
                }
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold transition-all ${
                  selectedBrand && selectedModel
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-300 text-slate-500"
                }`}
              >
                İncele
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdBanner slot="homepage-hero" />

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Popüler Markalar
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                En çok aranan markalar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {popularBrands.map((brandId) => {
              const brand = brands.find((b) => b.id === brandId);
              if (!brand) return null;
              const brandModels = models[brandId] || [];
              const totalVersions = brandModels.reduce(
                (acc, m) => acc + m.versions.length,
                0,
              );
              return (
                <Link
                  key={brandId}
                  href={`/compare/${brandId}/${brandModels[0]?.id || ""}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105 dark:bg-slate-800"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-bold text-slate-600 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300">
                    {brand.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {totalVersions} model
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img
                      src={countryFlags[brand.country]}
                      alt=""
                      className="h-4 w-6"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Öne Çıkan Karşılaştırmalar
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                En popüler araç karşılaştırmaları
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredComparisons.map((comp, idx) => {
              const brand1 = brands.find((b) => b.id === comp.brand1);
              const brand2 = brands.find((b) => b.id === comp.brand2);
              const v1 = getFirstVersion(comp.brand1, comp.model1);
              const v2 = getFirstVersion(comp.brand2, comp.model2);
              return (
                <Link
                  key={idx}
                  href={`/compare/${comp.brand1}/${comp.model1}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                        {brand1?.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {brand1?.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {v1 ? formatPrice(v1.tr) : "-"}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                        {brand2?.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {brand2?.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {v2 ? formatPrice(v2.tr) : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      Karşılaştır →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-600 dark:text-slate-300"
            >
              Tüm Karşılaştırmalar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Tüm Markalar
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {brands.length} marka arasından seçim yap
              </p>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Marka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredBrands.slice(0, 24).map((brand) => {
              const brandModels = models[brand.id] || [];
              return (
                <Link
                  key={brand.id}
                  href={
                    brandModels[0]?.id
                      ? `/compare/${brand.id}/${brandModels[0].id}`
                      : "#"
                  }
                  className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 dark:bg-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {brandModels.length} model
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredBrands.length > 24 && (
            <div className="mt-6 text-center">
              <Link
                href="/?view=all"
                className="text-blue-600 font-semibold hover:underline dark:text-blue-400"
              >
                Tüm markaları göster ({filteredBrands.length})
              </Link>
            </div>
          )}
        </div>
      </section>

      <AdBanner slot="homepage-bottom" />

      <footer className="mt-12 bg-slate-900 py-8 text-center">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-slate-400">
            © 2026 FiyatKarşılaştır • Tüm fiyatlar bilgilendirme amaçlıdır
          </p>
        </div>
      </footer>
    </div>
  );
}
