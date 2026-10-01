"use client";

import { useState } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Truck,
  Check,
  Shield,
  Star,
} from "lucide-react";

const towServices = [
  { name: "Otomobil", icon: "🚗", basePrice: 500 },
  { name: "SUV / Arazi", icon: "🚙", basePrice: 750 },
  { name: "Kamyonet", icon: "🛻", basePrice: 1000 },
  { name: "Minibüs", icon: "🚐", basePrice: 1500 },
];

const detailingServices = [
  {
    name: "Standart Yıkama",
    description: "Dış yıkama + iç süpürme",
    price: 250,
    time: "30 dk",
    icon: "🚿",
  },
  {
    name: "Detaylı Temizlik",
    description: "İç + dış + motor temizliği",
    price: 750,
    time: "2 saat",
    icon: "✨",
  },
  {
    name: "Seramik Kaplama",
    description: "6 ay koruma, parıltılı görünüm",
    price: 2500,
    time: "1 gün",
    icon: "🛡️",
  },
  {
    name: "İç Temizlik",
    description: "Derinlemesine koltuk & döşeme temizliği",
    price: 500,
    time: "1 saat",
    icon: "🧹",
  },
];

export default function HizmetlerPage() {
  const [activeTab, setActiveTab] = useState<"tow" | "detailing">("tow");

  const [towForm, setTowForm] = useState({
    location: "",
    phone: "",
    vehicleType: "Otomobil",
    note: "",
  });
  const [towSubmitted, setTowSubmitted] = useState(false);

  const [detailForm, setDetailForm] = useState({
    location: "",
    phone: "",
    service: "Standart Yıkama",
    vehicleType: "Sedan",
    date: "",
    time: "",
  });
  const [detailSubmitted, setDetailSubmitted] = useState(false);

  const handleTowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTowSubmitted(true);
  };

  const handleDetailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 py-8 text-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold">Araç Hizmetleri</h1>
          <p className="text-lg text-blue-100">
            Yolda kaldınız mı? Aracınızı temizletmek mi istiyorsunuz? size
            yardımcı olalım.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex justify-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab("tow")}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
              activeTab === "tow"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Truck className="h-5 w-5" />
            Çekici Hizmeti
          </button>
          <button
            onClick={() => setActiveTab("detailing")}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
              activeTab === "detailing"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            Temizlik Hizmeti
          </button>
        </div>

        {activeTab === "tow" && (
          <div className="space-y-8">
            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <Truck className="h-12 w-12" />
                <div>
                  <h2 className="font-bold text-2xl">Acil Çekici Hizmeti</h2>
                  <p className="text-orange-100">
                    7/24 yolda kaldığınızda yanınızdayız
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {towServices.map((service) => (
                <div
                  key={service.name}
                  className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                    towForm.vehicleType === service.name
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                      : "border-slate-200 bg-white hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                  onClick={() =>
                    setTowForm({ ...towForm, vehicleType: service.name })
                  }
                >
                  <div className="mb-2 text-3xl">{service.icon}</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {service.name}
                  </div>
                  <div className="text-sm text-orange-600">
                    {service.basePrice} TL&apos;den başlayan fiyatlarla
                  </div>
                </div>
              ))}
            </div>

            {towSubmitted ? (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                    ✅
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-2xl text-slate-900 dark:text-white">
                  Talebiniz Alındı!
                </h3>
                <p className="mb-6 text-slate-500 dark:text-slate-400">
                  En yakın çekici ekibi size {towForm.phone} numarasından ulaşacak.
                  Tahmini varış süresi: <strong>15-25 dakika</strong>
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="tel:112"
                    className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
                  >
                    <Phone className="h-5 w-5" />
                    Acil Ara (112)
                  </a>
                  <button
                    onClick={() => setTowSubmitted(false)}
                    className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                  >
                    Yeni Talep
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
                <h3 className="mb-4 font-bold text-xl text-slate-900 dark:text-white">
                  Çekici Talebi Oluştur
                </h3>
                <form onSubmit={handleTowSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Konumunuz
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Adres veya konum bilgisi"
                        required
                        value={towForm.location}
                        onChange={(e) =>
                          setTowForm({ ...towForm, location: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Telefon Numaranız
                    </label>
                    <input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      required
                      value={towForm.phone}
                      onChange={(e) =>
                        setTowForm({ ...towForm, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Ek Not (İsteğe bağlı)
                    </label>
                    <textarea
                      placeholder="Örn: Sol ön lastik patladi, motor durdu..."
                      value={towForm.note}
                      onChange={(e) =>
                        setTowForm({ ...towForm, note: e.target.value })
                      }
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-orange-600 py-4 font-semibold text-lg text-white transition-colors hover:bg-orange-700"
                  >
                    🚨 Çekici Çağır
                  </button>
                </form>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Hızlı Tepki
                  </div>
                  <div className="text-sm text-slate-500">15-25 dk</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Güvenli Taşıma
                  </div>
                  <div className="text-sm text-slate-500">Sigortalı</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    7/24 Hizmet
                  </div>
                  <div className="text-sm text-slate-500">Kesintisiz</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "detailing" && (
          <div className="space-y-8">
            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <Sparkles className="h-12 w-12" />
                <div>
                  <h2 className="font-bold text-2xl">Araç Temizlik Hizmeti</h2>
                  <p className="text-purple-100">
                    Profesyonel temizlik ile aracınızı yenileyin
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {detailingServices.map((service) => (
                <div
                  key={service.name}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                    detailForm.service === service.name
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                      : "border-slate-200 bg-white hover:border-purple-300 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                  onClick={() =>
                    setDetailForm({ ...detailForm, service: service.name })
                  }
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {service.name}
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-600">
                      {service.price} TL
                    </span>
                    <span className="text-sm text-slate-400">
                      ~{service.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {detailSubmitted ? (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                    ✅
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-2xl text-slate-900 dark:text-white">
                  Randevunuz Alındı!
                </h3>
                <p className="mb-6 text-slate-500 dark:text-slate-400">
                  <strong>{detailForm.service}</strong> randevunuz onaylandı.
                  <br />
                  Tarih: <strong>{detailForm.date || "Belirtilecek"}</strong> •
                  Saat: <strong>{detailForm.time || "Belirtilecek"}</strong>
                  <br />
                  Sizi {detailForm.phone} numarasından arayacağız.
                </p>
                <button
                  onClick={() => setDetailSubmitted(false)}
                  className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  Yeni Randevu Oluştur
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
                <h3 className="mb-4 font-bold text-xl text-slate-900 dark:text-white">
                  Temizlik Randevusu Al
                </h3>
                <form onSubmit={handleDetailSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Konumunuz (Adres veya semt)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Adres veya semt"
                        required
                        value={detailForm.location}
                        onChange={(e) =>
                          setDetailForm({
                            ...detailForm,
                            location: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Telefon Numaranız
                    </label>
                    <input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      required
                      value={detailForm.phone}
                      onChange={(e) =>
                        setDetailForm({ ...detailForm, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Araç Tipi
                      </label>
                      <select
                        value={detailForm.vehicleType}
                        onChange={(e) =>
                          setDetailForm({
                            ...detailForm,
                            vehicleType: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option>Sedan</option>
                        <option>SUV / Arazi</option>
                        <option>Hatchback</option>
                        <option>Kamyonet</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Tercih Edilen Tarih
                      </label>
                      <input
                        type="date"
                        value={detailForm.date}
                        onChange={(e) =>
                          setDetailForm({ ...detailForm, date: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Saat Tercihi
                    </label>
                    <select
                      value={detailForm.time}
                      onChange={(e) =>
                        setDetailForm({ ...detailForm, time: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Saat seçin</option>
                      <option>09:00 - 10:00</option>
                      <option>10:00 - 11:00</option>
                      <option>11:00 - 12:00</option>
                      <option>13:00 - 14:00</option>
                      <option>14:00 - 15:00</option>
                      <option>15:00 - 16:00</option>
                      <option>16:00 - 17:00</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-purple-600 py-4 font-semibold text-lg text-white transition-colors hover:bg-purple-700"
                  >
                    ✨ Randevu Al
                  </button>
                </form>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Profesyonel Ekip
                  </div>
                  <div className="text-sm text-slate-500">Sertifikalı</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Kalite Garantisi
                  </div>
                  <div className="text-sm text-slate-500">%100 memnuniyet</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Yerinde Hizmet
                  </div>
                  <div className="text-sm text-slate-500">Geliriz, temizleriz</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
