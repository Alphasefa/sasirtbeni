"use client";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Car,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import dealersData from "@/shared/data/dealers.json";

export default function DealerPage({
  params,
}: {
  params: Promise<{ dealerId: string }>;
}) {
  const { dealerId } = use(params);

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
      about: string;
      established: number;
      certifications: string[];
      staff: number;
      showroomSize: string;
      services: string[];
      newCars: { model: string; versions: string[]; stock: number }[];
      usedCars: { model: string; year: number; km: number; price: number }[];
      images: string[];
    }[];
  };

  const dealer = dealers.find((d) => d.id === dealerId);

  if (!dealer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Bayi bulunamadı</h1>
          <Link href="/dealers" className="mt-4 text-blue-600 hover:underline">
            Bayilere dön
          </Link>
        </div>
      </div>
    );
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <Link
            href={`/dealers?sales&dealer=${dealerId}`}
            className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Bayi listesine dön
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold">
              {dealer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {dealer.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {dealer.city} • {dealer.address}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                Bayi Hakkında
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {dealer.about}
              </p>
            </div>

            {dealer.newCars && dealer.newCars.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                  <Car className="h-5 w-5 text-green-600" />
                  Sıfır Araç Stokları
                </h2>
                <div className="space-y-3">
                  {dealer.newCars.map((car, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {car.model}
                        </div>
                        <div className="text-sm text-slate-500">
                          {car.versions.join(", ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {car.stock} araç
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dealer.usedCars && dealer.usedCars.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                  <Car className="h-5 w-5 text-orange-600" />
                  2. El Araçlar
                </h2>
                <div className="space-y-3">
                  {dealer.usedCars.map((car, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {car.model}
                        </div>
                        <div className="text-sm text-slate-500">
                          {car.year} • {car.km.toLocaleString()} km
                        </div>
                      </div>
                      <div className="font-bold text-orange-600">
                        {formatPrice(car.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
                Bayi Bilgileri
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <a
                    href={`tel:${dealer.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {dealer.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {dealer.hours}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {dealer.established} yılından bu yana
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {dealer.staff} personel
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {dealer.showroomSize}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
                Sertifikalar
              </h3>
              <div className="flex flex-wrap gap-2">
                {dealer.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-lg text-slate-900 dark:text-white">
                Hizmetler
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {dealer.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`tel:${dealer.phone}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Phone className="h-5 w-5" />
              Ara
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
