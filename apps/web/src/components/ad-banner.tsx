"use client";

import { useEffect, useState } from "react";

interface AdUnit {
  id: string;
  name: string;
  image: string;
  url: string;
}

const ads: Record<string, AdUnit[]> = {
  "homepage-top": [
    {
      id: "1",
      name: "Toyota Türkiye",
      image: "https://placehold.co/728x90/2563eb/white?text=Toyota+Reklam",
      url: "https://toyota.com.tr",
    },
    {
      id: "2",
      name: "Volkswagen",
      image: "https://placehold.co/728x90/dc2626/white?text=Volkswagen+Reklam",
      url: "https://vw.com.tr",
    },
    {
      id: "3",
      name: "BMW Türkiye",
      image: "https://placehold.co/728x90/1e40af/white?text=BMW+Reklam",
      url: "https://bmw.com.tr",
    },
  ],
  "compare-page": [
    {
      id: "4",
      name: "Audi",
      image: "https://placehold.co/728x90/000000/white?text=Audi+Reklam",
      url: "https://audi.com.tr",
    },
    {
      id: "5",
      name: "Mercedes-Benz",
      image: "https://placehold.co/728x90/1e3a8a/white?text=Mercedes+Reklam",
      url: "https://mercedes-benz.com.tr",
    },
  ],
  "sidebar-left": [
    {
      id: "6",
      name: "Hyundai",
      image: "https://placehold.co/160x600/f59e0b/white?text=Hyundai",
      url: "https://hyundai.com.tr",
    },
    {
      id: "7",
      name: "Kia",
      image: "https://placehold.co/160x600/2563eb/white?text=Kia",
      url: "https://kia.com.tr",
    },
  ],
  "sidebar-right": [
    {
      id: "8",
      name: "Renault",
      image: "https://placehold.co/160x600/2563eb/white?text=Renault",
      url: "https://renault.com.tr",
    },
    {
      id: "9",
      name: "Peugeot",
      image: "https://placehold.co/160x600/1e3a8a/white?text=Peugeot",
      url: "https://peugeot.com.tr",
    },
  ],
};

export default function AdBanner({
  slot,
  position = "center",
}: {
  slot: string;
  position?: "center" | "left" | "right";
}) {
  const [currentAd, setCurrentAd] = useState<AdUnit | null>(null);

  useEffect(() => {
    const slotAds = ads[slot] || ads["homepage-top"];
    const randomAd = slotAds[Math.floor(Math.random() * slotAds.length)];
    setCurrentAd(randomAd);

    const interval = setInterval(() => {
      setCurrentAd((prev) => {
        const currentIndex = slotAds.findIndex((a) => a.id === prev?.id);
        const nextIndex = (currentIndex + 1) % slotAds.length;
        return slotAds[nextIndex];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [slot]);

  if (!currentAd) return null;

  if (position === "left" || position === "right") {
    return (
      <div className="my-4 flex justify-start">
        <a
          href={currentAd.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <img
            src={currentAd.image}
            alt={currentAd.name}
            className="h-[600px] w-[160px] rounded-lg object-cover"
          />
        </a>
      </div>
    );
  }

  return (
    <div className="my-8 flex justify-center">
      <a
        href={currentAd.url}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <img
          src={currentAd.image}
          alt={currentAd.name}
          className="max-w-full rounded-lg"
        />
      </a>
    </div>
  );
}
