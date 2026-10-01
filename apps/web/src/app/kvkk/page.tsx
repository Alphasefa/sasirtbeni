export const metadata = {
  title: "KVKK Aydınlatma Metni | BiYARDIMET",
  description: "BiYARDIMET kişisel verilerin korunması aydınlatma metni.",
};

const sections = [
  {
    title: "1. Veri Sorumlusu",
    text: "BiYARDIMET (info@biyardimet.com, Maslak / İstanbul), 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu olarak hareket etmektedir.",
  },
  {
    title: "2. İşlenen Kişisel Veriler",
    text: "Ad-soyad, telefon numarası, e-posta adresi, şehir bilgisi ve site kullanımına ilişkin işlem güvenliği verileri (IP adresi, çerez kayıtları) işlenmektedir.",
  },
  {
    title: "3. İşleme Amaçları",
    text: "Verileriniz; bayi teklif taleplerinin iletilmesi, iletişim kurulması, hizmet kalitesinin artırılması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenir.",
  },
  {
    title: "4. Aktarım",
    text: "Teklif talepleriniz, talebinize konu olan yetkili bayi ile paylaşılır. Yasal zorunluluklar dışında üçüncü kişilerle paylaşım yapılmaz.",
  },
  {
    title: "5. Haklarınız",
    text: "KVKK m.11 uyarınca; verilerinize erişme, düzeltme, silme, işlenmeye itiraz etme ve zarar halinde tazminat talep etme haklarına sahipsiniz. Taleplerinizi info@biyardimet.com adresine iletebilirsiniz.",
  },
  {
    title: "6. Saklama Süresi",
    text: "Kişisel veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır.",
  },
];

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">KVKK Aydınlatma Metni</h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">Son güncelleme: Eylül 2026</p>
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
