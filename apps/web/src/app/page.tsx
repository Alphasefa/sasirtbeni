"use client";

import {
  ArrowRight,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  Fuel,
  GitCompare,
  Heart,
  Leaf,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  Zap,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect, useMemo } from "react";
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

const sidebarCategories = [
  { id: "all", label: "Tüm Araçlar", icon: Car, count: listings.length, color: "text-slate-600" },
  { id: "urgent", label: "Acil Satılık", icon: Clock, count: 3, color: "text-red-600" },
  { id: "new", label: "Sıfır Araçlar", icon: Star, count: listings.filter((l) => l.isNew).length, color: "text-green-600" },
  { id: "featured", label: "Öne Çıkan İlanlar", icon: Heart, count: listings.filter((l) => l.isFeatured).length, color: "text-red-500" },
  { id: "electric", label: "Elektrikli Araçlar", icon: Zap, count: listings.filter((l) => l.fuel === "Elektrik").length, color: "text-blue-600" },
  { id: "hybrid", label: "Hibrit Araçlar", icon: Leaf, count: listings.filter((l) => l.fuel === "Hibrit").length, color: "text-emerald-600" },
  { id: "diesel", label: "Dizel Araçlar", icon: Fuel, count: listings.filter((l) => l.fuel === "Dizel").length, color: "text-amber-600" },
  { id: "gasoline", label: "Benzinli Araçlar", icon: Fuel, count: listings.filter((l) => l.fuel === "Benzin").length, color: "text-orange-600" },
  { id: "gallery", label: "Galeri İlanları", icon: Car, count: listings.filter((l) => l.sellerType === "Galeri").length, color: "text-blue-500" },
  { id: "owner", label: "Sahibinden", icon: MapPin, count: listings.filter((l) => l.sellerType === "Sahibinden").length, color: "text-green-500" },
];

const popularBrands = [
  "volkswagen", "toyota", "renault", "hyundai", "fiat", "bmw", "mercedes", "audi",
];

const sortOptions = [
  { value: "date", label: "En Yeni" },
  { value: "price-asc", label: "Ucuzdan Pahalıya" },
  { value: "price-desc", label: "Pahalıdan Ucuza" },
  { value: "year", label: "En Yeni Model" },
  { value: "km", label: "En Az Kilometre" },
];

