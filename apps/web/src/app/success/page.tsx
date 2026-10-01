import Link from "next/link";
import { Check, Home } from "lucide-react";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const params = await searchParams;
  const session_id = params.session_id;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Ödeme Başarılı!</h1>
        <p className="mb-4 text-slate-500 dark:text-slate-400">
          Satın alımınız için teşekkürler. Ödemeniz başarıyla işlendi.
        </p>
        {session_id && <p className="mb-6 text-sm text-slate-400">Oturum ID: {session_id}</p>}
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
