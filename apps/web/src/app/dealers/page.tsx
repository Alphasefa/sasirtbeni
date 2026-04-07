"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Calendar,
  Check,
  Clock,
  MapPin,
  Phone,
  Search,
  Send,
  Star,
  Tag,
  Wrench,
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

function formatPhone(phone: string) {
  return phone.replace(/\s+/g, "").replace("+90", "0");
}

function DealersContent() {
  const [selectedBrandForOverseas, setSelectedBrandForOverseas] = useState<
    string | null
  >(null);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = [
    "sales",
    "service",
    "campaigns",
    "overseas",
    "favorites",
  ] as const;
  const initialTab = validTabs.includes(tabParam as any) ? tabParam : "sales";

  const [tab, setTab] = useState<(typeof validTabs)[number]>(initialTab as any);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });
  const [leadSent, setLeadSent] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteVehicles");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const addToFavorites = (vehicleKey: string) => {
    if (!favorites.includes(vehicleKey)) {
      const updated = [...favorites, vehicleKey];
      setFavorites(updated);
      localStorage.setItem("favoriteVehicles", JSON.stringify(updated));
    }
  };

  const removeFromFavorites = (vehicleKey: string) => {
    const updated = favorites.filter((f) => f !== vehicleKey);
    setFavorites(updated);
    localStorage.setItem("favoriteVehicles", JSON.stringify(updated));
  };

  const isFavorite = (vehicleKey: string) => favorites.includes(vehicleKey);

  const filteredDealers = dealers.filter((dealer) => {
    const matchesBrand = !selectedBrand || dealer.brand === selectedBrand;
    const matchesCity = !selectedCity || dealer.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesCity && matchesSearch;
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesBrand = !selectedBrand || campaign.brand === selectedBrand;
    const matchesCity = !selectedCity || campaign.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.dealer &&
        campaign.dealer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBrand && matchesCity && matchesSearch;
  });

  const filteredBrands = brands.filter((brand) => {
    const matchesCountry = !selectedBrand || brand.country === selectedBrand;
    const matchesSearch =
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModel = !selectedCity || brand.id === selectedCity;
    return matchesCountry && matchesSearch && matchesModel;
  });

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || brandId;
  };

  const getCountryName = (countryCode: string) => {
    return countries.find((c) => c.code === countryCode)?.name || countryCode;
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSent(true);
    setTimeout(() => {
      setShowLeadModal(false);
      setLeadSent(false);
      setLeadForm({ name: "", phone: "", email: "", city: "", message: "" });
    }, 2000);
  };

  const openLeadModal = (dealer: any) => {
    setSelectedDealer(dealer);
    setShowLeadModal(true);
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
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
          >
            ← Ana Sayfa
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-3 font-bold text-3xl text-slate-900 dark:text-white">
            Bayiler, Servis ve Kampanyalar
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sıfır araç için yetkili bayi, servis için yetkili servis,
            kampanyalar için kampanyalar sekmesini kullanın
          </p>
        </div>

        <div className="mx-auto mb-8 flex flex-wrap justify-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setTab("sales")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all ${
              tab === "sales"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Building2 className="h-5 w-5" />
            Bayiler
          </button>
          <button
            onClick={() => setTab("service")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all ${
              tab === "service"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Wrench className="h-5 w-5" />
            Servis
          </button>
          <button
            onClick={() => setTab("campaigns")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all ${
              tab === "campaigns"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Tag className="h-5 w-5" />
            Kampanyalar
          </button>
          <button
            onClick={() => setTab("overseas")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all ${
              tab === "overseas"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Star className="h-5 w-5" />
            Yurt Dışı Fiyatları
          </button>
          <button
            onClick={() => setTab("favorites")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-all ${
              tab === "favorites"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Star className="h-5 w-5" />
            Favoriler
            {favorites.length > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {tab === "sales" && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Bayi ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {tab === "service" && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Servis ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {tab === "campaigns" && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value="Türkiye">Türkiye Geneli</option>
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
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

        {tab === "overseas" && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Ülkeler</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
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
        )}

        {(tab === "sales" || tab === "service") && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDealers.slice(0, 30).map((dealer) => (
              <div
                key={dealer.id}
                className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-slate-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                      {dealer.brand.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {dealer.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getBrandName(dealer.brand)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{dealer.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="line-clamp-2">{dealer.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs">{dealer.hours}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <a
                    href={`tel:${formatPhone(dealer.phone)}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                  >
                    <Phone className="h-4 w-4" />
                    Ara
                  </a>
                  <button
                    onClick={() => openLeadModal(dealer)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-500 px-4 py-3 font-semibold text-green-600 transition-all hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400"
                  >
                    <Send className="h-4 w-4" />
                    Teklif Al
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === "sales" || tab === "service") &&
          filteredDealers.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                Bu kriterlere uygun bayi bulunamadı.
              </p>
            </div>
          )}

        {tab === "campaigns" && filteredCampaigns.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.slice(0, 30).map((campaign) => (
              <div
                key={campaign.id}
                className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-slate-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getBrandName(campaign.brand)}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                    {campaign.discount}
                  </span>
                </div>

                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                  {campaign.description}
                </p>

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
                    <span className="text-xs">
                      Geçerlilik: {campaign.endDate}
                    </span>
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
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "campaigns" && filteredCampaigns.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Bu kriterlere uygun kampanya bulunamadı.
            </p>
          </div>
        )}

        {tab === "overseas" && !selectedBrandForOverseas && (
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
                  <span className="text-center text-sm font-medium text-slate-900 dark:text-white">
                    {brand.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {getCountryName(brand.country)}
                  </span>
                </button>
              );
            })}
          </div>
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
                  <span className="text-center text-sm font-medium text-slate-900 dark:text-white">
                    {model.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {model.versions.length} versiyon
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "overseas" && filteredBrands.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Bu kriterlere uygun marka bulunamadı.
            </p>
          </div>
        )}

        {tab === "favorites" && (
          <div>
            {favorites.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center dark:bg-slate-800">
                <Star className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-500 dark:text-slate-400">
                  Henüz favoriniz yok.
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Karşılaştırma sayfasından araç ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {favorites.map((fav) => {
                  const [brandId, modelId, versionIdx] = fav.split("|");
                  const brandModels = models[brandId] || [];
                  const model = brandModels.find((m: any) => m.id === modelId);
                  const version = model?.versions?.[parseInt(versionIdx)];
                  if (!version) return null;

                  return (
                    <div
                      key={fav}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                            {brandId.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {brands.find((b: any) => b.id === brandId)?.name}{" "}
                              {model?.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {version.engine} • {version.hp} HP
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {formatCurrencyTRY(version.tr)}
                          </div>
                          <div className="text-sm text-slate-500">
                            €{version.de.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromFavorites(fav)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                {selectedDealer?.name}
              </h3>
              <button
                onClick={() => setShowLeadModal(false)}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <p className="mb-4 text-slate-500 dark:text-slate-400">
              Bu bayiye özel teklif istediğinizi bildirin. Sizi en kısa sürede
              arayacaklar.
            </p>

            {leadSent ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900 dark:text-white">
                  Talep Gönderildi!
                </h4>
                <p className="text-slate-500 text-center">
                  Bayi en kısa sürede sizinle iletişime geçecek.
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
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
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
                    placeholder="Hangi araç ve modeli istiyorsunuz?"
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

export default function DealersPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <DealersContent />
    </Suspense>
  );
}