const ITEMS_PER_PAGE = 8;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function HomeContent() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    fuel: "",
    city: "",
    priceMin: "",
    priceMax: "",
    yearMin: "",
    kmMax: "",
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favoriteVehicles") || "[]");
    setFavorites(favs.map((f: any) => f.key || f));
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setRecentlyViewed(recent);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (activeCategory === "new" && !listing.isNew) return false;
      if (activeCategory === "featured" && !listing.isFeatured) return false;
      if (activeCategory === "electric" && listing.fuel !== "Elektrik") return false;
      if (activeCategory === "hybrid" && listing.fuel !== "Hibrit") return false;
      if (activeCategory === "diesel" && listing.fuel !== "Dizel") return false;
      if (activeCategory === "gasoline" && listing.fuel !== "Benzin") return false;
      if (activeCategory === "gallery" && listing.sellerType !== "Galeri") return false;
      if (activeCategory === "owner" && listing.sellerType !== "Sahibinden") return false;
      if (filters.brand && listing.brand !== filters.brand) return false;
      if (filters.fuel && listing.fuel !== filters.fuel) return false;
      if (filters.city && listing.city !== filters.city) return false;
      if (filters.priceMin && listing.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && listing.price > Number(filters.priceMax)) return false;
      if (filters.yearMin && listing.year < Number(filters.yearMin)) return false;
      if (filters.kmMax && listing.km > Number(filters.kmMax)) return false;
      return true;
    });
  }, [activeCategory, filters]);

  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    switch (sortBy) {
      case "price-asc": return sorted.sort((a, b) => a.price - b.price);
      case "price-desc": return sorted.sort((a, b) => b.price - a.price);
      case "year": return sorted.sort((a, b) => b.year - a.year);
      case "km": return sorted.sort((a, b) => a.km - b.km);
      default: return sorted;
    }
  }, [filteredListings, sortBy]);

  const totalPages = Math.ceil(sortedListings.length / ITEMS_PER_PAGE);
  const paginatedListings = sortedListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [activeCategory, sortBy, filters]);

  const clearFilters = () => {
    setFilters({ brand: "", fuel: "", city: "", priceMin: "", priceMax: "", yearMin: "", kmMax: "" });
    setActiveCategory("all");
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (activeCategory !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-8 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-bold">
                Satılık Araçlar & Fiyat Karşılaştırma
              </h1>
              <p className="text-xs text-blue-100 md:text-sm">
                Türkiye ve Almanya fiyatlarını karşılaştır, satılık araçları incele
              </p>
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Marka veya model ara..."
                  className="w-full rounded-lg border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <Link
                href="/compare"
                className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Karşılaştır
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link href="/satilik-araclar" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20">
              🚗 Tüm İlanlar
            </Link>
            <Link href="/compare" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20">
              ⚡ Elektrikli
            </Link>
            <Link href="/dealers" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20">
              🏪 Bayiler
            </Link>
            <Link href="/hizmetler" className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20">
              🔧 Hizmetler
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex gap-5">
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-bold text-slate-900">Kategoriler</h3>
                </div>
                <div className="py-1">
                  {sidebarCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors ${
                        activeCategory === cat.id
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <cat.icon className={`h-3.5 w-3.5 ${activeCategory === cat.id ? "text-blue-600" : cat.color}`} />
                      <span className="flex-1">{cat.label}</span>
                      <span className="text-[11px] text-slate-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <h4 className="mb-3 text-sm font-bold text-slate-900">Filtreler</h4>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">Marka</label>
                    <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option value="">Tümü</option>
                      {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">Yakıt</label>
                    <select value={filters.fuel} onChange={(e) => setFilters({ ...filters, fuel: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option value="">Tümü</option>
                      <option value="Benzin">Benzin</option>
                      <option value="Dizel">Dizel</option>
                      <option value="Hibrit">Hibrit</option>
                      <option value="Elektrik">Elektrik</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">Şehir</label>
                    <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option value="">Tümü</option>
                      {["İstanbul","Ankara","İzmir","Bursa","Antalya","Konya"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">Max Fiyat</label>
                    <select value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option value="">Tümü</option>
                      <option value="1500000">1.5M₺ altı</option>
                      <option value="2000000">2M₺ altı</option>
                      <option value="3000000">3M₺ altı</option>
                      <option value="4000000">4M₺ altı</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">Min Yıl</label>
                    <select value={filters.yearMin} onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option value="">Tümü</option>
                      <option value="2024">2024+</option>
                      <option value="2023">2023+</option>
                      <option value="2022">2022+</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500">Max km</label>
                    <select value={filters.kmMax} onChange={(e) => setFilters({ ...filters, kmMax: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs">
                      <option value="">Tümü</option>
                      <option value="10000">10.000</option>
                      <option value="25000">25.000</option>
                      <option value="50000">50.000</option>
                    </select>
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="w-full rounded-xl bg-slate-100 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200">
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                <h4 className="mb-1 text-sm font-bold">Karşılaştırma Yap</h4>
                <p className="mb-3 text-[11px] text-blue-100">2 aracı karşılaştır, fiyat farklarını gör</p>
                <Link href="/compare" className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                  Başla <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  <span className="font-bold text-blue-600">{sortedListings.length}</span> ilan
                </span>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                    <X className="h-3 w-3" /> {activeFilterCount} filtre
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border-0 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 lg:hidden">
                  <SlidersHorizontal className="h-3 w-3" /> Filtre
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedListings.map((listing) => {
                const brand = brands.find((b) => b.id === listing.brand);
                return (
                  <div key={listing.id} className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Link href={`/compare/${listing.brand}/${listing.model}`}>
                        <img src={listing.image} alt={`${brand?.name} ${listing.model}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      </Link>
                      <button onClick={() => toggleFavorite(listing.id)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                        <Heart className={`h-3.5 w-3.5 ${favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                      </button>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {listing.isNew && <span className="rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">SIFIR</span>}
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
                          listing.fuel === "Elektrik" ? "bg-blue-500" : listing.fuel === "Hibrit" ? "bg-purple-500" : listing.fuel === "Dizel" ? "bg-amber-500" : "bg-slate-700"
                        }`}>{listing.fuel}</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <Link href={`/compare/${listing.brand}/${listing.model}`} className="text-xs font-semibold text-slate-900 hover:text-blue-600 line-clamp-1">
                        {brand?.name} {listing.model}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{listing.version} • {listing.year}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">{formatPrice(listing.price)}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          listing.sellerType === "Galeri" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                        }`}>{listing.sellerType}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-[10px] text-slate-400">{listing.city}</p>
                        <p className="text-[10px] text-slate-400">{listing.km.toLocaleString("tr-TR")} km</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedListings.length === 0 && (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <div className="mb-3 text-4xl">🔍</div>
                <p className="font-medium text-slate-900">İlan bulunamadı</p>
                <p className="mt-1 text-sm text-slate-500">Filtreleri değiştirerek tekrar deneyin</p>
                <button onClick={clearFilters} className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Temizle</button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm hover:bg-slate-50 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-medium shadow-sm ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm hover:bg-slate-50 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {recentlyViewed.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-slate-900">Son Bakılanlar</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {recentlyViewed.slice(0, 6).map((item: any, idx: number) => (
                    <Link key={idx} href={`/compare/${item.brand}/${item.model}`} className="flex shrink-0 items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm hover:shadow-md">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600">{item.name?.charAt(0) || "?"}</div>
                      <div>
                        <p className="text-xs font-medium text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Tekrar incele</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-slate-900">Popüler Markalar</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {popularBrands.map((brandId) => {
                  const brand = brands.find((b) => b.id === brandId);
                  if (!brand) return null;
                  const brandModels = models[brandId] || [];
                  return (
                    <Link key={brandId} href={`/compare/${brandId}`} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{brand.name.charAt(0)}</div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-slate-900">{brand.name}</h4>
                        <p className="text-[10px] text-slate-500">{brandModels.length} model</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="w-full max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h3 className="font-semibold text-slate-900">Filtreler</h3>
              <button onClick={() => setShowMobileFilters(false)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Marka</label>
                <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Tümü</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Yakıt</label>
                <select value={filters.fuel} onChange={(e) => setFilters({ ...filters, fuel: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Tümü</option>
                  <option value="Benzin">Benzin</option><option value="Dizel">Dizel</option><option value="Hibrit">Hibrit</option><option value="Elektrik">Elektrik</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Şehir</label>
                <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Tümü</option>
                  {["İstanbul","Ankara","İzmir","Bursa","Antalya","Konya"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Max Fiyat</label>
                <select value={filters.priceMax} onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="">Tümü</option>
                  <option value="1500000">1.5M₺ altı</option><option value="2000000">2M₺ altı</option><option value="3000000">3M₺ altı</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={clearFilters} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium">Temizle</button>
                <button onClick={() => setShowMobileFilters(false)} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white">{sortedListings.length} İlan Gör</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100" />}>
      <HomeContent />
    </Suspense>
  );
}
