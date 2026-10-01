export const metadata = {
  title: "Gizlilik Politikası | BiYARDIMET",
  description: "BiYARDIMET gizlilik politikası.",
};

const sections = [
  {
    title: "1. Toplanan Bilgiler",
    text: "İletişim formları ve teklif talepleri aracılığıyla paylaştığınız bilgiler ile çerezler vasıtasıyla toplanan anonim kullanım verileri saklanır.",
  },
  {
    title: "2. Çerezler",
    text: "Site; oturum yönetimi, tercihlerin hatırlanması (favoriler, son bakılanlar) ve anonim istatistik için çerez ve yerel depolama kullanır. Tarayıcı ayarlarından çerezleri engelleyebilirsiniz.",
  },
  {
    title: "3. Kullanım Amacı",
    text: "Bilgileriniz yalnızca hizmet sunumu, iletişim ve yasal yükümlülükler için kullanılır; pazarlama amacıyla üçüncü kişilerle paylaşılmaz.",
  },
  {
    title: "4. Güvenlik",
    text: "Verilerin korunması için güncel teknik ve idari tedbirler uygulanır. Buna rağmen internet üzerinden iletimin tam güvenli olduğu garanti edilemez.",
  },
  {
    title: "5. İletişim",
    text: "Gizlilikle ilgili sorularınız için info@biyardimet.com adresinden bize ulaşabilirsiniz.",
  },
];

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">Gizlilik Politikası</h1>
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
