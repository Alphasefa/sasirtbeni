import Link from "next/link";
import { Car, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          <Car className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mb-1 font-semibold text-slate-900 dark:text-white">Sayfa bulunamadı</p>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Aradığınız sayfa taşınmış veya silinmiş olabilir.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
