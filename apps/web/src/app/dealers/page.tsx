"use client";

import { useState } from "react";
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
  X,
} from "lucide-react";
import Link from "next/link";
import dealersData from "@/shared/data/dealers.json";
import vehicleData from "@/shared/data/vehicles.json";

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

const cities = [...new Set(dealers.map((d) => d.city))].sort();

function formatPhone(phone: string) {
  return phone.replace(/\s+/g, "").replace("+90", "0");
}

export default function DealersPage() {
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

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || brandId;
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
            Yetkili Bayiler
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Size en yakın bayiyi bulun ve özel teklif alın
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
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

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Tüm Markalar</option>
            {brands.slice(0, 30).map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

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
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedBrand("")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedBrand === ""
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            Tüm Markalar
          </button>
          {["audi", "bmw", "mercedes", "volkswagen", "toyota", "hyundai"].map(
            (brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedBrand === brand
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {getBrandName(brand)}
              </button>
            ),
          )}
        </div>

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

        {filteredDealers.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center dark:bg-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Bu kriterlere uygun bayi bulunamadı.
            </p>
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
