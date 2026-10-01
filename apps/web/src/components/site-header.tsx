"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Leaf,
  Users,
  DollarSign,
  Globe,
  BookOpen,
  GitCompare,
  Lightbulb,
  ChevronDown,
  Wrench,
} from "lucide-react";
import MobileMenu from "./mobile-menu";

const mainLinks: { href: string; label: string; icon: any; color: string }[] = [
  { href: "/", label: "Karşılaştır", icon: GitCompare, color: "text-blue-600" },
  { href: "/electric-hybrid", label: "Elektrikli & Hibrit", icon: Leaf, color: "text-emerald-600" },
  { href: "/dealers?tab=sales", label: "Bayiler", icon: Users, color: "text-blue-600" },
  { href: "/hizmetler", label: "Hizmetler", icon: Wrench, color: "text-orange-600" },
];

const moreLinks: { href: string; label: string; icon: any; color: string }[] = [
  { href: "/dealers?tab=overseas", label: "Yurt Dışı Fiyatları", icon: Globe, color: "text-blue-500" },
  { href: "/dealers?tab=campaigns", label: "Kampanyalar", icon: DollarSign, color: "text-green-600" },
  { href: "/ipucclari", label: "İpuçları", icon: Lightbulb, color: "text-yellow-500" },
  { href: "/hikayemiz", label: "Hikayemiz", icon: BookOpen, color: "text-orange-500" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
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

        <nav className="hidden items-center gap-1 md:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <link.icon className={`h-4 w-4 ${link.color}`} />
              {link.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Diğer
              <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isActive(link.href)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <link.icon className={`h-4 w-4 ${link.color}`} />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
