"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Bir şeyler ters gitti</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
