"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import brandAdsData from "@/shared/data/brand-ads.json";

type BrandAd = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  link: string;
};

type BrandData = {
  name: string;
  website: string;
  models: string[];
  ads: BrandAd[];
};

const brandAds = brandAdsData as Record<string, BrandData>;

const defaultAds: BrandAd[] = [
  {
    id: "default-1",
    title: "Audi Q6 e-tron",
    subtitle: "Elektrikli mobiliteyi bir üst seviyeye taşıyor",
    description: "Olağanüstü elektrikli performans, ilerici tasarım",
    image:
      "https://emea-dam.audi.com/adobe/assets/urn:aaid:aem:c1951c7b-dd59-4467-9170-c1e7dfa3e85e/as/new-Q6-e-tron%201080x1920.png",
    cta: "Keşfet",
    link: "https://www.audi.com.tr/tr/modeller/q6-e-tron/",
  },
  {
    id: "default-2",
    title: "BMW iX",
    subtitle: "Elektrikli Gelecek",
    description: "Sürdürülebilir lüks deneyimi",
    image: "https://images.bmw.com/bmwconnect/ix-2024.png",
    cta: "Keşfet",
    link: "https://www.bmw.com.tr/tr/bmw-bir-auto/ix.html",
  },
  {
    id: "default-3",
    title: "Mercedes-Benz EQS",
    subtitle: "Elektrikli Lüks",
    description: "Sıfır emisyon, sınırsız konfor",
    image: "https://images.mercedes-benz.com/eqs-2024.png",
    cta: "Keşfet",
    link: "https://www.mersedes-benz.com.tr/tr/eqs",
  },
];

const brandKeyMap: Record<string, string> = {
  "alfa romeo": "alfa-romeo",
  alfaromeo: "alfa-romeo",
  "alfa romëo": "alfa-romeo",
  "land rover": "landrover",
  landrover: "landrover",
  jaguar: "jaguar",
  mini: "mini",
  smart: "smart",
  byd: "byd",
  tiggo: "tiggo",
};

export default function AdBanner({
  slot,
  brand,
}: {
  slot: string;
  brand?: string;
}) {
  const params = useParams();
  const brandId = brand || (params?.brand as string);

  const getAds = (): BrandAd[] => {
    if (!brandId) return [];

    let brandKey = brandId.toLowerCase();
    brandKey = brandKeyMap[brandKey] || brandKey;

    const brandData = brandAds[brandKey];

    if (brandData?.ads && brandData.ads.length > 0) {
      return brandData.ads;
    }

    return [];
  };

  const ads = getAds();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    setCurrentAdIndex(0);
  }, [brandId]);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const ad = ads[currentAdIndex] || ads[0];

  if (!ad) {
    return null;
  }

  if (slot.includes("hero")) {
    if (ads.length === 0) {
      return null;
    }

    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        {ad.image && (
          <img
            src={ad.image}
            alt={ad.title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="relative flex min-h-[200px] flex-col justify-center p-6 md:p-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {brandId
                ? (brandKeyMap[brandId.toLowerCase()]
                    ? brandAds[brandKeyMap[brandId.toLowerCase()]]?.name
                    : brandAds[brandId.toLowerCase()]?.name) ||
                  brandId.toUpperCase()
                : "Reklam"}
            </span>
          </div>
          <h3 className="mb-1 font-bold text-2xl text-white md:text-3xl">
            {ad.title}
          </h3>
          <p className="mb-4 text-sm text-white/80 md:text-base">
            {ad.subtitle}
          </p>
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-max items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-900 transition-all hover:bg-slate-100"
          >
            {ad.cta} →
          </a>
        </div>
        {ads.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAdIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentAdIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (slot.includes("bottom")) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {ads.slice(0, 2).map((adItem) => (
          <a
            key={adItem.id}
            href={adItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            {adItem.image && (
              <img
                src={adItem.image}
                alt={adItem.title}
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="relative flex h-36 flex-col justify-end p-5">
              <h4 className="font-bold text-white text-lg">{adItem.title}</h4>
              <p className="text-white/70 text-sm">{adItem.subtitle}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white">
                {adItem.cta} →
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-slate-800"
    >
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (
                e.target as HTMLImageElement
              ).nextElementSibling?.classList.remove("hidden");
            }}
            style={{ display: "none" }}
          />
        ) : null}
        <span className={`text-2xl ${ad.image ? "hidden" : ""}`}>🚗</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900 dark:text-white">
          {ad.title}
        </h4>
        <p className="text-slate-500 text-sm dark:text-slate-400">
          {ad.subtitle}
        </p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform group-hover:translate-x-1 dark:bg-blue-900">
        →
      </div>
    </a>
  );
}
