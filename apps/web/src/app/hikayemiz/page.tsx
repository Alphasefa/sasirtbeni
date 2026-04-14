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
            Biz O Manzarayi Gördük ve Bir Söz Verdik
          </h1>

          <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Yol kenarinda dumanlar içinde bekleyen o sürücüyü gördüğümüzde
              sadece arizali bir metal degil; sarsilmis bir bütçe ve kaybolmus
              bir huzur gördük. Bir saniyelik ihmalin, bir servet kaybina nasil
              dönüstüğüne sahit olduk.
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-red-50 p-6 dark:bg-red-900/20">
            <h2 className="mb-4 font-bold text-2xl text-red-800 dark:text-red-400">
              DegEr, RakaMdan Büyüktür
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Aracınızin degeri ne olursa olsun, paneldeki küçük bir uyariyi
              yönetememek sizi milyonluk zararlara sürükleyebilir. Aracınızi yok
              pahasina sattiracak o stresli süreci yönetmek için buradayiz.
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-orange-50 p-6 dark:bg-orange-900/20">
            <h2 className="mb-4 font-bold text-2xl text-orange-800 dark:text-orange-400">
              Belki Geç Kaldınız, Ama Yalnız Değilsiniz
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Felaketle çoktan yüz yüze gelmiş olsaniz bile üzülmeyin; enkazi
              çözüme dönüştürüyoruz:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl mb-2">👨‍🔧</div>
                <h3 className="font-semibold">Seçilmis Uzman Kadrosu</h3>
                <p className="text-sm">
                  Aracınızi rastgele ellere degil, titizlikle sectigimiz ehli
                  ustalara emanet ediyoruz.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="font-semibold">Sizin Adiniza Pazarlik</h3>
                <p className="text-sm">
                  Sektörel gücümüzle pazarlik masasina oturuyor, en makul
                  fiyatlari aliyoruz.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-semibold">Garantili Hizmet</h3>
                <p className="text-sm">
                  Yapilan her islemin arkasinda duruyor, kurumsal güvence
                  sagliyoruz.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
            <h2 className="mb-4 font-bold text-2xl text-blue-800 dark:text-blue-400">
              Profesyonel Yol Arkadasligi
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Sanayi jargonlarini ve karmasayi bir kenara birakin. Fiyat
              karsilastirmalarindan teknik servise kadar her assamada; en dogru
              hizmeti, en rasyonel maliyetle sunuyoruz.
            </p>
            <p className="mt-4 font-bold text-lg text-orange-700 dark:text-orange-400">
              "Siz sadece yolun tadini çikarin. Biz, en zor aninizda
              yatiriminizi koruyan o profesyonel güç olarak yaninizdayiz."
            </p>
            <p className="mt-3 font-bold text-lg text-green-700 dark:text-green-400">
              "Aracizin degeri ne olursa olsun, bizim gözimizde o korunmasi
              gereken bir yatirimdir. Sizi yol kenarinda çaresiz, bütçenizi ise
              belirsiz birakmamak için buradayiz."
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Karsilastirmaya Basla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
