"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import vehicleData from "@/shared/data/vehicles.json";
import { brandStories } from "@/shared/data/stories";

const { models } = vehicleData as {
  models: Record<
    string,
    {
      id: string;
      name: string;
      versions: { engine: string; hp: number; tr: number; de: number }[];
    }[]
  >;
};

export default function BrandModelsPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = use(params);
  const router = useRouter();
  const brandModels = models[brand] || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xl">
            {brand.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {brand} - Model Seçin
            </h1>
            {brandStories[brand] && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">
                {brandStories[brand]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brandModels.map((model) => (
            <Link
              key={model.id}
              href={`/compare/${brand}/${model.id}`}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-xl font-bold text-white">
                {model.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-center text-sm font-medium text-slate-900 dark:text-white">
                {model.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {model.versions.length} versiyon
              </span>
            </Link>
          ))}
        </div>

        {brandModels.length === 0 && (
          <p className="text-center text-slate-500">Model bulunamadı</p>
        )}
      </div>
    </div>
  );
}
