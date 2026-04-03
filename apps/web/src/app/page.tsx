"use client";

import { Calendar, Car, ChevronDown, MapPin, Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ScrollToTop from "@/components/scroll-to-top";
import campaignsData from "@/shared/data/campaigns.json";
import dealersData from "@/shared/data/dealers.json";
import vehiclesData from "@/shared/data/vehicles.json";

const { brands, models } = vehiclesData as {
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
    startDate: string;
    endDate: string;
    discount: string;
    link: string;
  }[];
};

const turkishCities = [
  "Adana",
  "Adıyaman",
  "Afyon",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzur",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kilis",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Samsun",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Zonguldak",
];

export default function Home() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDealerBrand, setSelectedDealerBrand] = useState("");
  const [selectedDealerCity, setSelectedDealerCity] = useState("");
  const [showDealers, setShowDealers] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);

  const availableBrands = brands.filter(
    (b) => models[b.id] && models[b.id].length > 0,
  );
  const availableModels = selectedBrand ? models[selectedBrand] || [] : [];

  const filteredDealers = dealers.filter((d) => {
    if (selectedDealerBrand && d.brand !== selectedDealerBrand) return false;
    if (selectedDealerCity && d.city !== selectedDealerCity) return false;
    return true;
  });

  const generalCampaigns = campaigns.filter((c) => c.type === "general");
  const dealerCampaigns = campaigns.filter((c) => c.type === "dealer");

  const handleCompare = () => {
    if (selectedBrand && selectedModel) {
      router.push(`/compare/${selectedBrand}/${selectedModel}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white shadow-sm dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-2xl text-white">
              🚗
            </div>
            <div>
              <h1 className="font-bold text-2xl text-slate-900 dark:text-white">
                FiyatKarşılaştır
              </h1>
              <p className="text-slate-500 text-sm dark:text-slate-400">
                Türkiye vs Dünya Araç Fiyatları
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-4xl text-slate-900 dark:text-white">
            Araç Fiyatını Karşılaştır
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Türkiye'deki vitrin fiyatını Almanya ve diğer ülkelerle karşılaştır
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-200">
                Marka
              </label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel("");
                  }}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Marka seçin</option>
                  {availableBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-200">
                Model
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-600"
                >
                  <option value="">Model seçin</option>
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={!selectedBrand || !selectedModel}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-lg text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
            >
              <Search className="h-5 w-5" />
              Fiyatları Karşılaştır
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-slate-800">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900">
                <Car className="h-7 w-7" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-slate-900 text-xl dark:text-white">
              100+ Marka
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Türkiye'de satılan birçok marka ve model
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-slate-800">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900">
                <MapPin className="h-7 w-7" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-slate-900 text-xl dark:text-white">
              360+ Bayi
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Yetkili satış ve servis noktaları
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-slate-800">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900">
                <Calendar className="h-7 w-7" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-slate-900 text-xl dark:text-white">
              Güncel Kampanyalar
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              En güncel indirim ve taksit seçenekleri
            </p>
          </div>
        </div>

        <div className="mt-16">
          <button
            onClick={() => setShowDealers(!showDealers)}
            className="mb-6 flex w-full items-center justify-between rounded-xl bg-white p-6 shadow-lg hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-xl dark:text-white">
                  Yetkili Bayiler
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {filteredDealers.length} bayi bulundu
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-6 w-6 text-slate-500 transition-transform ${showDealers ? "rotate-180" : ""}`}
            />
          </button>

          {showDealers && (
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-200">
                    Marka
                  </label>
                  <select
                    value={selectedDealerBrand}
                    onChange={(e) => setSelectedDealerBrand(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Tüm markalar</option>
                    {[...new Set(dealers.map((d) => d.brand))]
                      .sort()
                      .map((brand) => (
                        <option key={brand} value={brand}>
                          {brands.find((b) => b.id === brand)?.name || brand}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-200">
                    Şehir
                  </label>
                  <select
                    value={selectedDealerCity}
                    onChange={(e) => setSelectedDealerCity(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Tüm şehirler</option>
                    {turkishCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDealers.slice(0, 30).map((dealer) => (
                  <div
                    key={dealer.id}
                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                  >
                    <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">
                      {dealer.name}
                    </h4>
                    <p className="mb-1 text-slate-500 text-sm dark:text-slate-400">
                      {brands.find((b) => b.id === dealer.brand)?.name} •{" "}
                      {dealer.city}
                    </p>
                    <p className="mb-2 text-slate-600 text-sm dark:text-slate-300">
                      {dealer.address}
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 text-sm dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      {dealer.hours}
                    </div>
                  </div>
                ))}
              </div>

              {filteredDealers.length > 30 && (
                <p className="mt-4 text-center text-slate-500 dark:text-slate-400">
                  +{filteredDealers.length - 30} bayi daha...
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowCampaigns(!showCampaigns)}
            className="mb-6 flex w-full items-center justify-between rounded-xl bg-white p-6 shadow-lg hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 text-xl dark:text-white">
                  Kampanyalar
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {campaigns.length} aktif kampanya
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-6 w-6 text-slate-500 transition-transform ${showCampaigns ? "rotate-180" : ""}`}
            />
          </button>

          {showCampaigns && (
            <div className="space-y-6">
              {generalCampaigns.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                  <h4 className="mb-4 font-semibold text-lg text-slate-900 dark:text-white">
                    Genel Kampanyalar
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {generalCampaigns.slice(0, 6).map((campaign) => (
                      <a
                        key={campaign.id}
                        href={campaign.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-600"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {campaign.title}
                          </span>
                          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                            {campaign.discount}
                          </span>
                        </div>
                        <p className="mb-2 text-slate-600 text-sm dark:text-slate-300">
                          {campaign.description}
                        </p>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          {brands.find((b) => b.id === campaign.brand)?.name} •{" "}
                          {campaign.city}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {dealerCampaigns.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                  <h4 className="mb-4 font-semibold text-lg text-slate-900 dark:text-white">
                    Bayi Özel Kampanyalar
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {dealerCampaigns.slice(0, 6).map((campaign) => (
                      <a
                        key={campaign.id}
                        href={campaign.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-600"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {campaign.title}
                          </span>
                          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-300">
                            {campaign.discount}
                          </span>
                        </div>
                        <p className="mb-2 text-slate-600 text-sm dark:text-slate-300">
                          {campaign.description}
                        </p>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          {brands.find((b) => b.id === campaign.brand)?.name} •{" "}
                          {campaign.city}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="mt-16 rounded-xl bg-slate-900 p-8 text-white">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-3 font-semibold text-lg">FiyatKarşılaştır</h4>
              <p className="text-slate-400 text-sm">
                Türkiye'deki araç fiyatlarını Almanya ve diğer ülkelerle
                karşılaştırın.
              </p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-lg">Hızlı Linkler</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Hakkımızda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    İletişim
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Gizlilik Politikası
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-lg">İletişim</h4>
              <p className="text-slate-400 text-sm">
                info@fiyatkarsilastir.com
              </p>
            </div>
          </div>
          <div className="mt-6 border-slate-700 border-t pt-6 text-center text-slate-400 text-sm">
            © 2024 FiyatKarşılaştır. Tüm hakları saklıdır.
          </div>
        </footer>
      </div>

      <ScrollToTop />
    </div>
  );
}
