"use client";

import {
  ArrowDownUp,
  Car,
  ChevronDown,
  ChevronRight,
  Fuel,
  Grid3X3,
  Heart,
  List,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import vehicleData from "@/shared/data/vehicles.json";
import listingsData from "@/shared/data/listings.json";

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

const listings = listingsData as any[];

const categories = [
  { id: "cars", label: "Otomobil", icon: "🚗", count: listings.length },
  { id: "electric", label: "Elektrikli Araçlar", icon: "⚡", count: listings.filter((l) => l.fuel === "Elektrik").length },
  { id: "hybrid", label: "Hibrit Araçlar", icon: "🔋", count: listings.filter((l) => l.fuel === "Hibrit").length },
  { id: "suv", label: "SUV / Crossover", icon: "🚙", count: 0 },
  { id: "commercial", label: "Ticari Araçlar", icon: "🚛", count: 0 },
  { id: "motorcycle", label: "Motosiklet", icon: "🏍️", count: 0 },
];

const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Konya", "Gaziantep", "Adana", "Kocaeli", "Mersin"];
const fuelTypes = ["Benzin", "Dizel", "Hibrit", "Elektrik"];
const transmissions = ["Otomatik", "Manuel"];
const colors = ["Beyaz", "Siyah", "Gri", "Mavi", "Kırmızı", "Gümüş", "Lacivert", "Mat Gri"];
const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const priceRanges = [
  { label: "500₺ altı", min: 0, max: 500000 },
  { label: "500B - 1M", min: 500000, max: 1000000 },
  { label: "1M - 1.5M", min: 1000000, max: 1500000 },
  { label: "1.5M - 2M", min: 1500000, max: 2000000 },
  { label: "2M - 3M", min: 2000000, max: 3000000 },
  { label: "3M - 5M", min: 3000000, max: 5000000 },
  { label: "5M+", min: 5000000, max: Infinity },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SatilikAraclarPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("cars");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    model: "",
    city: "",
    fuel: "",
    transmission: "",
    color: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
    kmMin: "",
    kmMax: "",
    sellerType: "",
  });

  const modelList = filters.brand ? models[filters.brand] || [] : [];

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const brandName = brands.find((b) => b.id === listing.brand)?.name.toLowerCase() || "";
        if (!brandName.includes(searchLower) && !listing.model.toLowerCase().includes(searchLower)) return false;
      }
      if (filters.brand && listing.brand !== filters.brand) return false;
      if (filters.model && listing.model !== filters.model) return false;
      if (filters.city && listing.city !== filters.city) return false;
      if (filters.fuel && listing.fuel !== filters.fuel) return false;
      if (filters.transmission && listing.transmission !== filters.transmission) return false;
      if (filters.color && listing.color !== filters.color) return false;
      if (filters.yearMin && listing.year < Number(filters.yearMin)) return false;
      if (filters.yearMax && listing.year > Number(filters.yearMax)) return false;
      if (filters.priceMin && listing.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && listing.price > Number(filters.priceMax)) return false;
      if (filters.kmMin && listing.km < Number(filters.kmMin)) return false;
      if (filters.kmMax && listing.km > Number(filters.kmMax)) return false;
      if (filters.sellerType && listing.sellerType !== filters.sellerType) return false;
      return true;
    });
  }, [filters]);

  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    switch (sortBy) {
      case "price-asc": return sorted.sort((a, b) => a.price - b.price);
      case "price-desc": return sorted.sort((a, b) => b.price - a.price);
      case "year": return sorted.sort((a, b) => b.year - a.year);
      case "km": return sorted.sort((a, b) => a.km - b.km);
      case "date":
      default: return sorted;
    }
  }, [filteredListings, sortBy]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ search: "", brand: "", model: "", city: "", fuel: "", transmission: "", color: "", yearMin: "", yearMax: "", priceMin: "", priceMax: "", kmMin: "", kmMax: "", sellerType: "" });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-200 py-4 dark:border-slate-700">
      <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
      {children}
    </div>
  );

  const CheckboxFilter = ({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) => (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
      <span className="flex-1 text-slate-700 dark:text-slate-300">{label}</span>
      {count !== undefined && <span className="text-xs text-slate-400">({count})</span>}
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="bg-white shadow-sm dark:bg-slate-800">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4 py-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Marka veya model ara..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value, model: "" })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm sm:block dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Tüm Şehirler</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Link
              href="/compare"
              className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 lg:flex"
            >
              <Car className="h-4 w-4" />
              Karşılaştır
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex gap-6">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Filtreler</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Temizle</button>
                )}
              </div>

              <FilterSection title="Kategori">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                      selectedCategory === cat.id ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <input type="radio" name="category" checked={selectedCategory === cat.id} onChange={() => setSelectedCategory(cat.id)} className="hidden" />
                    <span className="text-lg">{cat.icon}</span>
                    <span className="flex-1 font-medium">{cat.label}</span>
                    <span className="text-xs text-slate-400">{cat.count}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Marka">
                <div className="max-h-48 space-y-0.5 overflow-y-auto">
                  {brands.slice(0, 15).map((brand) => (
                    <CheckboxFilter
                      key={brand.id}
                      label={brand.name}
                      checked={filters.brand === brand.id}
                      onChange={() => setFilters({ ...filters, brand: filters.brand === brand.id ? "" : brand.id, model: "" })}
                      count={listings.filter((l) => l.brand === brand.id).length}
                    />
                  ))}
                </div>
              </FilterSection>

              {filters.brand && (
                <FilterSection title="Model">
                  <div className="max-h-40 space-y-0.5 overflow-y-auto">
                    {modelList.map((m) => (
                      <CheckboxFilter
                        key={m.id}
                        label={m.name}
                        checked={filters.model === m.id}
                        onChange={() => setFilters({ ...filters, model: filters.model === m.id ? "" : m.id })}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              <FilterSection title="Fiyat Aralığı">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                      className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                      className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setFilters({ ...filters, priceMin: String(range.min || ""), priceMax: range.max === Infinity ? "" : String(range.max) })}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          filters.priceMin === String(range.min || "") && filters.priceMax === (range.max === Infinity ? "" : String(range.max))
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </FilterSection>

              <FilterSection title="Yıl">
                <div className="flex flex-wrap gap-1.5">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setFilters({ ...filters, yearMin: filters.yearMin === String(year) ? "" : String(year) })}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        filters.yearMin === String(year)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Yakıt Tipi">
                {fuelTypes.map((fuel) => (
                  <CheckboxFilter
                    key={fuel}
                    label={fuel}
                    checked={filters.fuel === fuel}
                    onChange={() => setFilters({ ...filters, fuel: filters.fuel === fuel ? "" : fuel })}
                    count={listings.filter((l) => l.fuel === fuel).length}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Vites">
                {transmissions.map((t) => (
                  <CheckboxFilter
                    key={t}
                    label={t}
                    checked={filters.transmission === t}
                    onChange={() => setFilters({ ...filters, transmission: filters.transmission === t ? "" : t })}
                    count={listings.filter((l) => l.transmission === t).length}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Renk">
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFilters({ ...filters, color: filters.color === color ? "" : color })}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        filters.color === color
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Satıcı Tipi">
                <CheckboxFilter label="Galeri" checked={filters.sellerType === "Galeri"} onChange={() => setFilters({ ...filters, sellerType: filters.sellerType === "Galeri" ? "" : "Galeri" })} />
                <CheckboxFilter label="Sahibinden" checked={filters.sellerType === "Sahibinden"} onChange={() => setFilters({ ...filters, sellerType: filters.sellerType === "Sahibinden" ? "" : "Sahibinden" })} />
              </FilterSection>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="font-bold text-blue-600">{sortedListings.length}</span> ilan bulundu
                </span>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                    <X className="h-3 w-3" />
                    {activeFilterCount} filtre aktif
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1 sm:flex">
                  <ArrowDownUp className="h-4 w-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border-0 bg-transparent text-sm text-slate-600 focus:ring-0 dark:text-slate-300"
                  >
                    <option value="date">Tarihe göre</option>
                    <option value="price-asc">Ucuzdan pahalıya</option>
                    <option value="price-desc">Pahalıdan ucuza</option>
                    <option value="year">En yeni</option>
                    <option value="km">En az km</option>
                  </select>
                </div>
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-l-lg p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-r-lg p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden dark:bg-slate-700 dark:text-slate-300"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtre
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">{activeFilterCount}</span>
                  )}
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedListings.map((listing) => {
                  const brand = brands.find((b) => b.id === listing.brand);
                  return (
                    <div key={listing.id} className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg dark:bg-slate-800">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img src={listing.image} alt={`${brand?.name} ${listing.model}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                        </button>
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          {listing.isNew && <span className="rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white">SIFIR</span>}
                          {listing.isFeatured && <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white">ÖNE ÇIKAN</span>}
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            listing.fuel === "Elektrik" ? "bg-blue-500 text-white" : listing.fuel === "Hibrit" ? "bg-purple-500 text-white" : listing.fuel === "Dizel" ? "bg-amber-500 text-white" : "bg-slate-700 text-white"
                          }`}>{listing.fuel}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Link href={`/compare/${listing.brand}/${listing.model}`} className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                            {brand?.name} {listing.model}
                          </Link>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{listing.year}</span>
                        </div>
                        <p className="mb-2 text-sm text-slate-500">{listing.version}</p>
                        <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{listing.fuel}</span>
                          <span>•</span><span>{listing.transmission}</span>
                          <span>•</span><span>{listing.km.toLocaleString("tr-TR")} km</span>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-1">
                          {listing.features.slice(0, 2).map((f: string, i: number) => (
                            <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{f}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
                          <div>
                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatPrice(listing.price)}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />{listing.city}, {listing.district}
                            </div>
                          </div>
                          <div className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            listing.sellerType === "Galeri" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          }`}>{listing.sellerType}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedListings.map((listing) => {
                  const brand = brands.find((b) => b.id === listing.brand);
                  return (
                    <div key={listing.id} className="group flex gap-4 overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
                      <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <img src={listing.image} alt={`${brand?.name} ${listing.model}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
                        >
                          <Heart className={`h-3.5 w-3.5 ${favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                        </button>
                        <div className="absolute bottom-2 left-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            listing.fuel === "Elektrik" ? "bg-blue-500 text-white" : listing.fuel === "Hibrit" ? "bg-purple-500 text-white" : listing.fuel === "Dizel" ? "bg-amber-500 text-white" : "bg-slate-700 text-white"
                          }`}>{listing.fuel}</span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <Link href={`/compare/${listing.brand}/${listing.model}`} className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                              {brand?.name} {listing.model}
                            </Link>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{listing.year}</span>
                            {listing.isNew && <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">SIFIR</span>}
                          </div>
                          <p className="mb-2 text-sm text-slate-500">{listing.version}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{listing.fuel}</span>
                            <span>{listing.transmission}</span>
                            <span>{listing.km.toLocaleString("tr-TR")} km</span>
                            <span>{listing.color}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatPrice(listing.price)}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />{listing.city}, {listing.district}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              listing.sellerType === "Galeri" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }`}>{listing.sellerType}</span>
                            <a href={`tel:${listing.phone}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400">
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {sortedListings.length === 0 && (
              <div className="rounded-xl bg-white p-16 text-center shadow-sm dark:bg-slate-800">
                <div className="mb-4 text-5xl">🔍</div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Sonuç bulunamadı</p>
                <p className="mt-2 text-sm text-slate-500">Filtreleri değiştirerek veya arama terimini güncelleyerek tekrar deneyin</p>
                <button onClick={clearFilters} className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                  Tüm Filtreleri Temizle
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Filtreler</h3>
              <button onClick={() => setShowMobileFilters(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSection title="Marka">
                <div className="max-h-48 space-y-0.5 overflow-y-auto">
                  {brands.slice(0, 15).map((brand) => (
                    <CheckboxFilter key={brand.id} label={brand.name} checked={filters.brand === brand.id} onChange={() => setFilters({ ...filters, brand: filters.brand === brand.id ? "" : brand.id, model: "" })} count={listings.filter((l) => l.brand === brand.id).length} />
                  ))}
                </div>
              </FilterSection>
              <FilterSection title="Fiyat Aralığı">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.priceMin} onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })} className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                    <input type="number" placeholder="Max" value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })} className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                  </div>
                </div>
              </FilterSection>
              <FilterSection title="Yakıt Tipi">
                {fuelTypes.map((fuel) => (
                  <CheckboxFilter key={fuel} label={fuel} checked={filters.fuel === fuel} onChange={() => setFilters({ ...filters, fuel: filters.fuel === fuel ? "" : fuel })} />
                ))}
              </FilterSection>
              <FilterSection title="Vites">
                {transmissions.map((t) => (
                  <CheckboxFilter key={t} label={t} checked={filters.transmission === t} onChange={() => setFilters({ ...filters, transmission: filters.transmission === t ? "" : t })} />
                ))}
              </FilterSection>
              <FilterSection title="Şehir">
                <div className="max-h-40 space-y-0.5 overflow-y-auto">
                  {cities.map((city) => (
                    <CheckboxFilter key={city} label={city} checked={filters.city === city} onChange={() => setFilters({ ...filters, city: filters.city === city ? "" : city })} />
                  ))}
                </div>
              </FilterSection>
              <div className="sticky bottom-0 border-t border-slate-200 bg-white pt-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex gap-3">
                  <button onClick={clearFilters} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300">Temizle</button>
                  <button onClick={() => setShowMobileFilters(false)} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700">{sortedListings.length} İlan Gör</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
