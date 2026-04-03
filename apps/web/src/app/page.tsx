"use client";

import { ChevronDown, Heart, Store, Tag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AdBanner from "@/components/ad-banner";
import campaignsData from "@/shared/data/campaigns.json";
import dealersData from "@/shared/data/dealers.json";
import vehicleData from "@/shared/data/vehicles.json";

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

const allCountries = [
  { code: "", name: "Tüm Ülkeler", flag: "🌍" },
  { code: "DE", name: "Almanya", flag: "https://flagcdn.com/w40/de.png" },
  { code: "JP", name: "Japonya", flag: "https://flagcdn.com/w40/jp.png" },
  { code: "KR", name: "Güney Kore", flag: "https://flagcdn.com/w40/kr.png" },
  { code: "US", name: "ABD", flag: "https://flagcdn.com/w40/us.png" },
  { code: "FR", name: "Fransa", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "IT", name: "İtalya", flag: "https://flagcdn.com/w40/it.png" },
  { code: "GB", name: "İngiltere", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "TR", name: "Türkiye", flag: "https://flagcdn.com/w40/tr.png" },
  { code: "CN", name: "Çin", flag: "https://flagcdn.com/w40/cn.png" },
  { code: "SE", name: "İsveç", flag: "https://flagcdn.com/w40/se.png" },
  { code: "ES", name: "İspanya", flag: "https://flagcdn.com/w40/es.png" },
  { code: "CZ", name: "Çekya", flag: "https://flagcdn.com/w40/cz.png" },
];

const holdingGroups: Record<string, string[]> = {
  volkswagen: [
    "volkswagen",
    "audi",
    "porsche",
    "bentley",
    "lamborghini",
    "skoda",
    "seat",
    "cupra",
    "smart",
  ],
  stellantis: [
    "fiat",
    "alfaromeo",
    "maserati",
    "jeep",
    "dodge",
    "chrysler",
    "peugeot",
    "citroen",
    "opel",
    "ds",
    "abarth",
  ],
  toyota: ["toyota", "lexus", "daihatsu", "hino"],
  gm: ["chevrolet", "gmc", "buick", "cadillac", "pontiac", "daewoo"],
  bmw: ["bmw", "mini", "rollsroyce"],
  renault: ["renault", "nissan", "mitsubishi", "infiniti", "dacia", "alpine"],
  hyundai: ["hyundai", "kia", "genesis"],
  geely: ["geely", "volvo", "polestar", "lotus", "leapmotor", "mg", "smart"],
  ford: ["ford", "lincoln", "jaguar"],
  tata: ["tata", "landrover", "jaguar"],
  mercedes: ["mercedes", "smart"],
};

const allHoldings = [
  { code: "", name: "Tüm Gruplar", flag: "🌍" },
  {
    code: "volkswagen",
    name: "Volkswagen Grubu",
    flag: "https://flagcdn.com/w40/de.png",
  },
  {
    code: "stellantis",
    name: "Stellantis",
    flag: "https://flagcdn.com/w40/eu.png",
  },
  {
    code: "toyota",
    name: "Toyota Grubu",
    flag: "https://flagcdn.com/w40/jp.png",
  },
  { code: "bmw", name: "BMW Grubu", flag: "https://flagcdn.com/w40/de.png" },
  {
    code: "hyundai",
    name: "Hyundai Grubu",
    flag: "https://flagcdn.com/w40/kr.png",
  },
  {
    code: "geely",
    name: "Geely Holding",
    flag: "https://flagcdn.com/w40/cn.png",
  },
  {
    code: "renault",
    name: "Renault-Nissan-Mitsubishi",
    flag: "https://flagcdn.com/w40/fr.png",
  },
  { code: "ford", name: "Ford", flag: "https://flagcdn.com/w40/us.png" },
  {
    code: "gm",
    name: "General Motors",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    code: "mercedes",
    name: "Mercedes-Benz",
    flag: "https://flagcdn.com/w40/de.png",
  },
];

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedHolding, setSelectedHolding] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [holdingSectionOpen, setHoldingSectionOpen] = useState(false);
  const [countrySectionOpen, setCountrySectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "brands" | "dealers" | "campaigns"
  >("brands");
  const [selectedBrandForDealers, setSelectedBrandForDealers] =
    useState<string>("");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("");
  const [selectedBrandForCampaigns, setSelectedBrandForCampaigns] =
    useState<string>("");
  const [selectedCityForCampaigns, setSelectedCityForCampaigns] =
    useState<string>("");
  const [campaignSortBy, setCampaignSortBy] = useState<"date" | "alpha">(
    "date",
  );
  const { toggleFavorite, isFavorite } = useFavorites();

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
      title: string;
      description: string;
      brand: string;
      type: "general" | "dealer";
      city: string;
      dealer?: string;
      startDate: string;
      endDate: string;
      discount: string;
      link: string;
    }[];
  };

  const getHoldingBrands = (holdingCode: string): string[] => {
    return holdingGroups[holdingCode] || [];
  };

  const allCities = [...new Set(dealers.map((d) => d.city))].sort();
  const allBrandsInDealers = brands.map((b: { id: string }) => b.id);

  const filteredDealers = dealers.filter((d) => {
    const matchesBrand =
      !selectedBrandForDealers || d.brand === selectedBrandForDealers;
    const matchesCity = !selectedCityFilter || d.city === selectedCityFilter;
    return matchesBrand && matchesCity;
  });

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesBrand =
      !selectedBrandForCampaigns || c.brand === selectedBrandForCampaigns;
    const matchesCity =
      !selectedCityForCampaigns ||
      c.city === selectedCityForCampaigns ||
      (selectedCityForCampaigns === "Türkiye" && c.city === "Türkiye");
    return matchesBrand && matchesCity;
  });

  const sortedGeneralCampaigns = [
    ...filteredCampaigns.filter((c) => c.type === "general"),
  ].sort((a, b) => {
    if (campaignSortBy === "alpha") {
      return a.brand.localeCompare(b.brand, "tr");
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const sortedDealerCampaigns = [
    ...filteredCampaigns.filter((c) => c.type === "dealer"),
  ].sort((a, b) => {
    if (campaignSortBy === "alpha") {
      return a.brand.localeCompare(b.brand, "tr");
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const filteredBrands = brands
    .filter((b: { name: string; country: string; id: string }) => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchesCountry =
        selectedCountry === "" || b.country === selectedCountry;
      const matchesHolding =
        selectedHolding === "" ||
        getHoldingBrands(selectedHolding).includes(b.id);
      return matchesSearch && matchesCountry && matchesHolding;
    })
    .sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name, "tr"),
    );

  const modelList = selectedBrand ? models[selectedBrand] || [] : [];
  const modelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBrand && modelsRef.current) {
      setTimeout(() => {
        modelsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedBrand]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 text-center">
            <h1 className="mb-3 font-bold text-4xl text-slate-900 dark:text-white">
              Dünya vs Türkiye Araç Fiyatları
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              İstediğin aracı seç, Dünya ve Türkiye fiyatlarını karşılaştır. ÖTV
              ve KDV dahil ne kadar vergi ödediğini gör.
            </p>
          </div>

          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setActiveTab("brands")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                activeTab === "brands"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              🚗 Markalar
            </button>
            <button
              onClick={() => setActiveTab("dealers")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                activeTab === "dealers"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              <Store className="h-5 w-5" />
              Yetkili Bayiler
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                activeTab === "campaigns"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              <Tag className="h-5 w-5" />
              Kampanyalar
            </button>
          </div>

          <AdBanner slot="homepage-top" />

          {activeTab === "brands" ? (
            <>
              <div className="mb-4 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label className="mb-3 block font-semibold text-slate-700 dark:text-slate-200">
                    Keşfetmeye Hazır mısın?
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <span className="flex items-center gap-2">
                        {selectedHolding && (
                          <img
                            src={
                              allHoldings.find(
                                (h) => h.code === selectedHolding,
                              )?.flag
                            }
                            alt=""
                            className="inline-block h-4 w-6"
                          />
                        )}
                        {selectedCountry && !selectedHolding && (
                          <img
                            src={
                              allCountries.find(
                                (c) => c.code === selectedCountry,
                              )?.flag
                            }
                            alt=""
                            className="inline-block h-4 w-6"
                          />
                        )}
                        {selectedHolding === "" &&
                          selectedCountry === "" &&
                          !search &&
                          "Keşfetmeye Hazır mısın?"}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700">
                        <div className="border-slate-200 border-b p-4 dark:border-slate-600">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHolding("");
                              setSelectedCountry("");
                              setSearch("");
                              setDropdownOpen(false);
                            }}
                            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
                          >
                            🎯 Tüm Markalar
                          </button>
                        </div>

                        <div className="border-slate-200 border-t dark:border-slate-600">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHoldingSectionOpen(!holdingSectionOpen);
                            }}
                            className="flex w-full items-center justify-between px-5 py-3 font-bold text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-600"
                          >
                            <span>🏢 Şirketler / Gruplar</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${holdingSectionOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          {holdingSectionOpen && (
                            <div className="bg-slate-50 dark:bg-slate-800">
                              {allHoldings
                                .filter((h) => h.code)
                                .map((h) => (
                                  <button
                                    key={h.code}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedHolding(h.code);
                                      setSelectedCountry("");
                                      setDropdownOpen(false);
                                    }}
                                    className={`w-full px-8 py-2 text-left hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-600 ${selectedHolding === h.code ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                                  >
                                    <img
                                      src={h.flag}
                                      alt=""
                                      className="mr-2 inline-block h-4 w-6"
                                    />
                                    {h.name}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        <div className="border-slate-200 border-t dark:border-slate-600">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCountrySectionOpen(!countrySectionOpen);
                            }}
                            className="flex w-full items-center justify-between px-5 py-3 font-bold text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-600"
                          >
                            <span>🌍 Ülkeler</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${countrySectionOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          {countrySectionOpen && (
                            <div className="bg-slate-50 dark:bg-slate-800">
                              {allCountries
                                .filter((c) => c.code)
                                .map((c) => (
                                  <button
                                    key={c.code}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCountry(c.code);
                                      setSelectedHolding("");
                                      setDropdownOpen(false);
                                    }}
                                    className={`w-full px-8 py-2 text-left hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-600 ${selectedCountry === c.code ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                                  >
                                    <img
                                      src={c.flag}
                                      alt=""
                                      className="mr-2 inline-block h-4 w-6"
                                    />
                                    {c.name}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-[2]">
                  <label className="mb-3 block font-semibold text-slate-700 dark:text-slate-200">
                    Marka ara
                  </label>
                  <input
                    type="text"
                    placeholder="Marka ara... (örn: Volkswagen, BMW, Toyota)"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedBrand(null);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredBrands.map(
                  (brand: {
                    id: string;
                    name: string;
                    logo: string;
                    country: string;
                  }) => (
                    <div key={brand.id} className="relative">
                      <button
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`flex w-full flex-col items-center gap-2 rounded-xl p-4 transition-all hover:scale-105 ${
                          selectedBrand === brand.id
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 font-bold text-lg text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                          {brand.name.charAt(0)}
                        </div>
                        <span className="text-center font-medium text-sm">
                          {brand.name}
                        </span>
                        <span className="flex items-center justify-center gap-1 text-xs opacity-70">
                          <img
                            src={countryFlags[brand.country]}
                            alt=""
                            className="h-3 w-5"
                          />
                          {countryNames[brand.country] || brand.country}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(brand.id);
                        }}
                        className="absolute top-2 right-2 rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-600"
                        aria-label="Favorilere ekle"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFavorite(brand.id)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : null}

          {activeTab === "dealers" && (
            <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                    Yetkili Bayiler
                  </h2>
                  {selectedBrandForDealers && (
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      {filteredDealers.length} yetkili bayi bulundu
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <select
                    value={selectedBrandForDealers}
                    onChange={(e) => {
                      setSelectedBrandForDealers(e.target.value);
                      setSelectedCityFilter("");
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Tüm Markalar</option>
                    {brands.map((brand: { id: string; name: string }) => {
                      const count = dealers.filter(
                        (d) => d.brand === brand.id,
                      ).length;
                      return (
                        <option key={brand.id} value={brand.id}>
                          {brand.name} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={selectedCityFilter}
                    onChange={(e) => setSelectedCityFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">
                      Tüm Türkiye (
                      {
                        dealers.filter(
                          (d) =>
                            !selectedBrandForDealers ||
                            d.brand === selectedBrandForDealers,
                        ).length
                      }
                      )
                    </option>
                    {allCities.map((city) => {
                      const count = dealers.filter(
                        (d) =>
                          d.city === city &&
                          (!selectedBrandForDealers ||
                            d.brand === selectedBrandForDealers),
                      ).length;
                      return (
                        <option key={city} value={city}>
                          {city} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-600">
                {filteredDealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-md bg-blue-600 px-2 py-1 font-bold text-white text-xs">
                          {dealer.brand.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-slate-600 text-xs dark:bg-slate-600 dark:text-slate-300">
                          📍 {dealer.city}
                        </span>
                      </div>
                      <h3 className="mb-1 font-semibold text-lg text-slate-900 dark:text-white">
                        {dealer.name}
                      </h3>
                      <p className="text-slate-500 text-sm dark:text-slate-400">
                        {dealer.address}
                      </p>
                      {dealer.hours && (
                        <p className="mt-1 text-slate-400 text-xs">
                          ⏰ {dealer.hours}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <a
                        href={`tel:${dealer.phone}`}
                        className="flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        📞 {dealer.phone}
                      </a>
                      <a
                        href={dealer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 text-sm hover:underline dark:text-blue-400"
                      >
                        🌐 Web sitesi →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {filteredDealers.length === 0 && (
                <p className="text-center text-slate-500 dark:text-slate-400">
                  Bu filtrelere uygun bayi bulunamadı.
                </p>
              )}

              <div className="mt-10 border-slate-200 border-t pt-8 dark:border-slate-600">
                <h3 className="mb-4 font-semibold text-lg text-slate-900 dark:text-white">
                  Tüm Markalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand: { id: string; name: string }) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrandForDealers(brand.id);
                        setActiveTab("dealers");
                      }}
                      className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-blue-500 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-blue-600"
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
                    Kampanyalar
                  </h2>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    {filteredCampaigns.length} kampanya bulundu
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <select
                    value={selectedBrandForCampaigns}
                    onChange={(e) => {
                      setSelectedBrandForCampaigns(e.target.value);
                      setSelectedCityForCampaigns("");
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Tüm Markalar</option>
                    {brands.map((brand: { id: string; name: string }) => {
                      const count = campaigns.filter(
                        (c) => c.brand === brand.id,
                      ).length;
                      return (
                        <option key={brand.id} value={brand.id}>
                          {brand.name} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={selectedCityForCampaigns}
                    onChange={(e) =>
                      setSelectedCityForCampaigns(e.target.value)
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Tüm Türkiye</option>
                    <option value="Türkiye">Genel Kampanyalar</option>
                    {allCities.map((city) => {
                      const count = campaigns.filter(
                        (c) =>
                          c.city === city &&
                          (!selectedBrandForCampaigns ||
                            c.brand === selectedBrandForCampaigns),
                      ).length;
                      return (
                        <option key={city} value={city}>
                          {city} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex rounded-lg border border-slate-200 dark:border-slate-600">
                    <button
                      onClick={() => setCampaignSortBy("date")}
                      className={`px-3 py-2 font-medium text-sm transition-colors ${
                        campaignSortBy === "date"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      🕒 En Yeni
                    </button>
                    <button
                      onClick={() => setCampaignSortBy("alpha")}
                      className={`px-3 py-2 font-medium text-sm transition-colors ${
                        campaignSortBy === "alpha"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      A-Z
                    </button>
                  </div>
                </div>
              </div>

              {sortedGeneralCampaigns.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-white">
                    🏢 Genel Marka Kampanyaları
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                      {sortedGeneralCampaigns.length}
                    </span>
                  </h3>
                  <p className="mb-4 text-slate-500 text-sm dark:text-slate-400">
                    Merkezi müdürlük tarafından tüm Türkiye'de geçerli
                    kampanyalar
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sortedGeneralCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="rounded-xl border-2 border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-slate-700"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <span className="rounded-md bg-blue-600 px-2 py-1 font-bold text-white text-xs">
                            {campaign.brand.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-slate-600 text-xs dark:bg-slate-600 dark:text-slate-300">
                            🏢 Türkiye Genel
                          </span>
                          {campaign.discount && (
                            <span className="rounded-md bg-green-600 px-2 py-1 font-bold text-white text-xs">
                              {campaign.discount}
                            </span>
                          )}
                        </div>
                        <h4 className="mb-2 font-semibold text-lg text-slate-900 dark:text-white">
                          {campaign.title}
                        </h4>
                        <p className="mb-4 text-slate-500 text-sm dark:text-slate-400">
                          {campaign.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">
                            {campaign.startDate} - {campaign.endDate}
                          </span>
                          <a
                            href={campaign.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                          >
                            İncele →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sortedDealerCampaigns.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-white">
                    🏪 Bayi Özel Kampanyaları
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700 text-xs dark:bg-orange-900 dark:text-orange-300">
                      {sortedDealerCampaigns.length}
                    </span>
                  </h3>
                  <p className="mb-4 text-slate-500 text-sm dark:text-slate-400">
                    Belirli bayiler tarafından sunulan özel indirimler ve
                    kampanyalar
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sortedDealerCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="rounded-xl border-2 border-orange-100 bg-orange-50 p-5 dark:border-orange-900 dark:bg-slate-700"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <span className="rounded-md bg-orange-600 px-2 py-1 font-bold text-white text-xs">
                            {campaign.brand.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-slate-600 text-xs dark:bg-slate-600 dark:text-slate-300">
                            📍 {campaign.city}
                          </span>
                          {campaign.dealer && (
                            <span className="rounded bg-purple-100 px-2 py-1 text-purple-700 text-xs dark:bg-purple-900 dark:text-purple-300">
                              {campaign.dealer}
                            </span>
                          )}
                          {campaign.discount && (
                            <span className="rounded-md bg-green-600 px-2 py-1 font-bold text-white text-xs">
                              {campaign.discount}
                            </span>
                          )}
                        </div>
                        <h4 className="mb-2 font-semibold text-lg text-slate-900 dark:text-white">
                          {campaign.title}
                        </h4>
                        <p className="mb-4 text-slate-500 text-sm dark:text-slate-400">
                          {campaign.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">
                            {campaign.startDate} - {campaign.endDate}
                          </span>
                          <a
                            href={campaign.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                          >
                            İncele →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCampaigns.length === 0 && (
                <p className="text-center text-slate-500 dark:text-slate-400">
                  Bu filtrelere uygun kampanya bulunamadı.
                </p>
              )}

              <div className="mt-10 border-slate-200 border-t pt-8 dark:border-slate-600">
                <h3 className="mb-4 font-semibold text-lg text-slate-900 dark:text-white">
                  Tüm Markalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand: { id: string; name: string }) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrandForCampaigns(brand.id);
                        setActiveTab("campaigns");
                      }}
                      className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-blue-500 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-blue-600"
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "brands" && selectedBrand && modelList.length > 0 && (
            <div
              ref={modelsRef}
              className="mt-8 border-slate-200 border-t pt-8 dark:border-slate-600"
            >
              <div className="mb-4 flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-200">
                  Model seç
                </label>
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="text-blue-600 text-sm hover:underline dark:text-blue-400"
                >
                  ← Marka değiştir
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {modelList.map((model: { id: string; name: string }) => (
                  <Link
                    key={model.id}
                    href={`/compare/${selectedBrand}/${model.id}` as any}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-4 text-center font-medium text-slate-700 transition-all hover:bg-blue-500 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-blue-600"
                  >
                    <span>{model.name}</span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
              <div className="mb-3 font-bold text-2xl dark:text-white">
                Almanya
              </div>
              <h3 className="mb-1 font-semibold dark:text-white">
                Kaynak Fiyat
              </h3>
              <p className="text-slate-500 text-sm">mobile.de referansı</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
              <div className="mb-3 font-bold text-2xl dark:text-white">
                Türkiye
              </div>
              <h3 className="mb-1 font-semibold dark:text-white">
                Satış Fiyatı
              </h3>
              <p className="text-slate-500 text-sm">Vitrin, Bayiler</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
              <div className="mb-3 font-bold text-2xl dark:text-white">
                Vergi
              </div>
              <h3 className="mb-1 font-semibold dark:text-white">ÖTV + KDV</h3>
              <p className="text-slate-500 text-sm">Detaylı kırılım</p>
            </div>
          </div>
        </div>

        <footer className="mt-16 bg-slate-900 py-8 text-center text-slate-400">
          <p className="text-sm">
            © 2026 FiyatKarşılaştır • Tüm fiyatlar bilgilendirme amaçlıdır
          </p>
        </footer>
      </div>
  </div>
  )
}
