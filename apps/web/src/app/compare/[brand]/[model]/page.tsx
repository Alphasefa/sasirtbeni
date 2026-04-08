"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Building2,
  Check,
  GitCompare,
  MapPin,
  Moon,
  Phone,
  Plus,
  Send,
  Share2,
  Star,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { use, useEffect, useState } from "react";
import {
  calculateTax,
  detectFuel,
  extractEngineCC,
  formatCurrency,
  formatPercent,
} from "@/features/tax-calculation/utils/taxCalculator";
import vehicleData from "@/shared/data/vehicles.json";
import dealersData from "@/shared/data/dealers.json";
import { brandStories, modelStories } from "@/shared/data/stories";
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

export default function ComparePage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const searchParams = useSearchParams();
  const versionParam = searchParams?.get("v");
  const { rates, isLoading, convertToTRY } = useCurrency();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(
    versionParam ? parseInt(versionParam) : null,
  );
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareBrand, setCompareBrand] = useState("");
  const [compareModel, setCompareModel] = useState("");
  const [compareVersion, setCompareVersion] = useState<number | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });
  const [leadSent, setLeadSent] = useState(false);
  const [favorites, setFavorites] = useState<
    { key: string; timestamp: number; priceTR: number; priceDE: number }[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteVehicles");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const toggleFavorite = (idx: number) => {
    const key = `${brand}|${model}|${idx}`;
    const currentPrice = data[idx];
    const existing = favorites.find((f) => f.key === key);

    let updated: {
      key: string;
      timestamp: number;
      priceTR: number;
      priceDE: number;
    }[];
    if (existing) {
      updated = favorites.filter((f) => f.key !== key);
    } else {
      updated = [
        ...favorites,
        {
          key,
          timestamp: Date.now(),
          priceTR: currentPrice?.tr || 0,
          priceDE: currentPrice?.de || 0,
        },
      ];
    }
    setFavorites(updated);
    localStorage.setItem("favoriteVehicles", JSON.stringify(updated));
  };

  const isFavorite = (idx: number) =>
    favorites.some((f) => f.key === `${brand}|${model}|${idx}`);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brandName} ${modelName} Fiyat Karşılaştırması`,
          text: "Bu aracın Türkiye ve Almanya fiyatlarını karşılaştırın!",
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link kopyalandı!");
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { dealers } = dealersData as {
      dealers: {
        id: string;
        name: string;
        brand: string;
        city: string;
        phone: string;
        address: string;
      }[];
    };

    const relevantDealers = dealers.filter((d) => d.brand === brand);
    const formData = {
      ...leadForm,
      vehicle: `${brandName} ${modelName}`,
      version: currentData?.engine || "",
      selectedVersion: selectedVersion !== null ? selectedVersion : 0,
    };

    console.log(
      "Lead submitted:",
      formData,
      "Dealers:",
      relevantDealers.map((d) => d.name),
    );

    setLeadSent(true);
    setTimeout(() => {
      setShowLeadModal(false);
      setLeadSent(false);
      setLeadForm({ name: "", phone: "", email: "", city: "", message: "" });
    }, 2000);
  };

  const brandData = models[brand] || [];
  const modelData = brandData.find((m: { id: string }) => m.id === model);
  const data = modelData?.versions || [];
  const currentData = selectedVersion !== null ? data[selectedVersion] : null;

  const brandInfo = brands.find((b: { id: string }) => b.id === brand);
  const brandName = brandInfo?.name || brand;
  const modelName = modelData?.name || model;

  if (data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl">Bu model henüz eklenmedi</h1>
          <a href="/" className="text-blue-600 hover:underline">
            Ana sayfaya dön
          </a>
        </div>
      </div>
    );
  }

  const taxInfo = currentData
    ? calculateTax(
        currentData.de,
        rates.USD,
        extractEngineCC(currentData.engine),
        detectFuel(currentData.engine),
      )
    : null;

  const trPrice = currentData?.tr || 0;
  const dePriceTRY = currentData ? convertToTRY(currentData.de, "EUR") : 0;
  const diff = trPrice - dePriceTRY;
  const diffPercent = dePriceTRY > 0 ? diff / dePriceTRY : 0;

  const minimumWageTR = 22600;
  const monthsToAffordTR = Math.ceil(trPrice / minimumWageTR);

  const minimumWages: Record<
    string,
    { amount: number; currency: string; name: string }
  > = {
    IT: { amount: 1900, currency: "€", name: "İtalya" },
    DE: { amount: 2200, currency: "€", name: "Almanya" },
    FR: { amount: 1800, currency: "€", name: "Fransa" },
    GB: { amount: 1700, currency: "£", name: "İngiltere" },
    US: { amount: 2200, currency: "$", name: "ABD" },
    JP: { amount: 180000, currency: "¥", name: "Japonya" },
    KR: { amount: 2000000, currency: "₩", name: "Güney Kore" },
    CN: { amount: 5000, currency: "¥", name: "Çin" },
    TR: { amount: 22600, currency: "₺", name: "Türkiye" },
    ES: { amount: 1650, currency: "€", name: "İspanya" },
    SE: { amount: 22000, currency: "kr", name: "İsveç" },
    RO: { amount: 600, currency: "lei", name: "Romanya" },
    CZ: { amount: 18000, currency: "Kč", name: "Çekya" },
  };

  const brandCountry = brandInfo?.country || "DE";
  const brandCountryWage = minimumWages[brandCountry] || minimumWages.DE;

  const compareBrandData = compareBrand ? models[compareBrand] || [] : [];
  const compareModelData = compareBrandData.find(
    (m: { id: string }) => m.id === compareModel,
  );
  const compareVersionData = compareModelData?.versions || [];
  const compareCurrentData =
    compareVersion !== null ? compareVersionData[compareVersion] : null;

  const compareBrandInfo = compareBrand
    ? brands.find((b: { id: string }) => b.id === compareBrand)
    : null;
  const compareBrandName = compareBrandInfo?.name || compareBrand;
  const compareModelName = compareModelData?.name || compareModel;

  const compareTrPrice = compareCurrentData?.tr || 0;
  const compareDePriceTRY = compareCurrentData
    ? convertToTRY(compareCurrentData.de, "EUR")
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white shadow-sm dark:bg-slate-800">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <span className="font-bold text-slate-900 text-xl dark:text-white">
                FiyatKarşılaştır
              </span>
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompare(!showCompare)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-sm ${
                  showCompare
                    ? "bg-orange-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <GitCompare className="h-4 w-4" />
                Karşılaştır
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-600 text-sm hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Share2 className="h-4 w-4" />
                Paylaş
              </button>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Tema değiştir"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 dark:text-white" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <a
          href={`/compare/${brand}`}
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </a>
        <h1 className="mb-2 flex items-center gap-4 font-bold text-4xl text-slate-900 dark:text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 font-bold text-2xl text-slate-600 dark:bg-slate-600 dark:text-slate-300">
            {brandName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span>
              {brandName} {modelName}
            </span>
            <span className="flex items-center gap-2 font-normal text-lg text-slate-500">
              <img
                src={countryFlags[brandInfo?.country || "TR"]}
                alt=""
                className="h-4 w-6"
              />
              {countryNames[brandInfo?.country || "TR"] || brandInfo?.country}
            </span>
          </div>
        </h1>
        <p className="mb-2 text-lg text-slate-500 dark:text-slate-400">
          Fiyat karşılaştırması • {currentData?.engine}
        </p>
        {(brandStories[brand] || modelStories[`${brand}-${model}`]) && (
          <p className="mb-8 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            {modelStories[`${brand}-${model}`] || brandStories[brand]}
          </p>
        )}
        {currentData && (
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
            <div className="relative h-64 w-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex items-center justify-center rounded-2xl bg-slate-300 font-bold text-6xl text-slate-500 dark:bg-slate-600 dark:text-slate-400">
                  {brandName.charAt(0)}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-4 py-2 text-white">
                <span className="font-bold">{brandName}</span> {modelName}
              </div>
              <div className="absolute right-4 bottom-4 rounded-lg bg-blue-600 px-4 py-2 text-white">
                {currentData.engine} • {currentData.hp} HP
              </div>
            </div>
          </div>
        )}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
          <label className="mb-4 block font-medium text-slate-700 text-sm dark:text-slate-200">
            Versiyon Seç
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {data.map((item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setSelectedVersion(selectedVersion === idx ? null : idx)
                }
                className={`relative rounded-lg p-4 text-left transition-all ${
                  selectedVersion === idx
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(idx);
                  }}
                  className={`absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
                    isFavorite(idx)
                      ? "bg-yellow-400 text-white"
                      : "bg-slate-200/50 text-slate-400 hover:bg-slate-300"
                  }`}
                >
                  <Star className="h-4 w-4" />
                </div>
                <div className="font-semibold">{item.engine}</div>
                <div
                  className={`text-sm ${selectedVersion === idx ? "text-blue-100" : "text-slate-500"}`}
                >
                  {item.hp} HP
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowLeadModal(true)}
          className="mb-8 w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-green-600 hover:to-green-700 hover:shadow-xl"
        >
          <Send className="mr-2 inline h-5 w-5" />
          Bayiden Özel Teklif Al
        </button>

        {showCompare && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-xl dark:text-white">
                Araç Karşılaştır
              </h3>
              <button
                onClick={() => setShowCompare(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <select
                value={compareBrand}
                onChange={(e) => {
                  setCompareBrand(e.target.value);
                  setCompareModel("");
                  setCompareVersion(null);
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Marka seç</option>
                {brands
                  .filter((b: { id: string }) => b.id !== brand)
                  .map((b: { id: string; name: string }) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
              </select>
              <select
                value={compareModel}
                onChange={(e) => {
                  setCompareModel(e.target.value);
                  setCompareVersion(null);
                }}
                disabled={!compareBrand}
                className="rounded-lg border border-slate-200 px-4 py-2 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Model seç</option>
                {compareBrandData.map((m: { id: string; name: string }) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={compareVersion?.toString() || ""}
                onChange={(e) =>
                  setCompareVersion(
                    e.target.value ? Number.parseInt(e.target.value) : null,
                  )
                }
                disabled={!compareModel}
                className="rounded-lg border border-slate-200 px-4 py-2 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Versiyon seç</option>
                {compareVersionData.map((item, idx) => (
                  <option key={idx} value={idx.toString()}>
                    {item.engine} - {item.hp} HP
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {brand === "alfaromeo" &&
          model === "tonale" &&
          selectedVersion !== null && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <iframe
                className="aspect-video w-full"
                src="https://www.youtube.com/embed/poYON3zPDik"
                title="Alfa Romeo Tonale"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="mb-4">
              <h2 className="font-semibold dark:text-white">Türkiye</h2>
              <p className="text-slate-500 text-sm">Vitrin fiyatı</p>
            </div>
            <div className="font-bold text-3xl text-slate-900 dark:text-white">
              {formatCurrency(trPrice)}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="mb-4">
              <h2 className="font-semibold dark:text-white">Almanya</h2>
              <p className="text-slate-500 text-sm">mobile.de</p>
            </div>
            <div className="font-bold text-3xl text-slate-900 dark:text-white">
              €{currentData?.de.toLocaleString()}
            </div>
            <div className="mt-1 text-slate-500 text-sm">
              ≈ {formatCurrency(dePriceTRY)} (kur dönüşümü)
            </div>
          </div>
        </div>

        {showCompare && compareCurrentData && selectedVersion !== null && (
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50 dark:divide-slate-600 dark:bg-slate-700">
              <div className="p-4 text-center">
                <div className="mb-2 text-slate-500 text-sm">Karşılaştırma</div>
              </div>
              <div className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 text-xl dark:bg-blue-900 dark:text-blue-300">
                  {brandName.charAt(0)}
                </div>
                <div className="font-bold dark:text-white">{brandName}</div>
                <div className="text-slate-500 text-sm">{modelName}</div>
              </div>
              <div className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 text-xl dark:bg-orange-900 dark:text-orange-300">
                  {compareBrandName.charAt(0)}
                </div>
                <div className="font-bold dark:text-white">
                  {compareBrandName}
                </div>
                <div className="text-slate-500 text-sm">{compareModelName}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-600">
              <div className="p-4">
                <div className="text-slate-500 text-sm">Motor</div>
              </div>
              <div className="p-4 text-center font-medium dark:text-white">
                {currentData?.engine}
              </div>
              <div className="p-4 text-center font-medium dark:text-white">
                {compareCurrentData.engine}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50 dark:divide-slate-600 dark:bg-slate-700">
              <div className="p-4">
                <div className="text-slate-500 text-sm">HP</div>
              </div>
              <div className="p-4 text-center font-medium dark:text-white">
                {currentData?.hp} HP
              </div>
              <div className="p-4 text-center font-medium dark:text-white">
                {compareCurrentData.hp} HP
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-600">
              <div className="p-4">
                <div className="text-slate-500 text-sm">Almanya Fiyat</div>
              </div>
              <div className="p-4 text-center font-bold text-blue-600">
                €{currentData?.de.toLocaleString()}
              </div>
              <div className="p-4 text-center font-bold text-orange-600">
                €{compareCurrentData.de.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50 dark:divide-slate-600 dark:bg-slate-700">
              <div className="p-4">
                <div className="text-slate-500 text-sm">Türkiye Fiyat</div>
              </div>
              <div className="p-4 text-center font-bold text-blue-600">
                {formatCurrency(trPrice)}
              </div>
              <div className="p-4 text-center font-bold text-orange-600">
                {formatCurrency(compareTrPrice)}
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-600">
              <div className="p-4">
                <div className="text-slate-500 text-sm">Fark</div>
              </div>
              <div className="col-span-2 p-4 text-center">
                <span
                  className={`inline-block rounded-full px-4 py-2 font-bold ${
                    dePriceTRY > compareDePriceTRY
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {dePriceTRY > compareDePriceTRY
                    ? `${compareBrandName} €${(dePriceTRY - compareDePriceTRY).toLocaleString()} daha uygun`
                    : `${brandName} €${(compareDePriceTRY - dePriceTRY).toLocaleString()} daha uygun`}
                </span>
              </div>
            </div>
          </div>
        )}

        {taxInfo && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <h3 className="mb-4 font-semibold text-lg dark:text-white">
              🧮 Vergi Kırılımı
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      Gümrük Çıkış Fiyatı (EUR)
                    </td>
                    <td className="py-3 text-right font-medium dark:text-white">
                      €{currentData?.de.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      Döviz Kuru (USD)
                    </td>
                    <td className="py-3 text-right font-medium dark:text-white">
                      {rates.USD.toFixed(2)} TL
                    </td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <td className="py-3 font-medium text-slate-600 dark:text-slate-200">
                      Matrah (Vergisiz Fiyat)
                    </td>
                    <td className="py-3 text-right font-medium dark:text-white">
                      {formatCurrency(taxInfo.matrah)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      ÖTV Oranı
                    </td>
                    <td className="py-3 text-right font-medium dark:text-white">
                      {formatPercent(taxInfo.otvRate)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <td className="py-3 font-medium text-slate-600 dark:text-slate-200">
                      ÖTV Tutarı
                    </td>
                    <td className="py-3 text-right font-medium text-red-600 dark:text-red-400">
                      +{formatCurrency(taxInfo.otvAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      KDV Oranı
                    </td>
                    <td className="py-3 text-right font-medium dark:text-white">
                      {formatPercent(taxInfo.kdvRate)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <td className="py-3 font-medium text-slate-600 dark:text-slate-200">
                      KDV Tutarı
                    </td>
                    <td className="py-3 text-right font-medium text-red-600 dark:text-red-400">
                      +{formatCurrency(taxInfo.kdvAmount)}
                    </td>
                  </tr>
                  <tr className="border-slate-200 border-t-2 dark:border-slate-600">
                    <td className="py-4 font-bold text-lg dark:text-white">
                      Toplam (Türkiye)
                    </td>
                    <td className="py-4 text-right font-bold text-blue-600 text-lg dark:text-blue-400">
                      {formatCurrency(taxInfo.totalPrice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div
          className={`rounded-xl p-6 ${diff > 0 ? "bg-red-50 dark:bg-red-900/30" : "bg-green-50 dark:bg-green-900/30"}`}
        >
          <div className="text-center">
            <div className="mb-2 font-medium text-lg dark:text-white">
              Türkiye'de fiyat Almanya'ya göre
            </div>
            <div
              className={`font-bold text-3xl ${diff > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
            >
              {diff > 0 ? "+" : ""}
              {formatPercent(diffPercent)} daha pahalı
            </div>
            <div className="mt-2 text-slate-600 dark:text-slate-300">
              Fark: {formatCurrency(Math.abs(diff))}
            </div>
            <div className="mt-4 border-slate-300 border-t pt-4 dark:border-slate-600">
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Türkiye (Asgari ücret {formatCurrency(minimumWageTR)} TL)
                    ile:
                  </div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-white">
                    {monthsToAffordTR} ay (~{Math.floor(monthsToAffordTR / 12)}{" "}
                    yıl)
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {brandCountryWage.name} (Asgari ücret{" "}
                    {brandCountryWage.amount.toLocaleString()}{" "}
                    {brandCountryWage.currency}) ile:
                  </div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-white">
                    ~
                    {Math.ceil(
                      (currentData?.de || 0) / brandCountryWage.amount,
                    )}{" "}
                    ay (~
                    {Math.floor(
                      Math.ceil(
                        (currentData?.de || 0) / brandCountryWage.amount,
                      ) / 12,
                    )}{" "}
                    yıl)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                {brandName} {modelName} için Teklif Al
              </h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <p className="mb-4 text-slate-500 dark:text-slate-400">
              Bu araç için yetkili bayilerden özel teklif isteyin. En kısa
              sürede size ulaşacaklar.
            </p>

            {(() => {
              const { dealers } = dealersData as {
                dealers: {
                  id: string;
                  name: string;
                  brand: string;
                  city: string;
                  phone: string;
                  address: string;
                }[];
              };
              const relevantDealers = dealers.filter((d) => d.brand === brand);

              if (relevantDealers.length === 0) {
                return (
                  <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    ℹ️ Bu marka için henüz bayi verisi yok. Formu doldurarak
                    genel teklif talep edebilirsiniz.
                  </div>
                );
              }

              return (
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Yetkili Bayi Seç
                  </label>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-2 dark:border-slate-600">
                    {relevantDealers.slice(0, 5).map((dealer) => (
                      <label
                        key={dealer.id}
                        className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <input
                          type="radio"
                          name="dealer"
                          value={dealer.id}
                          className="text-blue-600"
                          defaultChecked={dealer.id === relevantDealers[0]?.id}
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {dealer.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {dealer.city} • {dealer.address.substring(0, 40)}...
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })()}

            {leadSent ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white">
                  Talep Gönderildi!
                </h4>
                <p className="text-slate-500 text-center">
                  Bayiler en kısa sürede sizinle iletişime geçecek.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Adınızı girin"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Şehir
                  </label>
                  <select
                    required
                    value={leadForm.city}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, city: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Şehir seçin</option>
                    <option value="İstanbul">İstanbul</option>
                    <option value="Ankara">Ankara</option>
                    <option value="İzmir">İzmir</option>
                    <option value="Bursa">Bursa</option>
                    <option value="Antalya">Antalya</option>
                    <option value="Adana">Adana</option>
                    <option value="Konya">Konya</option>
                    <option value="Gaziantep">Gaziantep</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mesaj (İsteğe bağlı)
                  </label>
                  <textarea
                    value={leadForm.message}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, message: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    rows={3}
                    placeholder={`${brandName} ${modelName} için fiyat teklifi istiyorum`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-700"
                >
                  Teklif İste →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
