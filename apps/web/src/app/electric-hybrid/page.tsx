"use client";

import {
  Battery,
  Car,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Shield,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Navigator {
    geolocation: {
      getCurrentPosition: (
        successCallback: (position: GeolocationPosition) => void,
        errorCallback?: (error: GeolocationPositionError) => void,
        options?: PositionOptions,
      ) => void;
    };
  }
}
import dealersData from "@/shared/data/dealers.json";

const { dealers } = dealersData as {
  dealers: {
    id: string;
    name: string;
    brand: string;
    city: string;
    address: string;
    phone: string;
    services: string[];
  }[];
};

const electricBrands = [
  "tesla",
  "togg",
  "byd",
  "hyundai",
  "kia",
  "bmw",
  "mercedes",
  "audi",
  "volkswagen",
];

const cityCoords: Record<string, { lat: number; lng: number }> = {
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  Ankara: { lat: 39.9334, lng: 32.8597 },
  Izmir: { lat: 38.4192, lng: 27.1287 },
  Bursa: { lat: 40.1826, lng: 29.0665 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
  Adana: { lat: 37.0017, lng: 35.3213 },
  Konya: { lat: 37.8746, lng: 32.4932 },
  Gaziantep: { lat: 37.0662, lng: 37.3833 },
  Kayseri: { lat: 38.7312, lng: 35.4787 },
  Eskişehir: { lat: 39.7667, lng: 30.5256 },
  İstanbul: { lat: 41.0082, lng: 28.9784 },
  Ankara: { lat: 39.9334, lng: 32.8597 },
  İzmir: { lat: 38.4192, lng: 27.1287 },
  Bursa: { lat: 40.1826, lng: 29.0665 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
  Adana: { lat: 37.0017, lng: 35.3213 },
  Konya: { lat: 37.8746, lng: 32.4932 },
  Gaziantep: { lat: 37.0662, lng: 37.3833 },
  Kayseri: { lat: 38.7312, lng: 35.4787 },
  Eskişehir: { lat: 39.7667, lng: 30.5256 },
  Samsun: { lat: 41.2928, lng: 36.3313 },
  Sakarya: { lat: 40.694, lng: 30.4358 },
  Mersin: { lat: 36.8, lng: 34.6333 },
  Denizli: { lat: 37.7765, lng: 29.0864 },
  Kocaeli: { lat: 40.8533, lng: 29.8765 },
  Manisa: { lat: 38.6191, lng: 27.4289 },
  Kütahya: { lat: 39.4242, lng: 29.9833 },
  Aydın: { lat: 37.856, lng: 27.8418 },
  Balıkesir: { lat: 39.6484, lng: 27.8826 },
  Muğla: { lat: 37.2153, lng: 28.3636 },
};

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getNearbyServices = (userLat: number, userLng: number) => {
  const allServiceDealers = dealers.filter(
    (d) => d.services?.includes("Servis") && electricBrands.includes(d.brand),
  );

  const sorted = allServiceDealers
    .map((dealer) => {
      const cityData = cityCoords[dealer.city] || {
        lat: userLat,
        lng: userLng,
      };
      const dist = calculateDistance(
        userLat,
        userLng,
        cityData.lat,
        cityData.lng,
      );
      return {
        id: dealer.id,
        name: dealer.name,
        brand: dealer.brand,
        city: dealer.city,
        address: dealer.address,
        phone: dealer.phone,
        services: dealer.services,
        distance: dist < 1 ? "< 1 km" : `${Math.round(dist)} km`,
        distNum: dist,
      };
    })
    .sort((a, b) => a.distNum - b.distNum);

  return sorted.map((item, index) => ({ ...item, order: index + 1 }));
};

const services = [
  {
    icon: Wrench,
    id: "repair",
    title: "Tamir & Bakim",
    description:
      "Elektrikli araclar icin uzman teknisyenlerimizle profesyonel bakim ve tamir hizmetleri",
    features: [
      "Batarya kontrolu",
      "Sarj sistemi bakimi",
      "Elektrik motoru servisi",
      "Yazilim guncellenmeleri",
    ],
  },
  {
    icon: Truck,
    id: "tow",
    title: "Cekici Hizmeti",
    description:
      "7/24 elektrikli araclar icin ozel cekici ve yol yardim hizmeti",
    features: [
      "Sahada sarj destegi",
      "Ucretsiz cekme",
      "Acil yol yardimi",
      "Turkiye geneli servis",
    ],
  },
  {
    icon: Battery,
    id: "battery",
    title: "Batarya Destegi",
    description: "Batarya sagligi kontrolu, degisim ve geri donusum hizmetleri",
    features: [
      "Batarya diagnostic",
      "Kaput ici batarya degisimi",
      "Garanti kapsami",
      "Ikinci el batira satisi",
    ],
  },
  {
    icon: Shield,
    id: "warranty",
    title: "Garanti Servisi",
    description: "Uretici garantisi kapsaminda kapsamli destek ve ilgilendirme",
    features: [
      "Garanti uzatma",
      "Ucretsiz kontrol",
      "Parca degisimi",
      "Yetkili servis agi",
    ],
  },
  {
    icon: MapPin,
    id: "charging",
    title: "Sarj Istasyonu",
    description: "Sarj istasyonu kurulumu ve bakim hizmetleri",
    features: [
      "Ev tipi sarj",
      "Isyeri sarj",
      "Altyapi kurulumu",
      "Sarj karti ve abonelik",
    ],
  },
  {
    icon: Headphones,
    id: "support",
    title: "Musteri Destegi",
    description: "Elektrikli arac sahipleri icin ozel 7/24 destek hatti",
    features: [
      "Teknik destek",
      "Satis sonrasi",
      "Sikca sorulan sorular",
      "Online randevu",
    ],
  },
];

const brands = [
  { name: "Tesla", logo: "T", color: "from-red-500 to-red-700" },
  { name: "TOGG", logo: "T", color: "from-blue-500 to-blue-700" },
  { name: "BYD", logo: "B", color: "from-cyan-500 to-cyan-700" },
  { name: "Hyundai", logo: "H", color: "from-blue-400 to-blue-600" },
  { name: "Kia", logo: "K", color: "from-red-400 to-red-600" },
  { name: "BMW", logo: "B", color: "from-blue-600 to-blue-800" },
  { name: "Mercedes", logo: "M", color: "from-slate-600 to-slate-800" },
  { name: "Audi", logo: "A", color: "from-red-600 to-red-800" },
];

export default function ElectricHybridPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyList, setNearbyList] = useState<any[]>([]);
  const [locationRequested, setLocationRequested] = useState(false);
  const [chargingStations, setChargingStations] = useState<any[]>([]);

  const requestUserLocation = useCallback(async () => {
    if (locationRequested) return;
    setLocationRequested(true);
    setLocationLoading(true);

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 60000,
            });
          },
        );

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        const services = getNearbyServices(lat, lng);
        setNearbyList(services);
      } catch (err) {
        setUserLocation({ lat: 41.0082, lng: 28.9784 });
        const services = getNearbyServices(41.0082, 28.9784);
        setNearbyList(services);
      }
    } else {
      setUserLocation({ lat: 41.0082, lng: 28.9784 });
      const services = getNearbyServices(41.0082, 28.9784);
      setNearbyList(services);
    }
    setLocationLoading(false);
  }, [locationRequested]);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);

    if (serviceId === "support") {
      return;
    }

    if (serviceId === "charging") {
      if (chargingStations.length === 0 && userLocation) {
        const stations = getChargingStations(
          userLocation.lat,
          userLocation.lng,
        );
        setChargingStations(stations);
      }
      return;
    }

    if (!userLocation) {
      requestUserLocation();
    } else {
      const services = getNearbyServices(userLocation.lat, userLocation.lng);
      setNearbyList(services);
    }
  };

  const getChargingStations = (userLat: number, userLng: number) => {
    const mockStations = [
      {
        id: "cs1",
        name: "Tesla Supercharger",
        brand: "Tesla",
        city: "Istanbul",
        address: "Maslak Mahallesi, Istanbul",
        distance: "3 km",
        distNum: 3,
      },
      {
        id: "cs2",
        name: "Eşarj Charging",
        brand: "Eşarj",
        city: "Istanbul",
        address: "Kadıköy İstanbul",
        distance: "8 km",
        distNum: 8,
      },
      {
        id: "cs3",
        name: "ZES Şarj İstasyonu",
        brand: "ZES",
        city: "Istanbul",
        address: "Levent, Istanbul",
        distance: "5 km",
        distNum: 5,
      },
      {
        id: "cs4",
        name: "Voltrun Şarj İstasyonu",
        brand: "Voltrun",
        city: "Istanbul",
        address: "Beşiktaş, Istanbul",
        distance: "7 km",
        distNum: 7,
      },
      {
        id: "cs5",
        name: "EPDK Belgeli Şarj",
        brand: "EPDK",
        city: "Istanbul",
        address: "Ataşehir, Istanbul",
        distance: "10 km",
        distNum: 10,
      },
      {
        id: "cs6",
        name: "SCHARGE İstasyonu",
        brand: "SCHARGE",
        city: "Istanbul",
        address: "Üsküdar, Istanbul",
        distance: "9 km",
        distNum: 9,
      },
      {
        id: "cs7",
        name: "Enerjisa Şarj Noktası",
        brand: "Enerjisa",
        city: "Istanbul",
        address: "Kozyatağı, Istanbul",
        distance: "11 km",
        distNum: 11,
      },
      {
        id: "cs8",
        name: "CHG İstanbul",
        brand: "CHG",
        city: "Istanbul",
        address: "Sarıyer, Istanbul",
        distance: "15 km",
        distNum: 15,
      },
      {
        id: "cs9",
        name: "EPDK Şarj - Ataşehir",
        brand: "EPDK",
        city: "Istanbul",
        address: "Ataşehir, Istanbul",
        distance: "12 km",
        distNum: 12,
      },
      {
        id: "cs10",
        name: "Tesla Supercharger - Caddebostan",
        brand: "Tesla",
        city: "Istanbul",
        address: "Caddebostan, Istanbul",
        distance: "10 km",
        distNum: 10,
      },
      {
        id: "cs11",
        name: "SCHARGE - Üsküdar",
        brand: "SCHARGE",
        city: "Istanbul",
        address: "Üsküdar, Istanbul",
        distance: "9 km",
        distNum: 9,
      },
      {
        id: "cs12",
        name: "Enerjisa - Kozyatağı",
        brand: "Enerjisa",
        city: "Istanbul",
        address: "Kozyatağı, Istanbul",
        distance: "11 km",
        distNum: 11,
      },
    ];

    return mockStations
      .map((s) => ({ ...s, order: 0 }))
      .sort((a, b) => a.distNum - b.distNum)
      .map((item, index) => ({ ...item, order: index + 1 }));
  };

  const closeServicePanel = () => {
    setSelectedService(null);
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
              FiyatKarsilastir
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/electric-hybrid"
              className="flex items-center gap-2 text-emerald-600 font-semibold dark:text-emerald-400"
            >
              <Zap className="h-5 w-5" />
              Elektrikli & Hibrit
            </Link>
            <Link
              href="/dealers?tab=sales"
              className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
            >
              Bayiler
            </Link>
            <Link
              href="/dealers?tab=service"
              className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
            >
              Servis
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 py-20 text-white">
        <div className="absolute inset-0 opacity-30" />
        <div className="container mx-auto relative max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Elektrikli Arac Destegi
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Elektrikli & Hibrit Arac Sahipleri Icin Ozel Hizmetler
            </h1>
            <p className="mb-8 text-lg text-emerald-100">
              Tamir, bakim, cekici hizmeti ve daha fazlasi. Elektrikli arac
              musterilerini ozel hissettiren kapsamli destek paketi.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#services"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition-transform hover:scale-105"
              >
                Hizmetlerimiz
              </a>
              <a
                href="#contact"
                className="rounded-xl border-2 border-white bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Iletisim
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              Elektrikli Arac Destegi
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Elektrikli ve hibrit arac sahipleri icin sundugumuz kapsamli
              hizmetler
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <button
                key={idx}
                onClick={() => handleServiceClick(service.id)}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-emerald-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-2 text-sm text-slate-500"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-4xl rounded-t-3xl bg-white dark:bg-slate-800 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900">
                  {selectedService === "charging" ? (
                    <Battery className="h-6 w-6" />
                  ) : selectedService === "support" ? (
                    <Headphones className="h-6 w-6" />
                  ) : (
                    <Navigation className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedService === "charging"
                      ? "Sarj Istasyonlari"
                      : selectedService === "support"
                        ? "7/24 Müşteri Desteği"
                        : "Yakin Servisler"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {locationLoading
                      ? "Konum aliniyor..."
                      : selectedService === "charging"
                        ? "Konumuna en yakin sarj istasyonlari"
                        : selectedService === "support"
                          ? "Elektrikli araç sahipleri için özel destek hattı"
                          : "Konumuna en yakin servisler"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeServicePanel}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(85vh - 80px)" }}
            >
              {selectedService === "support" ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        7/24 Destek Hattı
                      </h4>
                      <a
                        href="tel:+908503200400"
                        className="mt-2 block text-2xl font-bold text-emerald-600 hover:underline"
                      >
                        0850 320 04 00
                      </a>
                      <p className="mt-1 text-sm text-slate-500">
                        Her gün, her saat hizmetinizdeyiz
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        E-posta Desteği
                      </h4>
                      <a
                        href="mailto:destek@fiyatkarsilastir.com"
                        className="mt-2 block text-lg font-medium text-emerald-600 hover:underline"
                      >
                        destek@fiyatkarsilastir.com
                      </a>
                      <p className="mt-1 text-sm text-slate-500">
                        24 saat içinde yanıt veriyoruz
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://wa.me/908503200400"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-200 p-4 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-emerald-900/20"
                    >
                      <MessageCircle className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        WhatsApp
                      </span>
                    </a>
                    <a
                      href="/dealers?tab=service"
                      className="rounded-xl border border-slate-200 p-4 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-emerald-900/20"
                    >
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        Servis Bul
                      </span>
                    </a>
                  </div>
                </div>
              ) : locationLoading ? (
                <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-center">
                  <div>
                    <Loader2 className="mx-auto h-12 w-12 text-emerald-600 animate-spin" />
                    <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">
                      Konum aliniyor...
                    </p>
                    <p className="text-sm text-slate-500">Lutfen bekleyin</p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 w-full">
                  <div className="h-[250px] w-full rounded-xl overflow-hidden border border-slate-200">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation ? `${userLocation.lng - 0.2},${userLocation.lat - 0.2},${userLocation.lng + 0.2},${userLocation.lat + 0.2}` : "28.7,40.7,29.4,41.3"}&layer=mapnik&marker=${userLocation ? `${userLocation.lat},${userLocation.lng}` : "41.0082,28.9784"}`}
                      title="Harita"
                    />
                  </div>
                  <a
                    href={
                      userLocation
                        ? selectedService === "charging"
                          ? `https://www.google.com/maps/search/elektrikli+araç+şarj+istasyonu/@${userLocation.lat},${userLocation.lng},14z`
                          : `https://www.google.com/maps/search/elektrikli+araç+servis/@${userLocation.lat},${userLocation.lng},14z`
                        : "https://www.google.com/maps/search/elektrikli+araç+şarj+istasyonu"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-center text-sm text-emerald-600 hover:underline"
                  >
                    Buyuk harita icin tiklayin
                  </a>
                </div>
              )}

              <div className="space-y-3">
                {(selectedService === "charging"
                  ? chargingStations
                  : nearbyList
                ).map((service: any) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-emerald-900/20"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 text-white font-bold">
                      {service.brand?.charAt(0).toUpperCase() ||
                        service.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                            #{service.order}
                          </span>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {service.name}
                          </h4>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">
                          {service.distance}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {service.city}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {service.address}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(service.services || []).map(
                          (s: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            >
                              {s}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-400"
                      >
                        <Navigation className="h-5 w-5" />
                      </a>
                      <a
                        href={`tel:${service.phone}`}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-400"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-r from-emerald-50 to-cyan-50 py-16 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              Desteklenen Markalar
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Turkiye'de satilan tum elektrikli ve hibrit arac markalari icin
              destek
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${brand.color} text-white font-bold`}
                >
                  {brand.logo}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900">
                <Phone className="h-8 w-8" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                Elektrikli Arac Destek Hatti
              </h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                7/24 elektrikli arac sahipleri icin ozel destek hatti
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="tel:0850"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  <Phone className="h-5 w-5" />
                  0850 XXX XX XX
                </a>
                <Link
                  href="/dealers?tab=sales"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                >
                  <Car className="h-5 w-5" />
                  Elektrikli Araclari Incele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-8 text-white">
              <h3 className="mb-2 text-2xl font-bold">
                Elektrikli Arac mi Aliyorsun?
              </h3>
              <p className="mb-4 text-emerald-100">
                En uygun fiyatli elektrikli ve hibrit araclari karsilastir, en
                yakin bayiyi bul.
              </p>
              <Link
                href="/dealers?tab=sales"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Araclari Incele
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
              <h3 className="mb-2 text-2xl font-bold">Servis Randevusu Al</h3>
              <p className="mb-4 text-blue-100">
                Elektrikli aracin icin online randevu olustur, uzman
                teknisyenlerimizle tanis.
              </p>
              <Link
                href="/dealers?tab=service"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
              >
                Randevu Al
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 bg-slate-900 py-8 text-center">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-slate-400">
            © 2026 FiyatKarsilastir - Tum fiyatlar bilgilendirme amaclidir
          </p>
        </div>
      </footer>
    </div>
  );
}
