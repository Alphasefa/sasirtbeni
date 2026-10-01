"use client";

import { Car, Check, Plus, Search, Star, X, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import vehicleData from "@/shared/data/vehicles.json";
import {
  detectFuelType,
  detectTransmission,
  fuelTypes,
  transmissions,
  priceRanges,
} from "@/shared/utils/filters";

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

const popularBrands = [
  "volkswagen",
  "toyota",
  "renault",
  "hyundai",
  "fiat",
  "bmw",
  "mercedes",
  "audi",
];

interface SelectedVehicle {
  brand: string;
  model: string;
  versionIndex: number;
}

interface SearchResult {
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  country: string;
}

function formatCurrencyTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ComparePage() {
  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>(
    [],
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelFilter, setFuelFilter] = useState<string>("Tümü");
  const [transmissionFilter, setTransmissionFilter] = useState<string>("Tümü");
  const [priceFilter, setPriceFilter] = useState<string>("Tümü");
  const [favorites, setFavorites] = useState<
    { key: string; timestamp?: number; priceTR?: number; priceDE?: number }[]
  >([]);
  const [recentComparisons, setRecentComparisons] = useState<
    { brand: string; model: string; name: string }[]
  >([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteVehicles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavorites(
          parsed.map((f: any) => (typeof f === "string" ? { key: f } : f)),
        );
      } catch {}
    }

    const recent = JSON.parse(localStorage.getItem("recentComparisons") || "[]");
    setRecentComparisons(recent);
  }, []);

  useEffect(() => {
    if (activeSlot !== null && searchRef.current) {
      searchRef.current.focus();
    }
  }, [activeSlot]);

  const addToFavorites = (vehicle: SelectedVehicle) => {
    const key = `${vehicle.brand}|${vehicle.model}|${vehicle.versionIndex}`;
    if (!favorites.some((f) => f.key === key)) {
      const currentData = getVehicleData(vehicle);
      const updated = [
        ...favorites,
        {
          key,
          timestamp: Date.now(),
          priceTR: currentData?.tr,
          priceDE: currentData?.de,
        },
      ];
      setFavorites(updated);
      localStorage.setItem("favoriteVehicles", JSON.stringify(updated));
    }
  };

  const removeFromFavorites = (vehicle: SelectedVehicle) => {
    const key = `${vehicle.brand}|${vehicle.model}|${vehicle.versionIndex}`;
    const updated = favorites.filter((f) => f.key !== key);
    setFavorites(updated);
    localStorage.setItem("favoriteVehicles", JSON.stringify(updated));
  };

  const isFavorite = (vehicle: SelectedVehicle) => {
    const key = `${vehicle.brand}|${vehicle.model}|${vehicle.versionIndex}`;
    return favorites.some((f) => f.key === key);
  };

  const searchResults: SearchResult[] = searchTerm
    ? brands
        .flatMap((brand) => {
          const brandModels = models[brand.id] || [];
          return brandModels.map((model) => ({
            brandId: brand.id,
            brandName: brand.name,
            modelId: model.id,
            modelName: model.name,
            country: brand.country,
          }));
        })
        .filter(
          (item) =>
            item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${item.brandName} ${item.modelName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
        .slice(0, 12)
    : [];

  const selectVehicle = (result: SearchResult, slotIndex: number) => {
    setSelectedVehicles((prev) => {
      const updated = [...prev];
      updated[slotIndex] = {
        brand: result.brandId,
        model: result.modelId,
        versionIndex: 0,
      };
      return updated;
    });

    const brandName = result.brandName;
    const modelName = result.modelName;
    const recent = JSON.parse(localStorage.getItem("recentComparisons") || "[]");
    const newRecent = [
      { brand: result.brandId, model: result.modelId, name: `${brandName} ${modelName}` },
      ...recent.filter((r: any) => !(r.brand === result.brandId && r.model === result.modelId)),
    ].slice(0, 6);
    localStorage.setItem("recentComparisons", JSON.stringify(newRecent));
    setRecentComparisons(newRecent);

    setActiveSlot(null);
    setSearchTerm("");
  };

  const quickSelect = (brandId: string, modelId: string, slotIndex: number) => {
    setSelectedVehicles((prev) => {
      const updated = [...prev];
      updated[slotIndex] = {
        brand: brandId,
        model: modelId,
        versionIndex: 0,
      };
      return updated;
    });
    setActiveSlot(null);
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

  const getModelVersions = (brandId: string, modelId: string) => {
    const brandModels = models[brandId] || [];
    const allVersions =
      brandModels.find((m) => m.id === modelId)?.versions || [];

    return allVersions.filter((v: any) => {
      if (fuelFilter !== "Tümü" && detectFuelType(v.engine) !== fuelFilter)
        return false;
      if (
        transmissionFilter !== "Tümü" &&
        detectTransmission(v.engine) !== transmissionFilter
      )
        return false;
      if (priceFilter !== "Tümü") {
        const range = priceRanges.find((r) => r.label === priceFilter);
        if (range && (v.tr < range.min || v.tr > range.max)) return false;
      }
      return true;
    });
  };

  const comparisonRows = [
    {
      label: "Fiyat (Türkiye)",
      key: "tr",
      format: (v: any) => (v?.tr ? formatCurrencyTRY(v.tr) : "-"),
    },
    {
      label: "Fiyat (Almanya)",
      key: "de",
      format: (v: any) => (v?.de ? `€${v.de.toLocaleString()}` : "-"),
    },
    { label: "Motor", key: "engine", format: (v: any) => v?.engine || "-" },
    {
      label: "Yakıt Tipi",
      key: "fuel",
      format: (v: any) => (v?.engine ? detectFuelType(v.engine) : "-"),
    },
    {
      label: "Vites",
      key: "transmission",
      format: (v: any) => (v?.engine ? detectTransmission(v.engine) : "-"),
    },
    {
      label: "Beygir Gücü",
      key: "hp",
      format: (v: any) => (v?.hp ? `${v.hp} HP` : "-"),
    },
  ];

  const selectedCount = selectedVehicles.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-3xl text-slate-900 dark:text-white">
            Araç Karşılaştır
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            En fazla 4 aracı karşılaştırabilirsiniz
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {fuelTypes.map((f) => (
            <button
              key={f}
              onClick={() => setFuelFilter(fuelFilter === f ? "Tümü" : f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                fuelFilter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          {transmissions.map((t) => (
            <button
              key={t}
              onClick={() =>
                setTransmissionFilter(transmissionFilter === t ? "Tümü" : t)
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                transmissionFilter === t
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          {priceRanges.map((p) => (
            <button
              key={p.label}
              onClick={() =>
                setPriceFilter(priceFilter === p.label ? "Tümü" : p.label)
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                priceFilter === p.label
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((slotIndex) => {
            const vehicle = selectedVehicles[slotIndex];
            const isSelected = !!vehicle;

            return (
              <div key={slotIndex} className="relative">
                {isSelected ? (
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-slate-800">
                    <div className="absolute right-3 top-3 z-10 flex gap-2">
                      <button
                        onClick={() =>
                          isFavorite(vehicle)
                            ? removeFromFavorites(vehicle)
                            : addToFavorites(vehicle)
                        }
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          isFavorite(vehicle)
                            ? "bg-yellow-400 text-white hover:bg-yellow-500"
                            : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                        }`}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeVehicle(slotIndex)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="mb-4 flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-4xl font-bold text-slate-600 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300">
                        {getBrandName(vehicle.brand).charAt(0)}
                      </div>

                      <div className="mb-4 text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {getBrandName(vehicle.brand)}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {getModelName(vehicle.brand, vehicle.model)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          Versiyon seç
                        </label>
                        <select
                          value={vehicle.versionIndex}
                          onChange={(e) =>
                            selectVersion(Number(e.target.value), slotIndex)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                          {getModelVersions(vehicle.brand, vehicle.model).map(
                            (v, idx) => (
                              <option key={idx} value={idx}>
                                {v.engine} • {v.hp} HP
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {getVehicleData(vehicle) && (
                        <div className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                              🇹🇷 Türkiye
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {formatCurrencyTRY(
                                getVehicleData(vehicle)?.tr || 0,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                              🇩🇪 Almanya
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              €{getVehicleData(vehicle)?.de.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveSlot(slotIndex);
                      setSearchTerm("");
                    }}
                    className="flex h-full min-h-[280px] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-slate-400 transition-all hover:border-blue-400 hover:text-blue-500 hover:shadow-lg dark:border-slate-600 dark:bg-slate-800"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                      <Plus className="h-8 w-8" />
                    </div>
                    <span className="font-medium">Araç ekle</span>
                    <span className="text-sm">{slotIndex + 1}. araç</span>
                  </button>
                )}

                {activeSlot === slotIndex && (
                  <div className="absolute left-0 right-0 top-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-800">
                    <div className="border-b border-slate-200 p-4 dark:border-slate-600">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          ref={searchRef}
                          type="text"
                          placeholder="Marka veya model ara... (ör: Volkswagen Golf)"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                    </div>

                    {!searchTerm && (
                      <div className="border-b border-slate-200 p-4 dark:border-slate-600">
                        <div className="mb-2 text-xs font-medium text-slate-500">
                          Popüler Markalar
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularBrands.map((brandId) => {
                            const brand = brands.find((b) => b.id === brandId);
                            if (!brand) return null;
                            const brandModels = models[brandId] || [];
                            return (
                              <button
                                key={brandId}
                                onClick={() => {
                                  if (brandModels.length > 0) {
                                    selectVehicle(
                                      {
                                        brandId: brand.id,
                                        brandName: brand.name,
                                        modelId: brandModels[0].id,
                                        modelName: brandModels[0].name,
                                        country: brand.country,
                                      },
                                      slotIndex,
                                    );
                                  }
                                }}
                                className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-blue-900"
                              >
                                <span className="font-bold">{brand.name.charAt(0)}</span>
                                {brand.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!searchTerm && recentComparisons.length > 0 && (
                      <div className="border-b border-slate-200 p-4 dark:border-slate-600">
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Clock className="h-3 w-3" />
                          Son Karşılaştırmalar
                        </div>
                        <div className="space-y-1">
                          {recentComparisons.slice(0, 4).map((recent, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                quickSelect(recent.brand, recent.model, slotIndex)
                              }
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                                {recent.name.charAt(0)}
                              </div>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {recent.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="max-h-80 overflow-y-auto p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <button
                            key={`${result.brandId}-${result.modelId}`}
                            onClick={() => selectVehicle(result, slotIndex)}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                              {result.brandName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 dark:text-white">
                                {result.brandName}
                              </div>
                              <div className="text-sm text-slate-500">
                                {result.modelName}
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">
                              {models[result.brandId]?.find((m) => m.id === result.modelId)?.versions.length || 0} versiyon
                            </span>
                          </button>
                        ))
                      ) : searchTerm ? (
                        <p className="p-4 text-center text-slate-500">
                          &quot;{searchTerm}&quot; için sonuç bulunamadı
                        </p>
                      ) : (
                        <div className="p-4 text-center text-slate-500">
                          Marka veya model adı yazarak arama yapın
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveSlot(null);
                        setSearchTerm("");
                      }}
                      className="w-full border-t border-slate-200 py-3 text-center font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      Kapat
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedCount >= 2 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Karşılaştırma Tablosu
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedCount} araç karşılaştırılıyor
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-200">
                      Özellik
                    </th>
                    {selectedVehicles.filter(Boolean).map((v, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-4 text-left font-bold dark:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                            {getBrandName(v.brand).charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold">
                              {getBrandName(v.brand)}
                            </div>
                            <div className="text-sm font-normal text-slate-500">
                              {getModelName(v.brand, v.model)}
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {comparisonRows.map((row) => {
                    const values = selectedVehicles
                      .filter(Boolean)
                      .map((v) => getVehicleData(v));
                    const numericValues = values
                      .map((v) => (v as any)?.[row.key as keyof typeof v])
                      .filter((v) => typeof v === "number");
                    const bestValue =
                      numericValues.length > 0
                        ? Math.max(...(numericValues as number[]))
                        : null;

                    return (
                      <tr
                        key={row.key}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-200">
                          {row.label}
                        </td>
                        {selectedVehicles.filter(Boolean).map((v, idx) => {
                          const value = values[idx];
                          const cellValue = (value as any)?.[
                            row.key as keyof typeof value
                          ];
                          const isBest =
                            cellValue === bestValue && bestValue !== null;

                          return (
                            <td
                              key={idx}
                              className={`px-6 py-4 dark:text-white ${
                                isBest ? "font-bold text-green-600" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {row.format(cellValue)}
                                {isBest && (
                                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900">
                                    <Check className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
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

        {selectedCount < 2 && (
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center dark:from-blue-900/30 dark:to-indigo-900/30">
            <Car className="mx-auto mb-4 h-12 w-12 text-blue-400" />
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              En az 2 araç seçerek karşılaştırmaya başlayabilirsiniz
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {4 - selectedCount} araç daha ekleyebilirsiniz
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {[
            "Volkswagen Golf",
            "Toyota Corolla",
            "Fiat Egea",
            "Renault Clio",
          ].map((name) => {
            const [brand, model] = name.toLowerCase().split(" ");
            return (
              <Link
                key={name}
                href={`/compare/${brand}/${model}`}
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:text-blue-600 hover:shadow-md dark:bg-slate-800 dark:text-slate-300"
              >
                {name} →
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
