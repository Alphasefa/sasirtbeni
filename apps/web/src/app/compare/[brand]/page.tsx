"use client";

import { ArrowLeft, ExternalLink, Globe, Star } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import vehicleData from "@/shared/data/vehicles.json";
import { brandStories } from "@/shared/data/stories";
import { countryNames, countryFlags, brandWebsites } from "@/shared/data/constants";

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

function formatCurrencyTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BrandModelsPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = use(params);
  const brandModels = models[brand] || [];
  const brandInfo = brands.find((b) => b.id === brand);
  const brandName = brandInfo?.name || brand;
  const brandCountry = brandInfo?.country || "TR";
  const website = brandWebsites[brandName.toLowerCase()];

  const getModelPriceRange = (modelId: string) => {
    const model = brandModels.find((m) => m.id === modelId);
    if (!model || model.versions.length === 0) return null;
    const prices = model.versions.map((v) => v.tr).filter((p) => p > 0);
    if (prices.length === 0) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
  };

  const allPrices = brandModels.flatMap((m) => m.versions.map((v) => v.tr).filter((p) => p > 0));
  const cheapestModel = brandModels.length > 0
    ? brandModels.reduce(( cheapest, m) => {
        const mPrices = m.versions.map((v) => v.tr).filter((p) => p > 0);
        const cPrices = cheapest.versions.map((v) => v.tr).filter((p) => p > 0);
        const mMin = mPrices.length > 0 ? Math.min(...mPrices) : Infinity;
        const cMin = cPrices.length > 0 ? Math.min(...cPrices) : Infinity;
        return mMin < cMin ? m : cheapest;
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Link
          href="/compare"
          className="mb-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm Markalar
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-4 font-bold text-3xl text-slate-900 dark:text-white">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-2xl text-white">
                {brandName.charAt(0)}
              </div>
              <div>
                <span>{brandName}</span>
                <div className="flex items-center gap-2 font-normal text-sm text-slate-500">
                  <img src={countryFlags[brandCountry]} alt="" className="h-3 w-5" />
                  {countryNames[brandCountry] || brandCountry} menşeli
                </div>
              </div>
            </h1>
          </div>

          {website && (
            <div className="flex items-center gap-2">
              <a
                href={website.tr}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <img src={countryFlags.TR} alt="" className="h-3 w-5 rounded-sm" />
                Türkiye
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
              <a
                href={website.global}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
              >
                <Globe className="h-3 w-3 text-slate-400" />
                Global
                <ExternalLink className="h-3 w-3 opacity-40" />
              </a>
            </div>
          )}
        </div>

        {brandStories[brand] && (
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {brandStories[brand]}
          </p>
        )}

        {brandModels.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{brandModels.length}</div>
              <div className="text-xs text-slate-500">Model</div>
            </div>
            <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {brandModels.reduce((sum, m) => sum + m.versions.length, 0)}
              </div>
              <div className="text-xs text-slate-500">Versiyon</div>
            </div>
            <div className="rounded-xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {allPrices.length > 0 ? formatCurrencyTRY(Math.min(...allPrices)).replace("₺", "") : "-"}
              </div>
              <div className="text-xs text-slate-500">Başlangıç (₺)</div>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Modeller
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {brandModels.length} model
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brandModels.map((model) => {
            const priceRange = getModelPriceRange(model.id);
            const isCheapest = cheapestModel?.id === model.id;

            return (
              <Link
                key={model.id}
                href={`/compare/${brand}/${model.id}`}
                className={`group relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-800 ${
                  isCheapest
                    ? "border-green-300 hover:border-green-400 dark:border-green-700"
                    : "border-slate-200 hover:border-blue-400 dark:border-slate-700"
                }`}
              >
                {isCheapest && (
                  <div className="absolute -top-2 left-4 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                    <Star className="h-3 w-3" fill="currentColor" />
                    En uygun
                  </div>
                )}

                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 font-bold text-lg text-white">
                    {model.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {model.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {model.versions.length} versiyon
                    </div>
                  </div>
                </div>

                {priceRange && (
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Fiyat aralığı</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrencyTRY(priceRange.min)}
                        {priceRange.max > priceRange.min && (
                          <span className="text-slate-400"> - {formatCurrencyTRY(priceRange.max)}</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{model.versions[0]?.engine || "-"}</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
                    İncele →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {brandModels.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm dark:bg-slate-800">
            <div className="mb-3 text-4xl">🚗</div>
            <p className="font-medium text-slate-900 dark:text-white">Model bulunamadı</p>
            <p className="mt-1 text-sm text-slate-500">Bu marka için henüz veri eklenmedi</p>
          </div>
        )}
      </div>
    </div>
  );
}
