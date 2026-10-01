"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Calendar,
  Check,
  Clock,
  Heart,
  Grid3X3,
  List,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  Share2,
  SlidersHorizontal,
  Star,
  Tag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import dealersData from "@/shared/data/dealers.json";
import vehicleData from "@/shared/data/vehicles.json";
import campaignsData from "@/shared/data/campaigns.json";

function formatCurrencyTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

const { brands, models } = vehicleData as {
  brands: { id: string; name: string; country: string; logo: string }[];
  models: Record<string, { id: string; name: string; versions: any[] }[]>;
};

const { dealers } = dealersData as {
  dealers: {
    id: string;
    name: string;
    brand: string;
    city: string;
    address: string;
    phone: string;
    website: string;
    hours: string;
    services?: string[];
  }[];
};

const { campaigns } = campaignsData as {
  campaigns: {
    id: string;
    brand: string;
    title: string;
    description: string;
    discount: string;
    type: string;
    city: string;
    dealer?: string;
    endDate: string;
    link: string;
  }[];
};

const cities = [...new Set(dealers.map((d) => d.city))].sort();

const countries = [
  { code: "DE", name: "Almanya" },
  { code: "FR", name: "Fransa" },
  { code: "GB", name: "İngiltere" },
  { code: "IT", name: "İtalya" },
  { code: "ES", name: "İspanya" },
  { code: "JP", name: "Japonya" },
  { code: "KR", name: "Güney Kore" },
  { code: "US", name: "ABD" },
  { code: "CN", name: "Çin" },
];

const campaignTypes = [
  { id: "all", label: "Tümü", icon: Tag },
  { id: "faiz", label: "Faiz İndirimi", icon: TrendingUp },
  { id: "indirim", label: "İndirim", icon: Tag },
  { id: "hediye", label: "Hediye", icon: Star },
];

function formatPhone(phone: string) {
  return phone.replace(/\s+/g, "").replace("+90", "0");
}

