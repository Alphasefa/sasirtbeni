"use client";

import { useState } from "react";
import { Check, Mail, MapPin, Phone, Send } from "lucide-react";

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">İletişim</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sorularınız için bize yazın, en kısa sürede dönüş yapalım.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Telefon", value: "0850 320 04 00", href: "tel:+908503200400" },
              { icon: Mail, title: "E-posta", value: "info@biyardimet.com", href: "mailto:info@biyardimet.com" },
              { icon: MapPin, title: "Adres", value: "Maslak, İstanbul, Türkiye" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{item.title}</div>
                  {item.href ? (
                    <a href={item.href} className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white">
                      {item.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-slate-900 dark:text-white">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800 lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">Mesajınız Alındı</h2>
                <p className="text-center text-slate-500 dark:text-slate-400">
                  Teşekkürler! En kısa sürede size dönüş yapacağız.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      E-posta
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="ornek@eposta.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Konu
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Mesajınızın konusu"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mesaj
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    rows={5}
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
