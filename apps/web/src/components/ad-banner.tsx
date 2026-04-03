"use client";

export default function AdBanner({ slot }: { slot: string }) {
  return (
    <div className="my-8 flex items-center justify-center rounded-xl bg-slate-100 p-4 text-center dark:bg-slate-800">
      <div className="text-slate-500 text-sm">
        Reklam Alanı ({slot})
      </div>
    </div>
  );
}