const cityCoords: Record<string, { lat: number; lng: number }> = {
  Adana: { lat: 37.0, lng: 35.32 },
  Adıyaman: { lat: 37.76, lng: 38.28 },
  Afyon: { lat: 38.75, lng: 30.54 },
  Afyonkarahisar: { lat: 38.75, lng: 30.54 },
  Ağrı: { lat: 39.72, lng: 43.05 },
  Aksaray: { lat: 38.37, lng: 33.99 },
  Amasya: { lat: 40.65, lng: 35.83 },
  Ankara: { lat: 39.93, lng: 32.86 },
  Antalya: { lat: 36.88, lng: 30.71 },
  Ardahan: { lat: 41.11, lng: 42.7 },
  Artvin: { lat: 41.18, lng: 41.82 },
  Aydın: { lat: 37.85, lng: 27.85 },
  Balıkesir: { lat: 39.65, lng: 27.88 },
  Bartın: { lat: 41.63, lng: 32.34 },
  Batman: { lat: 37.89, lng: 41.13 },
  Bayburt: { lat: 40.26, lng: 40.23 },
  Bilecik: { lat: 40.14, lng: 29.98 },
  Bingöl: { lat: 38.89, lng: 40.5 },
  Bitlis: { lat: 38.4, lng: 42.11 },
  Bolu: { lat: 40.73, lng: 31.61 },
  Burdur: { lat: 37.72, lng: 30.29 },
  Bursa: { lat: 40.19, lng: 29.06 },
  Çanakkale: { lat: 40.15, lng: 26.41 },
  Çankırı: { lat: 40.6, lng: 33.62 },
  Çorum: { lat: 40.55, lng: 34.95 },
  Denizli: { lat: 37.77, lng: 29.09 },
  Diyarbakır: { lat: 37.91, lng: 40.21 },
  Düzce: { lat: 40.84, lng: 31.16 },
  Edirne: { lat: 41.68, lng: 26.56 },
  Elazığ: { lat: 38.68, lng: 39.22 },
  Erzincan: { lat: 39.75, lng: 39.49 },
  Erzurum: { lat: 39.9, lng: 41.27 },
  Eskişehir: { lat: 39.78, lng: 30.52 },
  Gaziantep: { lat: 37.07, lng: 37.38 },
  Giresun: { lat: 40.91, lng: 38.39 },
  Gümüşhane: { lat: 40.46, lng: 39.48 },
  Hakkari: { lat: 37.57, lng: 43.73 },
  Hatay: { lat: 36.2, lng: 36.16 },
  Iğdır: { lat: 39.92, lng: 44.05 },
  Isparta: { lat: 37.76, lng: 30.55 },
  İstanbul: { lat: 41.01, lng: 28.98 },
  İzmir: { lat: 38.42, lng: 27.13 },
  Kahramanmaraş: { lat: 37.58, lng: 36.93 },
  Karabük: { lat: 41.2, lng: 32.62 },
  Karaman: { lat: 37.18, lng: 33.22 },
  Kars: { lat: 40.61, lng: 43.09 },
  Kastamonu: { lat: 41.39, lng: 33.78 },
  Kayseri: { lat: 38.73, lng: 35.48 },
  Kırıkkale: { lat: 39.85, lng: 33.51 },
  Kırklareli: { lat: 41.73, lng: 27.22 },
  Kırşehir: { lat: 39.14, lng: 34.16 },
  Kilis: { lat: 36.72, lng: 37.12 },
  Kocaeli: { lat: 40.85, lng: 29.87 },
  Konya: { lat: 37.87, lng: 32.49 },
  Kütahya: { lat: 39.42, lng: 29.98 },
  Malatya: { lat: 38.35, lng: 38.32 },
  Manisa: { lat: 38.62, lng: 27.43 },
  Mardin: { lat: 37.31, lng: 40.74 },
  Mersin: { lat: 36.8, lng: 34.63 },
  Muğla: { lat: 37.22, lng: 28.36 },
  Muş: { lat: 38.73, lng: 41.49 },
  Nevşehir: { lat: 38.62, lng: 34.71 },
  Niğde: { lat: 37.97, lng: 34.68 },
  Ordu: { lat: 40.98, lng: 37.88 },
  Osmaniye: { lat: 37.07, lng: 36.25 },
  Rize: { lat: 41.02, lng: 40.52 },
  Sakarya: { lat: 40.69, lng: 30.43 },
  Samsun: { lat: 41.29, lng: 36.33 },
  Siirt: { lat: 37.93, lng: 41.94 },
  Sinop: { lat: 42.03, lng: 35.15 },
  Sivas: { lat: 39.75, lng: 37.02 },
  Şanlıurfa: { lat: 37.16, lng: 38.8 },
  Şırnak: { lat: 37.51, lng: 42.46 },
  Tekirdağ: { lat: 40.98, lng: 27.51 },
  Tokat: { lat: 40.31, lng: 36.55 },
  Trabzon: { lat: 41.0, lng: 39.72 },
  Tunceli: { lat: 39.11, lng: 39.54 },
  Uşak: { lat: 38.68, lng: 29.4 },
  Van: { lat: 38.5, lng: 43.38 },
  Yalova: { lat: 40.65, lng: 29.27 },
  Yozgat: { lat: 39.82, lng: 34.81 },
  Zonguldak: { lat: 41.45, lng: 31.79 },
  "Lefkoşa (KKTC)": { lat: 35.19, lng: 33.38 },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getCampaignTypeInfo(type: string) {
  switch (type) {
    case "faiz":
      return { label: "Faiz", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" };
    case "indirim":
      return { label: "İndirim", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" };
    case "hediye":
      return { label: "Hediye", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" };
    default:
      return { label: "Özel", color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" };
  }
}

function getDealerRating(dealerId: string): string {
  let hash = 0;
  for (let i = 0; i < dealerId.length; i++) {
    hash = ((hash << 5) - hash + dealerId.charCodeAt(i)) | 0;
  }
  return (4.2 + (Math.abs(hash) % 8) / 10).toFixed(1);
}

function DealersContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["sales", "campaigns", "overseas", "favorites"] as const;
  const initialTab = validTabs.includes(tabParam as any) ? tabParam : "sales";

  const [tab, setTab] = useState<(typeof validTabs)[number]>(initialTab as any);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [selectedBrandForOverseas, setSelectedBrandForOverseas] = useState<string | null>(null);
  const [favoriteDealers, setFavoriteDealers] = useState<string[]>([]);
  const [selectedCampaignType, setSelectedCampaignType] = useState("all");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "distance" | "name">("recommended");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    setLocationLoading(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
        setSortBy("distance");
      },
      () => {
        setLocationLoading(false);
        setLocationError(true);
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  };

  const clearDealerFilters = () => {
    setSelectedCity("");
    setSelectedBrand("");
    setSelectedServices([]);
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedCity ? 1 : 0) + (selectedBrand ? 1 : 0) + selectedServices.length;

  const getDealerDistance = (city: string): number | null => {
    if (!userLocation) return null;
    const coords = cityCoords[city];
    if (!coords) return null;
    return haversineKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng);
  };

  useEffect(() => {
    const saved = localStorage.getItem("favoriteDealers");
    if (saved) {
      try { setFavoriteDealers(JSON.parse(saved)); } catch {}
    }
  }, []);

  const toggleFavoriteDealer = (dealerId: string) => {
    const updated = favoriteDealers.includes(dealerId)
      ? favoriteDealers.filter((id) => id !== dealerId)
      : [...favoriteDealers, dealerId];
    setFavoriteDealers(updated);
    localStorage.setItem("favoriteDealers", JSON.stringify(updated));
  };

  const stats = useMemo(() => ({
    totalDealers: dealers.length,
    totalCities: cities.length,
    totalBrands: new Set(dealers.map((d) => d.brand)).size,
    totalCampaigns: campaigns.length,
  }), []);

  const cityDealerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dealers.forEach((d) => { counts[d.city] = (counts[d.city] || 0) + 1; });
    return counts;
  }, []);

  const brandDealerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dealers.forEach((d) => { counts[d.brand] = (counts[d.brand] || 0) + 1; });
    return counts;
  }, []);

  const allServices = useMemo(() => {
    const counts: Record<string, number> = {};
    dealers.forEach((d) => (d.services || []).forEach((s) => { counts[s] = (counts[s] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const filteredDealers = useMemo(() => {
    const list = dealers.filter((dealer) => {
      const matchesBrand = !selectedBrand || dealer.brand === selectedBrand;
      const matchesCity = !selectedCity || dealer.city === selectedCity;
      const matchesServices =
        selectedServices.length === 0 ||
        selectedServices.every((s) => dealer.services?.includes(s));
      const matchesSearch =
        !searchQuery ||
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesCity && matchesServices && matchesSearch;
    });

    const sorted = [...list];
    if (sortBy === "rating") {
      sorted.sort((a, b) => getDealerRating(b.id).localeCompare(getDealerRating(a.id)));
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    } else if (sortBy === "distance" && userLocation) {
      sorted.sort((a, b) => (getDealerDistance(a.city) ?? Infinity) - (getDealerDistance(b.city) ?? Infinity));
    }
    return sorted;
  }, [selectedBrand, selectedCity, selectedServices, searchQuery, sortBy, userLocation]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesBrand = !selectedBrand || campaign.brand === selectedBrand;
    const matchesCity = !selectedCity || campaign.city === selectedCity;
    const matchesType = selectedCampaignType === "all" || campaign.type === selectedCampaignType;
    const matchesSearch =
      !searchQuery ||
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.dealer && campaign.dealer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBrand && matchesCity && matchesType && matchesSearch;
  });

  const filteredBrands = brands.filter((brand) => {
    const matchesCountry = !selectedBrand || brand.country === selectedBrand;
    const matchesSearch = !searchQuery || brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const getBrandName = (brandId: string) => brands.find((b) => b.id === brandId)?.name || brandId;
  const getCountryName = (countryCode: string) => countries.find((c) => c.code === countryCode)?.name || countryCode;

  const handleShareCampaign = (campaign: any) => {
    if (navigator.share) {
      navigator.share({ title: campaign.title, text: campaign.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${campaign.title} - ${campaign.description}`);
    }
  };

  const filterPanel = (
    <>
      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Bayi ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Konum</h3>
        {!userLocation ? (
          <button
            onClick={requestLocation}
            disabled={locationLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            {locationLoading ? "Konum alınıyor..." : "Konumumu Kullan"}
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5 dark:bg-blue-900/30">
            <span className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              <Navigation className="h-4 w-4" /> Mesafeler aktif
            </span>
            <button
              onClick={() => { setUserLocation(null); setSortBy("recommended"); }}
              className="text-xs font-medium text-slate-500 hover:text-red-500"
            >
              Kapat
            </button>
          </div>
        )}
      {locationError && (
          <p className="mt-2 text-xs text-red-500">Konum alınamadı. Tarayıcı iznini kontrol edin.</p>
        )}
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          Mesafe, şehir merkezine göre yaklaşık hesaplanır.
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Şehir</h3>
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCity("")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              !selectedCity ? "bg-blue-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <span>Tümü</span>
            <span className={`text-xs ${!selectedCity ? "text-blue-100" : "text-slate-400"}`}>{dealers.length}</span>
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(selectedCity === city ? "" : city)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedCity === city ? "bg-blue-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span>{city}</span>
              <span className={`text-xs ${selectedCity === city ? "text-blue-100" : "text-slate-400"}`}>{cityDealerCounts[city] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Marka</h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(selectedBrand === brand.id ? "" : brand.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                selectedBrand === brand.id ? "bg-blue-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span>{brand.name}</span>
              <span className={`text-xs ${selectedBrand === brand.id ? "text-blue-100" : "text-slate-400"}`}>{brandDealerCounts[brand.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Hizmetler</h3>
        <div className="space-y-1">
          {allServices.map(([service, count]) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() =>
                  setSelectedServices(
                    selectedServices.includes(service)
                      ? selectedServices.filter((s) => s !== service)
                      : [...selectedServices, service],
                  )
                }
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span className="flex-1">{service}</span>
              <span className="text-xs text-slate-400">{count}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearDealerFilters}
          className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
        >
          Filtreleri Temizle ({activeFilterCount})
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-8 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="mb-2 text-3xl font-bold">Bayiler & Kampanyalar</h1>
          <p className="mb-6 text-blue-100">Yetkili bayiler, servisler ve güncel kampanyalar</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Building2, value: stats.totalDealers, label: "Bayi" },
              { icon: MapPin, value: stats.totalCities, label: "Şehir" },
              { icon: Users, value: stats.totalBrands, label: "Marka" },
              { icon: Tag, value: stats.totalCampaigns, label: "Kampanya" },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-blue-100">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mx-auto mb-8 flex flex-wrap justify-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setTab("sales")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
              tab === "sales"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Building2 className="h-5 w-5" />
            Bayiler
          </button>
          <button
            onClick={() => setTab("campaigns")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
              tab === "campaigns"
                ? "bg-white text-orange-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Tag className="h-5 w-5" />
            Kampanyalar
          </button>
          <button
            onClick={() => setTab("overseas")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
              tab === "overseas"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Star className="h-5 w-5" />
            Yurt Dışı
          </button>
          <button
            onClick={() => setTab("favorites")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${
              tab === "favorites"
                ? "bg-white text-red-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Heart className="h-5 w-5" />
            Favoriler
            {favoriteDealers.length > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {favoriteDealers.length}
              </span>
            )}
          </button>
        </div>

        {tab === "campaigns" && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Kampanya ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {tab === "sales" && (
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-20 space-y-4">{filterPanel}</div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{filteredDealers.length}</span> bayi bulundu
                  {userLocation && <span> • mesafeye göre sıralanabilir</span>}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden dark:bg-slate-800 dark:text-slate-300"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtreler
                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="recommended">Önerilen</option>
                    <option value="rating">Puana Göre</option>
                    <option value="name">İsme Göre (A-Z)</option>
                    <option value="distance" disabled={!userLocation}>
                      Mesafeye Göre{!userLocation ? " (konum gerekli)" : ""}
                    </option>
                  </select>
                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded-lg p-2 transition-colors ${
                        viewMode === "grid" ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-lg p-2 transition-colors ${
                        viewMode === "list" ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
            {filteredDealers.slice(0, 60).map((dealer) => {
              const rating = getDealerRating(dealer.id);
              const isFav = favoriteDealers.includes(dealer.id);
              const dist = getDealerDistance(dealer.city);
              return (
                <div
                  key={dealer.id}
                  className={`group flex ${viewMode === "grid" ? "flex-col rounded-xl bg-white p-6 shadow-sm hover:shadow-lg dark:bg-slate-800" : "flex-row items-center rounded-xl bg-white p-4 shadow-sm hover:shadow-md dark:bg-slate-800"}`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                        {dealer.brand.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{dealer.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{getBrandName(dealer.brand)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavoriteDealer(dealer.id)}
                        className={`rounded-full p-2 transition-colors ${isFav ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700"}`}
                      >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rating}</span>
                      </div>
                    </div>
                  </div>

                  {viewMode === "grid" && (
                    <div className="mb-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{dealer.city}</span>
                        {dist !== null && (
                          <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                            <Navigation className="h-3.5 w-3.5" />
                            {dist < 1 ? "1 km'den yakın" : `~${Math.round(dist)} km`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="line-clamp-2">{dealer.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-xs">{dealer.hours}</span>
                      </div>
                      {dealer.services && dealer.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {dealer.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {service}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {viewMode === "list" && (
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{dealer.city}</span>
                          {dist !== null && (
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              • {dist < 1 ? "1 km'den yakın" : `~${Math.round(dist)} km`}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-xs">{dealer.hours?.split("|")[0]}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex gap-2">
                    <a
                      href={`tel:${formatPhone(dealer.phone)}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                    >
                      <Phone className="h-4 w-4" />
                      {viewMode === "grid" ? "Ara" : ""}
                    </a>
                    <Link
                      href={`/dealers/${dealer.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300"
                    >
                      <Building2 className="h-4 w-4" />
                      Detay
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
              {filteredDealers.length === 0 && (
                <div className="rounded-xl bg-white p-8 text-center dark:bg-slate-800">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="font-medium text-slate-900 dark:text-white">Bayi bulunamadı</p>
                  <p className="mt-1 text-sm text-slate-500">Filtreleri değiştirerek tekrar deneyin</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "sales" && showMobileFilters && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-slate-50 p-4 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Filtreler</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-4">{filterPanel}</div>
              <div className="sticky bottom-0 flex gap-3 bg-slate-50 pt-3 dark:bg-slate-900">
                <button
                  onClick={clearDealerFilters}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
                >
                  Temizle
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white"
                >
                  {filteredDealers.length} Bayi Göster
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "campaigns" && (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {campaignTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedCampaignType(type.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCampaignType === type.id
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </button>
              ))}
            </div>

            {filteredCampaigns.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.slice(0, 30).map((campaign) => {
                  const daysLeft = getDaysRemaining(campaign.endDate);
                  const typeInfo = getCampaignTypeInfo(campaign.type);
                  const isUrgent = daysLeft <= 7 && daysLeft > 0;
                  const isExpired = daysLeft === 0;

                  return (
                    <div
                      key={campaign.id}
                      className={`group flex flex-col rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-slate-800 ${isExpired ? "opacity-60" : ""}`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                            <Tag className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{campaign.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{getBrandName(campaign.brand)}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>

                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
                          {campaign.discount}
                        </span>
                        {!isExpired && (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isUrgent ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          }`}>
                            {daysLeft} gün kaldı
                          </span>
                        )}
                        {isExpired && (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-700">
                            Süresi doldu
                          </span>
                        )}
                      </div>

                      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{campaign.description}</p>

                      <div className="mb-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{campaign.city}</span>
                        </div>
                        {campaign.dealer && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span>{campaign.dealer}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-xs">Geçerlilik: {campaign.endDate}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-2">
                        <a
                          href={campaign.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition-all hover:bg-orange-700"
                        >
                          İncele →
                        </a>
                        <button
                          onClick={() => handleShareCampaign(campaign)}
                          className="flex items-center justify-center rounded-xl border-2 border-slate-300 px-4 py-3 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-8 text-center dark:bg-slate-800">
                <Tag className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="font-medium text-slate-900 dark:text-white">Kampanya bulunamadı</p>
                <p className="mt-1 text-sm text-slate-500">Filtreleri değiştirerek tekrar deneyin</p>
              </div>
            )}
          </>
        )}

        {tab === "overseas" && !selectedBrandForOverseas && (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Tüm Ülkeler</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Marka ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredBrands.map((brand) => {
                const brandModels = models[brand.id] || [];
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandForOverseas(brand.id)}
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xl font-bold text-white">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-center text-sm font-medium text-slate-900 dark:text-white">{brand.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{getCountryName(brand.country)}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tab === "overseas" && selectedBrandForOverseas && (
          <div className="mb-4">
            <button
              onClick={() => setSelectedBrandForOverseas(null)}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              ← Marka değiştir
            </button>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {(models[selectedBrandForOverseas] || []).map((model) => (
                <Link
                  key={model.id}
                  href={`/compare/${selectedBrandForOverseas}/${model.id}`}
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-xl font-bold text-white">
                    {model.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-center text-sm font-medium text-slate-900 dark:text-white">{model.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{model.versions.length} versiyon</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "overseas" && filteredBrands.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center dark:bg-slate-800">
            <Star className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="font-medium text-slate-900 dark:text-white">Marka bulunamadı</p>
            <p className="mt-1 text-sm text-slate-500">Filtreleri değiştirerek tekrar deneyin</p>
          </div>
        )}

        {tab === "favorites" && (
          <div>
            {favoriteDealers.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center dark:bg-slate-800">
                <Heart className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="font-medium text-slate-900 dark:text-white">Henüz favori bayiniz yok</p>
                <p className="mt-1 text-sm text-slate-500">Bayi kartlarındaki kalp simgesine tıklayarak favori ekleyebilirsiniz.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteDealers.map((dealerId) => {
                  const dealer = dealers.find((d) => d.id === dealerId);
                  if (!dealer) return null;
                  const rating = getDealerRating(dealer.id);
                  return (
                    <div key={dealer.id} className="flex flex-col rounded-xl bg-white p-6 shadow-sm hover:shadow-lg dark:bg-slate-800">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                            {dealer.brand.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{dealer.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{getBrandName(dealer.brand)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavoriteDealer(dealer.id)}
                          className="rounded-full bg-red-100 p-2 text-red-500 hover:bg-red-200"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>

                      <div className="mb-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{dealer.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{rating} puan</span>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-2">
                        <a
                          href={`tel:${formatPhone(dealer.phone)}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                        >
                          <Phone className="h-4 w-4" /> Ara
                        </a>
                        <Link
                          href={`/dealers/${dealer.id}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300"
                        >
                          <Building2 className="h-4 w-4" /> Detay
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DealersPage() {
  return (
    <Suspense
      key={Date.now()}
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500">Yükleniyor...</div>
        </div>
      }
    >
      <DealersContent />
    </Suspense>
  );
}
