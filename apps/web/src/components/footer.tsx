"use client";

import Link from "next/link";
import { Car, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  vehicles: [
    { label: "Karşılaştır", href: "/compare" },
    { label: "Elektrikli & Hibrit", href: "/electric-hybrid" },
    { label: "Kampanyalar", href: "/dealers?tab=campaigns" },
  ],
  services: [
    { label: "Hizmetler", href: "/hizmetler" },
    { label: "Bayiler", href: "/dealers" },
    { label: "İpuçları", href: "/ipucclari" },
  ],
  company: [
    { label: "Hikayemiz", href: "/hikayemiz" },
    { label: "İletişim", href: "/iletisim" },
  ],
  legal: [
    { label: "KVKK", href: "/kvkk" },
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Mesafeli Satış", href: "/mesafeli-satis-sozlesmesi" },
    { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Bi<span className="text-blue-600">YARDIM</span>ET
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Türkiye ve Almanya araç fiyatlarını karşılaştır. ÖTV ve KDV dahil ne kadar vergi ödediğini gör.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="mailto:info@biyardimet.com" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900">
                <Mail className="h-4 w-4" />
              </a>
              <a href="tel:+908503200400" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900">
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">Araçlar</h4>
            <ul className="space-y-2">
              {footerLinks.vehicles.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">Hizmetler</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">Şirket</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">Yasal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 BiYARDIMET. Tüm fiyatlar bilgilendirme amaçlıdır.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Güncel kur: TCMB referans döviz kuru</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
