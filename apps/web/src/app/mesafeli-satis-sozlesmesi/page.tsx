export const metadata = {
  title: "Mesafeli Satış Sözleşmesi | BiYARDIMET",
  description: "BiYARDIMET mesafeli satış sözleşmesi.",
};

const sections = [
  {
    title: "1. Taraflar",
    text: "Bu sözleşme, BiYARDIMET üzerinden hizmet alan tüketici ile BiYARDIMET arasında, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir.",
  },
  {
    title: "2. Konu",
    text: "Sözleşmenin konusu; sitede sunulan fiyat karşılaştırma, bayi yönlendirme ve bilgilendirme hizmetlerinin koşullarıdır. Sitede listelenen araç fiyatları bilgilendirme amaçlıdır; satış işlemi yetkili bayilerce gerçekleştirilir.",
  },
  {
    title: "3. Hizmet Bedeli",
    text: "Karşılaştırma ve bilgilendirme hizmetleri kullanıcıya ücretsizdir. Bayi ve kampanya yönlendirmelerinde ek ücret talep edilmez.",
  },
  {
    title: "4. Cayma Hakkı",
    text: "Ücretsiz bilgilendirme hizmeti niteliği gereği cayma hakkı kapsamında iade edilecek bir bedel bulunmamaktadır. Ücretli bir hizmet sunulması halinde 14 günlük cayma hakkı koşulları ayrıca bildirilir.",
  },
  {
    title: "5. Uyuşmazlık",
    text: "Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.",
  },
];

export default function MesafeliSatisPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">Mesafeli Satış Sözleşmesi</h1>
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
