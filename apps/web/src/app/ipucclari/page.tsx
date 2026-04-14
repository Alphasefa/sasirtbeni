import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Fuel,
  Battery,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Droplet,
  Gauge,
  Shield,
  Key,
  Sparkles,
  Car,
  Zap,
  Eye,
  Clock,
  DollarSign,
} from "lucide-react";

const tips = [
  {
    icon: Thermometer,
    title: "Hararet (Soğutma) Sistemi",
    summary:
      "Hararet ışığı yandığında hemen durun. Radyatör kapağını sıcakken açmayın. Antifriz seviyesini kontrol edin.",
    category: "Motor",
  },
  {
    icon: Wrench,
    title: "Periyodik Bakımın Önemi",
    summary:
      "Düzenli bakım, büyük arızaların önüne geçer. 10.000 TL'lik bir bakım, 100.000 TL'lik tamiri önler.",
    category: "Bakım",
  },
  {
    icon: Fuel,
    title: "Yakıt Tasarrufu İpuçları",
    summary:
      "Ani hızlanmalardan kaçının, düzgün vites değiştirin ve lastik basınçlarını kontrol edin.",
    category: "Yakıt",
  },
  {
    icon: Battery,
    title: "Akü Bakımı",
    summary:
      "Kış aylarında akü daha çabuk boşalır. Terminal bağlantılarını temiz tutun.",
    category: "Elektrik",
  },
  {
    icon: AlertTriangle,
    title: "Uyarı Işıkları Ne Anlama Gelir?",
    summary:
      "Motor ışığı yandığında hemen servise gidin. Hararet ışığı tehlikelidir.",
    category: "Güvenlik",
  },
  {
    icon: CheckCircle,
    title: "Kullanılmış Araç Alırken",
    summary:
      "Mutlaka ekspertiz yaptırın. Geçmiş sahipleri ve kilometresi kontrol edin.",
    category: "Satın Alma",
  },
  {
    icon: Droplet,
    title: "Motor Yağı Kontrolü",
    summary:
      "Her 1000 km'de yağ seviyesini kontrol edin. Yağ azalırsa tamamlayın ve motoru kontrol ettirin.",
    category: "Bakım",
  },
  {
    icon: Gauge,
    title: "Lastik Basıncı",
    summary:
      "Lastik basıncını ayda bir kontrol edin. Düşük basınç yakıt tüketirini artırır ve lastik ömrünü kısaltır.",
    category: "Güvenlik",
  },
  {
    icon: Shield,
    title: "Fren Sistemi Kontrolü",
    summary:
      "Fren balatalarını düzenli kontrol edin. Cızırtı varsa hemen değiştirin.",
    category: "Güvenlik",
  },
  {
    icon: Key,
    title: "Kontak Anahtarı",
    summary:
      "Motoru çalıştırmadan önce 2 saniye bekleyin. Marş dinlendikten sonra çalıştırın.",
    category: "Motor",
  },
  {
    icon: Sparkles,
    title: "Araç İçi Temizlik",
    summary:
      "Düzenli iç temizlik, araç değerini korur. Deri koltukları nemli bezle silin.",
    category: "Bakım",
  },
  {
    icon: Car,
    title: "Kışın Araç Kullanımı",
    summary:
      "Kışın aracı 5 dakika ısıtın. Buğulanmayı önlemek için defroster kullanın.",
    category: "Kış",
  },
  {
    icon: Zap,
    title: "Elektrikli Araç Bataryası",
    summary:
      "Bataryayı %20'nin altına düşürmeyin. Şarjı %80'de tutmak batarya ömrünü uzatır.",
    category: "Elektrikli",
  },
  {
    icon: Eye,
    title: "Far ve Sinyal Kontrolü",
    summary:
      "Haftada bir farları ve sinyalleri kontrol edin. Arızalı ampulleri hemen değiştirin.",
    category: "Güvenlik",
  },
  {
    icon: Clock,
    title: "Rölanti (Debriyaj) Kontrolü",
    summary:
      "Debriyaj pedalına fazla basmayın. Rölantiyi yüksek tutmak motor ömrünü uzatır.",
    category: "Motor",
  },
  {
    icon: DollarSign,
    title: "Araç Vergisi ve Sigorta",
    summary:
      "Vergileri ve sigortayı zamanında yaptırın. Gecikme cezası ödemeyin.",
    category: "Maliyet",
  },
  {
    icon: Thermometer,
    title: "Klima Bakımı",
    summary:
      "Klimayı yılda bir kez gazı ile doldurtun. Filtreleri düzenli değiştirin.",
    category: "Konfor",
  },
  {
    icon: Battery,
    title: "Akü Ömrünü Uzatın",
    summary:
      "Kısa mesafelerde çok kullanmayın. Uzun yol gittiğinde akü şarj olur.",
    category: "Elektrik",
  },
  {
    icon: Fuel,
    title: "Yanlış Yakıt Alma",
    summary:
      "Dizel araca benzin koymayın! Yanlış yakıt motoru ciddi hasar verir.",
    category: "Acil",
  },
  {
    icon: AlertTriangle,
    title: "Yolda Kalma Durumunda",
    summary:
      "Aracı kenara çekin, ikaz üçgeni koyun, bizi çağırın. Asla yolda yürümeyin.",
    category: "Güvenlik",
  },
];

export default function Ipuclari() {
  return (
    <div className="min-h-screen bg-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-bold text-4xl text-slate-900 dark:text-white">
            Araç Sahipleri İçin İpuçları
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Aracınızı sağlıklı tutmak ve bütçenizi korumak için bilmeniz
            gerekenler
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="group rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-slate-800"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900">
                  <tip.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {tip.category}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {tip.title}
                  </h3>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {tip.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <h2 className="mb-4 font-bold text-2xl">Hala Sorularınız mı Var?</h2>
          <p className="mb-6 text-blue-100">
            Araç fiyatları, servis ücretleri veya herhangi bir konuda yardımcı
            olalım.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dealers?tab=service"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Servis Bul
            </Link>
            <Link
              href="/compare"
              className="rounded-xl bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-400"
            >
              Fiyat Karşılaştır
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
