"use client";

import { ArrowLeft, Check, ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import vehicleData from "@/shared/data/vehicles.json";
import { useCurrency } from "@/shared/utils/useCurrency";

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

const countryNames: Record<string, string> = {
  US: "ABD",
  DE: "Almanya",
  CZ: "Çekya",
  FR: "Fransa",
  KR: "Güney Kore",
  SE: "İsveç",
  IT: "İtalya",
  JP: "Japonya",
  TR: "Türkiye",
  GB: "İngiltere",
  ES: "İspanya",
  RO: "Romanya",
  RU: "Rusya",
  CN: "Çin",
  MY: "Malezya",
  IN: "Hindistan",
  IR: "İran",
};

const countryFlags: Record<string, string> = {
  US: "https://flagcdn.com/w40/us.png",
  DE: "https://flagcdn.com/w40/de.png",
  CZ: "https://flagcdn.com/w40/cz.png",
  FR: "https://flagcdn.com/w40/fr.png",
  KR: "https://flagcdn.com/w40/kr.png",
  SE: "https://flagcdn.com/w40/se.png",
  IT: "https://flagcdn.com/w40/it.png",
  JP: "https://flagcdn.com/w40/jp.png",
  TR: "https://flagcdn.com/w40/tr.png",
  GB: "https://flagcdn.com/w40/gb.png",
  ES: "https://flagcdn.com/w40/es.png",
  RO: "https://flagcdn.com/w40/ro.png",
  RU: "https://flagcdn.com/w40/ru.png",
  CN: "https://flagcdn.com/w40/cn.png",
  MY: "https://flagcdn.com/w40/my.png",
  IN: "https://flagcdn.com/w40/in.png",
  IR: "https://flagcdn.com/w40/ir.png",
};

interface SelectedVehicle {
  brand: string;
  model: string;
  versionIndex: number;
}

function formatCurrencyTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ComparePage() {
  const { convertToTRY } = useCurrency();
  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>([]);
  const [showBrandSelect, setShowBrandSelect] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectBrand = (brandId: string, slotIndex: number) => {
    const brandModels = models[brandId] || [];
    if (brandModels.length > 0) {
      setSelectedVehicles((prev) => {
        const updated = [...prev];
        updated[slotIndex] = {
          brand: brandId,
          model: brandModels[0].id,
          versionIndex: 0,
        };
        return updated;
      });
    }
    setShowBrandSelect(null);
    setSearchTerm("");
  };

  const selectModel = (modelId: string, slotIndex: number) => {
    setSelectedVehicles((prev) => {
      const updated = [...prev];
      if (updated[slotIndex]) {
        updated[slotIndex] = { ...updated[slotIndex], model: modelId };
      }
      return updated;
    });
  };

  const selectVersion = (versionIndex: number, slotIndex: number) => {
    setSelectedVehicles((prev) => {
      const updated = [...prev];
      if (updated[slotIndex]) {
        updated[slotIndex] = { ...updated[slotIndex], versionIndex };
      }
      return updated;
    });
  };

  const removeVehicle = (slotIndex: number) => {
    setSelectedVehicles((prev) => prev.filter((_, i) => i !== slotIndex));
  };

  const getVehicleData = (vehicle: SelectedVehicle) => {
    const brandModels = models[vehicle.brand] || [];
    const model = brandModels.find((m) => m.id === vehicle.model);
    if (!model) return null;
    return model.versions[vehicle.versionIndex] || null;
  };

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || brandId;
  };

  const getModelName = (brandId: string, modelId: string) => {
    const brandModels = models[brandId] || [];
    return brandModels.find((m) => m.id === modelId)?.name || modelId;
  };

  const comparisonRows = [
    { label: "Fiyat (Türkiye)", key: "tr", format: (v: any) => v ? formatCurrencyTRY(v.tr) : "-" },
    { label: "Fiyat (Almanya)", key: "de", format: (v: any) => v ? `€${v.de.toLocaleString()}` : "-" },
    { label: "Motor", key: "engine", format: (v: any) => v?.engine || "-" },
    { label: "Beygir Gücü", key: "hp", format: (v: any) => v ? `${v.hp} HP` : "-" },
    { label: "Ülke", key: "country", format: (_: any, brandId: string) => {
      const brand = brands.find(b => b.id === brandId);
      return countryNames[brand?.country || "DE"] || "-";
    }},
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white shadow-sm dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-slate-900 text-xl dark:text-white">
              FiyatKarşılaştır
            </span>
          </a>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </a>

        <h1 className="mb-2 font-bold text-3xl text-slate-900 dark:text-white">
          Araç Karşılaştırma
        </h1>
        <p className="mb-8 text-lg text-slate-500 dark:text-slate-400">
          En fazla 4 aracı karşılaştırabilirsiniz
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((slotIndex) => (
            <div key={slotIndex} className="relative">
              {selectedVehicles[slotIndex] ? (
                <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
                  <button
                    onClick={() => removeVehicle(slotIndex)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-slate-100 text-2xl font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {getBrandName(selectedVehicles[slotIndex].brand).charAt(0)}
                  </div>
                  <div className="mb-3 text-center">
                    <div className="font-semibold dark:text-white">
                      {getBrandName(selectedVehicles[slotIndex].brand)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {getModelName(
                        selectedVehicles[slotIndex].brand,
                        selectedVehicles[slotIndex].model
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Versiyon
                    </label>
                    <select
                      value={selectedVehicles[slotIndex].versionIndex}
                      onChange={(e) => selectVersion(Number(e.target.value), slotIndex)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      {models[selectedVehicles[slotIndex].brand]?.find(
                        (m) => m.id === selectedVehicles[slotIndex].model
                      )?.versions.map((v, idx) => (
                        <option key={idx} value={idx}>
                          {v.engine} - {v.hp} HP
                        </option>
                      ))}
                    </select>
                  </div>

                  {getVehicleData(selectedVehicles[slotIndex]) && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Türkiye:</span>
                        <span className="font-medium dark:text-white">
                          {formatCurrencyTRY(
                            getVehicleData(selectedVehicles[slotIndex])?.tr || 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Almanya:</span>
                        <span className="font-medium dark:text-white">
                          €{getVehicleData(selectedVehicles[slotIndex])?.de.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowBrandSelect(slotIndex)}
                  className="flex h-full min-h-[300px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 text-slate-400 hover:border-blue-400 hover:text-blue-500 dark:border-slate-600"
                >
                  <Plus className="h-8 w-8" />
                  <span className="mt-2">Araç ekle</span>
                </button>
              )}

              {showBrandSelect === slotIndex && (
                <div className="absolute left-0 right-0 top-0 z-50 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-600 dark:bg-slate-800">
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Marka ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="max-h-64 space-y-1 overflow-y-auto">
                    {filteredBrands.slice(0, 20).map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => selectBrand(brand.id, slotIndex)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <img
                          src={countryFlags[brand.country]}
                          alt=""
                          className="h-4 w-6"
                        />
                        <span className="dark:text-white">{brand.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedVehicles.filter(Boolean).length >= 2 && (
          <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-200">
                      Özellik
                    </th>
                    {selectedVehicles.filter(Boolean).map((v, idx) => (
                      <th key={idx} className="px-4 py-3 text-left font-medium dark:text-white">
                        {getBrandName(v.brand)} {getModelName(v.brand, v.model)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {comparisonRows.map((row) => {
                    const values = selectedVehicles
                      .filter(Boolean)
                      .map((v) => getVehicleData(v));
                    const isBestHigher = ["hp", "tr", "de"].includes(row.key);
                    const numericValues = values
                      .map((v) => (v as any)?.[row.key as keyof typeof v])
                      .filter(Boolean);
                    const bestValue = isBestHigher
                      ? Math.max(...numericValues)
                      : Math.min(...numericValues);

                    return (
                      <tr key={row.key}>
                        <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-200">
                          {row.label}
                        </td>
                        {selectedVehicles.filter(Boolean).map((v, idx) => {
                          const value = values[idx];
                          const brandId = v.brand;
                          const cellValue = (value as any)?.[row.key as keyof typeof value];
                          const isBest = cellValue === bestValue && numericValues.length > 1;
                          return (
                            <td
                              key={idx}
                              className={`px-4 py-3 dark:text-white ${
                                isBest ? "font-bold text-green-600" : ""
                              }`}
                            >
                              {row.format(cellValue, brandId)}
                              {isBest && (
                                <Check className="ml-1 inline h-4 w-4 text-green-500" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedVehicles.filter(Boolean).length < 2 && (
          <div className="mt-8 rounded-xl bg-blue-50 p-6 text-center dark:bg-blue-900/30">
            <p className="text-blue-600 dark:text-blue-400">
              En az 2 araç seçerek karşılaştırmaya başlayabilirsiniz
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
