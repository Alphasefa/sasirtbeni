"use client";

import {
  Battery,
  Car,
  Headphones,
  MapPin,
  Phone,
  Shield,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Wrench,
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
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
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
              </div>
            ))}
          </div>
        </div>
      </section>

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
