"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  GitCompare,
  Leaf,
  Users,
  DollarSign,
  Globe,
  Lightbulb,
  BookOpen,
  Wrench,
} from "lucide-react";

const navItems: { href: string; label: string; icon: any; color: string }[] = [
  { href: "/", label: "Karşılaştır", icon: GitCompare, color: "text-blue-600" },
  { href: "/electric-hybrid", label: "Elektrikli & Hibrit", icon: Leaf, color: "text-emerald-600" },
  { href: "/dealers?tab=sales", label: "Bayiler", icon: Users, color: "text-blue-600" },
  { href: "/hizmetler", label: "Hizmetler", icon: Wrench, color: "text-orange-600" },
  { href: "/dealers?tab=campaigns", label: "Kampanyalar", icon: DollarSign, color: "text-green-600" },
  { href: "/dealers?tab=overseas", label: "Yurt Dışı Fiyatları", icon: Globe, color: "text-blue-500" },
  { href: "/ipucclari", label: "İpuçları", icon: Lightbulb, color: "text-yellow-500" },
  { href: "/hikayemiz", label: "Hikayemiz", icon: BookOpen, color: "text-orange-500" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
        aria-label="Menüyü aç"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-[201] h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-lg text-white font-bold">
              🚗
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              BiYARDIMET
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 dark:border-slate-700">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800"
          >
            <GitCompare className="h-4 w-4" />
            Karşılaştırmaya Başla
          </Link>
        </div>
      </div>
    </>
  );
}
