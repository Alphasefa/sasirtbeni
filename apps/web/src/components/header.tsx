"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Users,
  Wrench,
  DollarSign,
  Globe,
  BookOpen,
  Home,
} from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

const navItems = [
  { href: "/", icon: Home, label: "Ana Sayfa" },
  { href: "/electric-hybrid", icon: Leaf, label: "Elektrikli" },
  { href: "/dealers?tab=sales", icon: Users, label: "Bayiler" },
  { href: "/dealers?tab=service", icon: Wrench, label: "Servis" },
  { href: "/dealers?tab=campaigns", icon: DollarSign, label: "Kampanyalar" },
  { href: "/dealers?tab=overseas", icon: Globe, label: "Yurt Dışı" },
  { href: "/hikayemiz", icon: BookOpen, label: "Hikayemiz" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-1 text-sm md:gap-2 md:text-base overflow-x-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href.split("?")[0]));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
