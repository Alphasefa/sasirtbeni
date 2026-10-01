export const metadata = {
  title: "Kullanım Şartları | BiYARDIMET",
  description: "BiYARDIMET kullanım şartları.",
};

const sections = [
  {
    title: "1. Hizmetin Kapsamı",
    text: "BiYARDIMET; Türkiye ve Almanya araç fiyat karşılaştırması, vergi hesaplama, bayi ve kampanya bilgilendirmesi sunar. Fiyatlar bilgilendirme amaçlıdır ve bağlayıcı teklif niteliği taşımaz.",
  },
  {
    title: "2. Kullanıcı Yükümlülükleri",
    text: "Kullanıcı; doğru bilgi vermekle, siteyi hukuka aykırı amaçlarla kullanmamakla ve üçüncü kişilerin haklarını ihlal etmemekle yükümlüdür.",
  },
  {
    title: "3. Fikri Mülkiyet",
    text: "Sitedeki tasarım, metin ve yazılım BiYARDIMET'e aittir; izinsiz kopyalanamaz.",
  },
  {
    title: "4. Sorumluluk Sınırı",
    text: "Fiyat ve vergi hesaplamaları güncel verilere dayanmakla birlikte kesinlik garantisi verilmez; nihai fiyat için yetkili bayiye başvurunuz.",
  },
  {
    title: "5. Değişiklik",
    text: "Bu şartlar önceden haber verilmeksizin güncellenebilir; güncel metin sitede yayımlandığı tarihte yürürlüğe girer.",
  },
];

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">Kullanım Şartları</h1>
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
