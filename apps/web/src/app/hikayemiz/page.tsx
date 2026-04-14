import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Hikayemiz() {
  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <div className="container mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Geri
          </Link>
          <span className="font-bold text-xl text-slate-900 dark:text-white">
            Hikayemiz
          </span>
          <div className="w-10" />
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-lg dark:bg-slate-800">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-5xl">
              🚗
            </div>
          </div>

          <h1 className="mb-8 text-center font-bold text-4xl text-slate-900 dark:text-white">
            Biz Kimiz?
          </h1>

          <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              <span className="font-semibold text-orange-600">Bir gün</span>{" "}
              yolda giderken göstergedeki bir uyarıyı görmezden geldim. "Batarya
              düşük, en yakın şarj istasyonuna gidin" diyordu ama "biraz daha
              gider yetişir" dedim.
            </p>
            <p>
              Tabii ki yetmedi. Yolda kaldım. Çekici çağırdım, servise taşıdık,{" "}
              <span className="font-bold text-red-600">10.000 TL</span> fatura
              geldi. Ama asıl sürpriz sonra geldi: tam servis kontrolünde{" "}
              <span className="font-bold text-red-600">
                batarya hasar görmüş
              </span>{" "}
              çıktı. Fatura{" "}
              <span className="font-bold text-red-600">100.000 TL</span> oldu!
            </p>
            <p>
              Sadece <span className="font-semibold">10.000 TL</span> ile{" "}
              <span className="font-semibold">100.000 TL</span> arasında fark
              şuydu: bir uyarıyı ciddiye almamak.
            </p>
          </div>

          <div className="mt-10 rounded-xl bg-orange-50 p-6 text-center dark:bg-orange-900/20">
            <p className="font-bold text-orange-800 dark:text-orange-400">
              Bu proje, aynı hatayı bir daha yapmamanız için var.
            </p>
            <p className="mt-2 text-orange-700 dark:text-orange-500">
              Araç fiyatlarını karşılaştırın, yedek parça ve servis fiyatlarını
              inceleyin, bilinçli karar verin.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-6 text-center dark:bg-blue-900/20">
              <div className="mb-2 text-3xl">💰</div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-400">
                Fiyat Karşılaştırma
              </h3>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-500">
                Dünya ve Türkiye fiyatlarını karşılaştırın
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-6 text-center dark:bg-green-900/20">
              <div className="mb-2 text-3xl">🔧</div>
              <h3 className="font-semibold text-green-900 dark:text-green-400">
                Servis Fiyatları
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-500">
                Yedek parça ve bakım fiyatlarını görün
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-6 text-center dark:bg-purple-900/20">
              <div className="mb-2 text-3xl">⚡</div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-400">
                Elektrikli Araçlar
              </h3>
              <p className="mt-2 text-sm text-purple-700 dark:text-purple-500">
                EV ve hibrit araçlar hakkında bilgi edinin
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Karşılaştırmaya Başla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
