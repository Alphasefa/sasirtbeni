"use client";

import {
  ArrowRight,
  Car,
  Clock,
  Factory,
  Filter,
  GitCompare,
  Heart,
  Leaf,
  Plus,
  Search,
  Star,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import AdBanner from "@/components/ad-banner";
import vehicleData from "@/shared/data/vehicles.json";
import dealersData from "@/shared/data/dealers.json";

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

const countryFlags: Record<string, string> = {
  US: "https://flagcdn.com/w40/us.png",
  DE: "https://flagcdn.com/w40/de.png",
  JP: "https://flagcdn.com/w40/jp.png",
  KR: "https://flagcdn.com/w40/kr.png",
  FR: "https://flagcdn.com/w40/fr.png",
  IT: "https://flagcdn.com/w40/it.png",
  GB: "https://flagcdn.com/w40/gb.png",
  TR: "https://flagcdn.com/w40/tr.png",
  CN: "https://flagcdn.com/w40/cn.png",
};

const popularBrands = [
  "volkswagen",
  "toyota",
  "renault",
  "hyundai",
  "fiat",
  "peugeot",
  "bmw",
  "mercedes",
  "audi",
  "ford",
];

const featuredComparisons = [
  { brand1: "volkswagen", model1: "golf", brand2: "toyota", model2: "corolla" },
  { brand1: "fiat", model1: "egea", brand2: "renault", model2: "clio" },
  { brand1: "bmw", model1: "3", brand2: "mercedes", model2: "c" },
];

const popularUsedCars = [
  { brand: "volkswagen", model: "passat", name: "Volkswagen Passat" },
  { brand: "toyota", model: "corolla", name: "Toyota Corolla" },
  { brand: "mercedes", model: "c-serisi", name: "Mercedes C Serisi" },
  { brand: "bmw", model: "3-serisi", name: "BMW 3 Serisi" },
  { brand: "audi", model: "a4", name: "Audi A4" },
  { brand: "ford", model: "focus", name: "Ford Focus" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function getVehicleType(
  engine: string,
): "electric" | "hybrid" | "internal" | null {
  const e = engine.toLowerCase();
  if (
    e.includes("ev") ||
    e.includes("electric") ||
    e === "ev" ||
    e.includes("e-tron") ||
    e.includes("iq") ||
    e.includes("rz") ||
    e.includes("eletre")
  ) {
    return "electric";
  }
  if (
    e.includes("hybrid") ||
    e.includes("hev") ||
    e.includes("phev") ||
    e.includes("plug-in") ||
    e.includes("e-tech")
  ) {
    return "hybrid";
  }
  return null;
}

const electricBrands = [
  "tesla",
  "togg",
  "byd",
  "aion",
  "leapmotor",
  "xev",
  "volta",
  "nio",
];

const electricModels: { brand: string; model: string }[] = [];

function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [showHikaye, setShowHikaye] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<
    { brand: string; model: string; name: string; price: number }[]
  >([]);
  const [favoriteKeys, setFavoriteKeys] = useState<
    { key: string; priceTR?: number }[]
  >([]);
  const [myCars, setMyCars] = useState<
    {
      id: string;
      brand: string;
      model: string;
      year: number;
      km: number;
      price: number;
      description: string;
    }[]
  >([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    km: 0,
    price: 0,
    description: "",
  });
  const [carFilter, setCarFilter] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: 0,
    minYear: 0,
    maxKm: 0,
  });
  const searchParams = useSearchParams();
  const showElectricHybrid = searchParams.get("filter") === "electric";

  useEffect(() => {
    const gosterildi = localStorage.getItem("hikayeGosterildi");
    if (!gosterildi) {
      setShowHikaye(true);
      localStorage.setItem("hikayeGosterildi", "true");
    }

    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setRecentlyViewed(recent);

    const favs = JSON.parse(localStorage.getItem("favoriteVehicles") || "[]");
    setFavoriteKeys(favs);

    const myCarsData = JSON.parse(localStorage.getItem("myCars") || "[]");
    setMyCars(myCarsData);
  }, []);

  const addMyCar = () => {
    if (newCar.brand && newCar.model) {
      const car = { ...newCar, id: Date.now().toString() };
      const updated = [...myCars, car];
      setMyCars(updated);
      localStorage.setItem("myCars", JSON.stringify(updated));
      setShowAddCar(false);
      setNewCar({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        km: 0,
        price: 0,
        description: "",
      });
    }
  };

  const removeMyCar = (id: string) => {
    const updated = myCars.filter((c) => c.id !== id);
    setMyCars(updated);
    localStorage.setItem("myCars", JSON.stringify(updated));
  };

  const filteredMyCars = myCars.filter((car) => {
    if (
      carFilter.brand &&
      car.brand.toLowerCase() !== carFilter.brand.toLowerCase()
    )
      return false;
    if (carFilter.minPrice && car.price < carFilter.minPrice) return false;
    if (carFilter.maxPrice && car.price > carFilter.maxPrice) return false;
    if (carFilter.maxKm && car.km > carFilter.maxKm) return false;
    return true;
  });

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const modelList = selectedBrand ? models[selectedBrand] || [] : [];

  const getFirstVersion = (brandId: string, modelId: string) => {
    const brandModels = models[brandId];
    if (!brandModels) return null;
    const model = brandModels.find((m) => m.id === modelId);
    return model?.versions[0] || null;
  };

  const electricAndHybridCars: {
    brandId: string;
    modelId: string;
    modelName: string;
    engine: string;
    hp: number;
    tr: number;
    type: "electric" | "hybrid";
  }[] = [];
  for (const [brandId, brandModels] of Object.entries(models)) {
    for (const model of brandModels) {
      for (const version of model.versions) {
        const vehicleType = getVehicleType(version.engine);
        if (vehicleType && vehicleType !== "internal") {
          electricAndHybridCars.push({
            brandId,
            modelId: model.id,
            modelName: model.name,
            engine: version.engine,
            hp: version.hp,
            tr: version.tr,
            type: vehicleType,
          });
        }
      }
    }
  }

  const sortedElectricHybrid = electricAndHybridCars
    .sort((a, b) => a.tr - b.tr)
    .slice(0, 12);

  const renderElectricHybridCard = (
    car: (typeof electricAndHybridCars)[0],
    idx: number,
  ) => {
    const brand = brands.find((b) => b.id === car.brandId);
    return (
      <Link
        key={`${car.brandId}-${car.modelId}-${idx}`}
        href={`/compare/${car.brandId}/${car.modelId}`}
        className="group rounded-xl border border-emerald-200 bg-white p-5 transition-all hover:border-emerald-400 hover:shadow-lg dark:border-emerald-800 dark:bg-slate-800"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold dark:bg-emerald-900">
              {brand?.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-white">
                {brand?.name} {car.modelName}
              </div>
            </div>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              car.type === "electric"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            }`}
          >
            {car.type === "electric" ? "EV" : "Hybrid"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {car.engine} • {car.hp} HP
          </div>
          <div className="font-bold text-emerald-600">
            {formatPrice(car.tr)}
          </div>
        </div>
      </Link>
    );
  };

  if (showHikaye) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
        <div className="max-w-2xl rounded-3xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-4xl">
              🚗
            </div>
          </div>
          <h1 className="mb-4 text-center font-bold text-2xl text-slate-900">
            Biz O Manzarayı Gördük Yaşadık ve Bir Söz Verdik
          </h1>
          <div className="space-y-3 text-base leading-relaxed text-slate-700">
            <p>
              Hava kararırken, otoyolun kalabalığında gri bir sedan hızla
              ilerliyordu. Direksiyonun başındaki sürücü, zihninde o akşamki
              planlarını düşünüyordu. Ancak aracın ön panelinde, sessizce
              yükselen kırmızı bir çizgi vardı: Hararet ibresi.
            </p>
            <p>
              Araba, kendi dilinde imdat çığlığı atıyordu. Sürücü bir an
              duraksadı ve "Şuradan sağa sapınca eve varırım zaten, dayanır
              herhalde" dedi.
            </p>
            <p className="font-bold text-red-600">
              İşte o an, aslında sadece bir yol tercihi de��il, 100.000 TL'lik
              bir karar veriyordu.
            </p>
          </div>
          <div className="mt-6 rounded-xl bg-red-50 p-4">
            <p className="text-sm text-slate-700">
              Dışarıdan her şey normal görünüyordu; ta ki kaputtan ince bir
              duman sızana kadar. O birkaç kilometrelik "dayanır" inadı, motorun
              içinde görünmez bir savaşı başlatmıştı. Önce 10.000 TL'lik soğutma
              hortumu teslim oldu. Ardından ısı motorun kalbine ulaştı. En
              sonunda pistonlar yuvalarına kaynadı.
            </p>
            <p className="font-bold text-red-600 mt-2">
              10.000 TL ile kurtulabilecek o an, 100.000 TL'lik enkaz
              bırakmıştı.
            </p>
          </div>
          <div className="mt-6 rounded-xl bg-orange-50 p-4 text-center">
            <p className="font-bold text-orange-800">
              Biz bu manzarayı gördük ve bir söz verdik: Kimse bu çaresizlikle
              yol kenarında kalmasın.
            </p>
            <p className="mt-2 text-orange-700">
              Araç fiyatlarını karşılaştırın, yedek parça ve servis fiyatlarını
              inceleyin, bilinçli karar verin.
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <Link
              href="/hikayemiz"
              className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white text-center transition-colors hover:bg-orange-600"
            >
              Detaylı Oku
            </Link>
            <button
              onClick={() => setShowHikaye(false)}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Anladım
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800">
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6 text-center">
            <h1 className="mb-3 font-bold text-4xl">
              Dünya vs Türkiye Araç Fiyatları
            </h1>
            <p className="mx-auto max-w-xl text-lg text-blue-100">
              İstediğin aracı seç, Dünya ve Türkiye fiyatlarını karşılaştır. ÖTV
              ve KDV dahil ne kadar vergi ödediğini gör.
            </p>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel("");
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-10 font-medium text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Marka seç</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <Car className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-10 font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Model seç</option>
                  {modelList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
              <Link
                href={
                  selectedBrand && selectedModel
                    ? `/compare/${selectedBrand}/${selectedModel}`
                    : "#"
                }
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold transition-all ${
                  selectedBrand && selectedModel
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-300 text-slate-500"
                }`}
              >
                İncele
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdBanner slot="homepage-categories" />

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Popüler Markalar
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                En çok aranan markalar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {popularBrands.map((brandId) => {
              const brand = brands.find((b) => b.id === brandId);
              if (!brand) return null;
              const brandModels = models[brandId] || [];
              const totalVersions = brandModels.reduce(
                (acc, m) => acc + m.versions.length,
                0,
              );
              return (
                <Link
                  key={brandId}
                  href={`/compare/${brandId}/${brandModels[0]?.id || ""}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105 dark:bg-slate-800"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-bold text-slate-600 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300">
                    {brand.name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {totalVersions} model
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img
                      src={countryFlags[brand.country]}
                      alt=""
                      className="h-4 w-6"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                  2. El Araçlarım
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Yüklediğiniz araçlar ve filtreler
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddCar(true)}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              <Plus className="h-5 w-5" /> Araç Ekle
            </button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <select
              value={carFilter.brand}
              onChange={(e) =>
                setCarFilter({ ...carFilter, brand: e.target.value })
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">Tüm Markalar</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Fiyat (TL)"
              value={carFilter.minPrice || ""}
              onChange={(e) =>
                setCarFilter({ ...carFilter, minPrice: Number(e.target.value) })
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <input
              type="number"
              placeholder="Max Fiyat (TL)"
              value={carFilter.maxPrice || ""}
              onChange={(e) =>
                setCarFilter({ ...carFilter, maxPrice: Number(e.target.value) })
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <input
              type="number"
              placeholder="Max Km"
              value={carFilter.maxKm || ""}
              onChange={(e) =>
                setCarFilter({ ...carFilter, maxKm: Number(e.target.value) })
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          {filteredMyCars.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <Car className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Henüz araç eklemediniz.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {filteredMyCars.map((car) => (
                <div
                  key={car.id}
                  className="group relative rounded-2xl bg-white p-4 shadow-md"
                >
                  <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-slate-100 text-4xl">
                    🚗
                  </div>
                  <h3 className="font-bold text-lg">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {car.year} • {car.km?.toLocaleString()} km
                  </p>
                  <p className="mt-2 font-bold text-xl text-green-600">
                    {car.price?.toLocaleString()} TL
                  </p>
                  <button
                    onClick={() => removeMyCar(car.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-100 p-2 text-red-500 hover:bg-red-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showAddCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-xl">2. El Araç Ekle</h3>
              <button
                onClick={() => setShowAddCar(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Marka"
                value={newCar.brand}
                onChange={(e) =>
                  setNewCar({ ...newCar, brand: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <input
                type="text"
                placeholder="Model"
                value={newCar.model}
                onChange={(e) =>
                  setNewCar({ ...newCar, model: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Yıl"
                  value={newCar.year}
                  onChange={(e) =>
                    setNewCar({ ...newCar, year: Number(e.target.value) })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />
                <input
                  type="number"
                  placeholder="Km"
                  value={newCar.km || ""}
                  onChange={(e) =>
                    setNewCar({ ...newCar, km: Number(e.target.value) })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>
              <input
                type="number"
                placeholder="Fiyat (TL)"
                value={newCar.price || ""}
                onChange={(e) =>
                  setNewCar({ ...newCar, price: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <button
                onClick={addMyCar}
                className="w-full rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white py-12 dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Öne Çıkan Karşılaştırmalar
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                En popüler araç karşılaştırmaları
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredComparisons.map((comp, idx) => {
              const brand1 = brands.find((b) => b.id === comp.brand1);
              const brand2 = brands.find((b) => b.id === comp.brand2);
              const v1 = getFirstVersion(comp.brand1, comp.model1);
              const v2 = getFirstVersion(comp.brand2, comp.model2);
              return (
                <Link
                  key={idx}
                  href={`/compare/${comp.brand1}/${comp.model1}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                        {brand1?.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {brand1?.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {v1 ? formatPrice(v1.tr) : "-"}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                        {brand2?.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {brand2?.name}
                      </span>
                      <span className="text-sm text-slate-500">
                        {v2 ? formatPrice(v2.tr) : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      Karşılaştır →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Öne Çıkan Bayiler
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                En yüksek puanlı satış bayilerimiz
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {dealersData.dealers.slice(0, 3).map((dealer: any) => (
              <Link
                key={dealer.id}
                href={`/dealers/${dealer.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-green-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 font-bold dark:bg-green-900">
                    {dealer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {dealer.name}
                    </h3>
                    <p className="text-sm text-slate-500">{dealer.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    4.8
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dealer.services
                    ?.slice(0, 3)
                    .map((service: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {service}
                      </span>
                    ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/dealers?tab=sales"
              className="inline-flex items-center gap-2 rounded-xl border border-green-300 px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 dark:border-green-700 dark:text-green-400"
            >
              Tüm Bayileri Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="bg-white py-12 dark:bg-slate-800">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                  Son Bakılanlar
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  En son incelediğiniz araçlar
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {recentlyViewed.slice(0, 4).map((item, idx) => (
                <Link
                  key={idx}
                  href={`/compare/${item.brand}/${item.model}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-purple-300 hover:shadow-md dark:border-slate-600 dark:bg-slate-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold dark:bg-purple-900">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">Tekrar incele</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {favoriteKeys.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                  Favorilerim
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Kaydettiğiniz araçlar
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {favoriteKeys.slice(0, 4).map((item, idx) => {
                const [brand, model] = (item.key || "").split("|");
                const brandName =
                  brands.find((b) => b.id === brand)?.name || brand;
                return (
                  <Link
                    key={idx}
                    href={brand && model ? `/compare/${brand}/${model}` : "#"}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-red-300 hover:shadow-md dark:border-slate-600 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold dark:bg-red-900">
                        {(brandName || "?").charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {brandName} {model}
                        </div>
                        <div className="font-bold text-red-600">
                          {item.priceTR
                            ? formatPrice(item.priceTR)
                            : "Fiyat için tıkla"}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                Tüm Markalar
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {brands.length} marka arasından seçim yap
              </p>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Marka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredBrands.slice(0, 24).map((brand) => {
              const brandModels = models[brand.id] || [];
              return (
                <Link
                  key={brand.id}
                  href={
                    brandModels[0]?.id
                      ? `/compare/${brand.id}/${brandModels[0].id}`
                      : "#"
                  }
                  className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 dark:bg-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {brandModels.length} model
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredBrands.length > 24 && (
            <div className="mt-6 text-center">
              <Link
                href="/?view=all"
                className="text-blue-600 font-semibold hover:underline dark:text-blue-400"
              >
                Tüm markaları göster ({filteredBrands.length})
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                Yeni Yüklenen Araçlar
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                En son eklenen modeller
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredComparisons.slice(0, 3).map((comp, idx) => {
              const b = brands.find((x) => x.id === comp.brand1);
              const v = getFirstVersion(comp.brand1, comp.model1);
              return (
                <Link
                  key={idx}
                  href={`/compare/${comp.brand1}/${comp.model1}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-green-300 dark:border-slate-600 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold dark:bg-green-900">
                      {b?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {b?.name} {comp.model1}
                      </div>
                      {v && (
                        <div className="text-sm font-bold text-green-600">
                          {formatPrice(v.tr)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                Yeni Satılan Araçlar
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Popüler ve ilgi gören araçlar
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {popularUsedCars.slice(0, 3).map((car, idx) => {
              const v = getFirstVersion(car.brand, car.model);
              return (
                <Link
                  key={idx}
                  href={`/compare/${car.brand}/${car.model}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-purple-300 dark:border-slate-600 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold dark:bg-purple-900">
                      {car.brand.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {car.name}
                      </div>
                      {v && (
                        <div className="text-sm font-bold text-purple-600">
                          {formatPrice(v.tr)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <AdBanner slot="homepage-bottom" />

      {sortedElectricHybrid.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                  {showElectricHybrid
                    ? "Tüm Elektrikli & Hibrit Araçlar"
                    : "Elektrikli & Hibrit Araçlar"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {showElectricHybrid
                    ? `${sortedElectricHybrid.length} araç bulundu`
                    : "Türkiye'deki en uygun fiyatlı elektrikli ve hibrit araçlar"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(showElectricHybrid
                ? sortedElectricHybrid
                : sortedElectricHybrid.slice(0, 6)
              ).map((car, idx) => renderElectricHybridCard(car, idx))}
            </div>

            {!showElectricHybrid && (
              <div className="mt-6 text-center">
                <Link
                  href="/electric-hybrid"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 px-6 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400"
                >
                  Tüm Elektrikli & Hibrit Araçlar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="mt-12 bg-slate-900 py-8 text-center">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-slate-400">
            © 2026 FiyatKarşılaştır • Tüm fiyatlar bilgilendirme amaçlıdır
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <HomeContent />
    </Suspense>
  );
}
