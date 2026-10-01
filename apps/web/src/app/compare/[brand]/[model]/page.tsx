"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Send,
  Share2,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { countryNames, countryFlags, brandWebsites } from "@/shared/data/constants";
import AdBanner from "@/components/ad-banner";
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

export default function ComparePage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const searchParams = useSearchParams();
  const versionParam = searchParams?.get("v");
  const { rates, convertToTRY } = useCurrency();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(
    versionParam ? parseInt(versionParam) : null,
  );
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", city: "" });
  const [leadSent, setLeadSent] = useState(false);
  const [favorites, setFavorites] = useState<
    { key: string; timestamp: number; priceTR: number; priceDE: number }[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteVehicles");
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (selectedVersion !== null) {
      setTimeout(() => {
        const el = document.getElementById("price-comparison");
        const main = document.querySelector("main");
        if (el && main) {
          main.scrollTo({ top: el.getBoundingClientRect().top + main.scrollTop - 100, behavior: "smooth" });
        }
      }, 300);
    }
  }, [selectedVersion]);

  const toggleFavorite = (idx: number) => {
    const key = `${brand}|${model}|${idx}`;
    const currentPrice = data[idx];
    const existing = favorites.find((f) => f.key === key);
    const updated = existing
      ? favorites.filter((f) => f.key !== key)
      : [...favorites, { key, timestamp: Date.now(), priceTR: currentPrice?.tr || 0, priceDE: currentPrice?.de || 0 }];
    setFavorites(updated);
    localStorage.setItem("favoriteVehicles", JSON.stringify(updated));
  };

  const isFavorite = (idx: number) =>
    favorites.some((f) => f.key === `${brand}|${model}|${idx}`);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${brandName} ${modelName}`, text: "Fiyat karşılaştırması", url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSent(true);
    setTimeout(() => {
      setShowLeadModal(false);
      setLeadSent(false);
      setLeadForm({ name: "", phone: "", city: "" });
    }, 2000);
  };

  const brandData = models[brand] || [];
  const modelData = brandData.find((m: { id: string }) => m.id === model);
  const data = modelData?.versions || [];
  const currentData = selectedVersion !== null ? data[selectedVersion] : null;
  const brandInfo = brands.find((b: { id: string }) => b.id === brand);
  const brandName = brandInfo?.name || brand;
  const modelName = modelData?.name || model;

  const currentModelIndex = brandData.findIndex((m) => m.id === model);
  const prevModel = currentModelIndex > 0 ? brandData[currentModelIndex - 1] : null;
  const nextModel = currentModelIndex < brandData.length - 1 ? brandData[currentModelIndex + 1] : null;

  if (data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl">Bu model henüz eklenmedi</h1>
          <Link href="/" className="text-blue-600 hover:underline">Ana sayfaya dön</Link>
        </div>
      </div>
    );
  }

  const taxInfo = currentData
    ? calculateTax(currentData.de, rates.USD, extractEngineCC(currentData.engine), detectFuel(currentData.engine))
    : null;

  const trPrice = currentData?.tr || 0;
  const dePriceTRY = currentData ? convertToTRY(currentData.de, "EUR") : 0;
  const diff = trPrice - dePriceTRY;
  const diffPercent = dePriceTRY > 0 ? diff / dePriceTRY : 0;
  const minimumWageTR = 22600;
  const monthsToAffordTR = Math.ceil(trPrice / minimumWageTR);
  const deMonthsToAfford = currentData ? Math.ceil(currentData.de / 2200) : 0;

  const brandWebsite = brandWebsites[brandName.toLowerCase()];
  const relevantDealers = (dealersData as any).dealers?.filter((d: any) => d.brand === brand) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Link
          href={`/compare/${brand}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {brandName} Modelleri
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 font-bold text-3xl text-slate-900 dark:text-white">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-200 font-bold text-xl text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                {brandName.charAt(0)}
              </div>
              <span>{brandName} {modelName}</span>
            </h1>
            <div className="mt-1 flex items-center gap-2 pl-[60px] text-sm text-slate-500">
              <img src={countryFlags[brandInfo?.country || "TR"]} alt="" className="h-3 w-5" />
              {countryNames[brandInfo?.country || "TR"] || brandInfo?.country}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>
        </div>

        {brandWebsite && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={brandWebsite.tr}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              <img src={countryFlags.TR} alt="" className="h-4 w-6 rounded-sm" />
              Türkiye Resmi Sitesi
              <ExternalLink className="ml-auto h-4 w-4 opacity-60" />
            </a>
            <a
              href={brandWebsite.global}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:bg-slate-800 dark:text-slate-300"
            >
              <Globe className="h-4 w-4 text-slate-400" />
              Global Web Sitesi
              <ExternalLink className="ml-auto h-4 w-4 opacity-40" />
            </a>
          </div>
        )}

        {(brandStories[brand] || modelStories[`${brand}-${model}`]) && (
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {modelStories[`${brand}-${model}`] || brandStories[brand]}
          </p>
        )}

        <div className="mb-6">
          <AdBanner slot={`hero-${brand}`} brand={brand} />
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Versiyon Seçin
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              {data.length} seçenek
            </span>
          </div>
          <div className="space-y-2">
            {data.map((item, idx) => {
              const isSelected = selectedVersion === idx;
              const dePrice = item.de;
              const trP = item.tr;
              const saving = trP - convertToTRY(dePrice, "EUR");
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedVersion(isSelected ? null : idx)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm dark:bg-blue-900/30"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-600 dark:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.engine}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{item.hp} HP</span>
                        <span className="text-slate-300">•</span>
                        <span className={saving > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {saving > 0 ? `₺${Math.round(saving / 1000)}K tasarruf` : `₺${Math.abs(Math.round(saving / 1000))}K fazla`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(idx); }}
                      className={`rounded-full p-2 transition-colors ${
                        isFavorite(idx) ? "text-yellow-400" : "text-slate-300 hover:text-yellow-400"
                      }`}
                    >
                      <Star className="h-4 w-4" fill={isFavorite(idx) ? "currentColor" : "none"} />
                    </button>
                    <ChevronDown className={`h-5 w-5 transition-transform ${
                      isSelected ? "rotate-180 text-blue-600" : "text-slate-300"
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedVersion === null && (
          <div className="mb-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-5 text-center dark:border-amber-700 dark:bg-amber-900/20">
            <p className="font-medium text-amber-700 dark:text-amber-300">
              👆 Yukarıdaki listeden bir versiyon seçerek fiyatları keşfedin
            </p>
          </div>
        )}

        <button
          onClick={() => setShowLeadModal(true)}
          className="mb-6 w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3.5 text-lg font-bold text-white shadow-lg transition-all hover:from-green-600 hover:to-green-700 hover:shadow-xl active:scale-[0.98]"
        >
          <Send className="mr-2 inline h-5 w-5" />
          Bayiden Özel Teklif Al
        </button>

        {currentData && (
          <div id="price-comparison" className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🇹🇷</span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Türkiye</div>
                  <div className="text-xs text-slate-500">Vitrin fiyatı</div>
                </div>
              </div>
              <div className="font-bold text-3xl text-slate-900 dark:text-white">
                {formatCurrency(trPrice)}
              </div>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Asgari ücrete göre</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ~{monthsToAffordTR} ay
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  ≈ {Math.floor(monthsToAffordTR / 12)} yıl {monthsToAffordTR % 12} ay
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🇩🇪</span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Almanya</div>
                  <div className="text-xs text-slate-500">mobile.de fiyatı</div>
                </div>
              </div>
              <div className="font-bold text-3xl text-slate-900 dark:text-white">
                €{currentData.de.toLocaleString()}
              </div>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Kur dönüşümü</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(dePriceTRY)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  1 EUR = {rates.USD.toFixed(2)} TL
                </div>
              </div>
            </div>
          </div>
        )}

        {currentData && (
          <div className={`mb-6 rounded-xl p-5 ${
            diff > 0
              ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
              : "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
          }`}>
            <div className="text-center">
              <div className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Türkiye'de fiyat Almanya'ya göre
              </div>
              <div className={`font-bold text-3xl ${
                diff > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
              }`}>
                {diff > 0 ? "+" : ""}{formatPercent(diffPercent)} daha pahalı
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Fark: {formatCurrency(Math.abs(diff))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/50 pt-4 dark:border-slate-600/50">
              <div className="rounded-lg bg-white/50 p-3 text-center dark:bg-slate-800/50">
                <div className="text-xs text-slate-500">🇹🇷 Asgari ücretle</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-white">
                  ~{monthsToAffordTR} ay
                </div>
              </div>
              <div className="rounded-lg bg-white/50 p-3 text-center dark:bg-slate-800/50">
                <div className="text-xs text-slate-500">🇩🇪 Asgari ücretle</div>
                <div className="mt-1 font-bold text-slate-900 dark:text-white">
                  ~{deMonthsToAfford} ay
                </div>
              </div>
            </div>
          </div>
        )}

        {taxInfo && (
          <div className="mb-6 rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
              Vergi Kırılımı
            </h3>
            <div className="space-y-4">
              {[
                { label: "Gümrük Fiyatı (EUR)", value: `€${currentData?.de.toLocaleString()}`, percent: 100, color: "bg-slate-400" },
                { label: "Matrah (Vergisiz)", value: formatCurrency(taxInfo.matrah), percent: 100, color: "bg-blue-500" },
                { label: `ÖTV (%${(taxInfo.otvRate * 100).toFixed(0)})`, value: formatCurrency(taxInfo.otvAmount), percent: (taxInfo.otvAmount / taxInfo.totalPrice) * 100, color: "bg-orange-500" },
                { label: `KDV (%${(taxInfo.kdvRate * 100).toFixed(0)})`, value: formatCurrency(taxInfo.kdvAmount), percent: (taxInfo.kdvAmount / taxInfo.totalPrice) * 100, color: "bg-red-500" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{row.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{row.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div className={`h-full rounded-full transition-all ${row.color}`} style={{ width: `${Math.min(row.percent, 100)}%` }} />
                  </div>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Toplam (Türkiye)</span>
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                    {formatCurrency(taxInfo.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(prevModel || nextModel) && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            {prevModel ? (
              <Link
                href={`/compare/${brand}/${prevModel.id}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">Önceki</div>
                  <div className="truncate font-medium text-slate-900 dark:text-white">{prevModel.name}</div>
                </div>
              </Link>
            ) : <div />}
            {nextModel && (
              <Link
                href={`/compare/${brand}/${nextModel.id}`}
                className="flex items-center justify-end gap-3 rounded-xl bg-white p-4 text-right shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
              >
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">Sonraki</div>
                  <div className="truncate font-medium text-slate-900 dark:text-white">{nextModel.name}</div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
              </Link>
            )}
          </div>
        )}

        {relevantDealers.length > 0 && (
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
              Yetkili Bayiler
            </h3>
            <div className="space-y-2">
              {relevantDealers.slice(0, 4).map((dealer: any) => (
                <div key={dealer.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white">{dealer.name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{dealer.city} • {dealer.address?.substring(0, 30)}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${dealer.phone}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={() => setShowLeadModal(false)}>
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Teklif Al
              </h3>
              <button onClick={() => setShowLeadModal(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {brandName} {modelName} için bayilerden teklif isteyin.
            </p>

            {leadSent ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-7 w-7 text-green-600" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Gönderildi!</h4>
                <p className="text-sm text-slate-500">Bayiler en kısa sürede ulaşacak.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Adınız Soyadınız"
                />
                <input
                  type="tel"
                  required
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="05XX XXX XX XX"
                />
                <select
                  required
                  value={leadForm.city}
                  onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Şehir seçin</option>
                  {["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana","Konya","Gaziantep"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-[0.98]"
                >
                  Teklif İste
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
