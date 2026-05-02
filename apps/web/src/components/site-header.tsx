"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Users,
  Wrench,
  DollarSign,
  Globe,
  BookOpen,
  GitCompare,
  Lightbulb,
  Truck,
  Sparkles,
} from "lucide-react";

export default function SiteHeader() {
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a
          href="/"
          onClick={handleHomeClick}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl font-bold">
            🚗
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">
            BiYARDIMET
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/electric-hybrid"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-300"
          >
            <Leaf className="h-5 w-5" />
            Elektrikli & Hibrit
          </Link>
          <Link
            href="/dealers?tab=sales"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
          >
            <Users className="h-5 w-5" />
            Bayiler
          </Link>
          <Link
            href="/dealers?tab=service"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
          >
            <Wrench className="h-5 w-5" />
            Servis
          </Link>
          <Link
            href="/dealers?tab=campaigns"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
          >
            <DollarSign className="h-5 w-5" />
            Kampanyalar
          </Link>
          <Link
            href="/dealers?tab=overseas"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300"
          >
            <Globe className="h-5 w-5" />
            Yurt Dışı
          </Link>
          <Link
            href="/dealers?tab=tow"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-orange-600 dark:text-slate-300"
          >
            <Truck className="h-5 w-5" />
            Çekici
          </Link>
          <Link
            href="/dealers?tab=detailing"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-purple-600 dark:text-slate-300"
          >
            <Sparkles className="h-5 w-5" />
            Temizlik
          </Link>
          <Link
            href="/ipucclari"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-yellow-600 dark:text-slate-300"
          >
            <Lightbulb className="h-5 w-5" />
            İpuçları
          </Link>
          <Link
            href="/hikayemiz"
            className="flex items-center gap-2 text-slate-600 transition-colors hover:text-orange-600 dark:text-slate-300"
          >
            <BookOpen className="h-5 w-5" />
            Hikayemiz
          </Link>
        </nav>
      </div>
    </header>
  );
}
