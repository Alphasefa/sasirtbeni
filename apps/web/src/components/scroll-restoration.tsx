"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const positions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const key = pathname + "?" + searchParams.toString();
    const saved = sessionStorage.getItem("scroll_" + key);

    if (saved) {
      setTimeout(() => {
        const main = document.querySelector("main");
        if (main) {
          main.scrollTo(0, parseInt(saved));
        }
      }, 100);
    }
  }, [pathname, searchParams, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const main = document.querySelector("main");
      if (!main) return;

      const key = pathname + "?" + searchParams.toString();
      sessionStorage.setItem("scroll_" + key, main.scrollTop.toString());
    };

    const main = document.querySelector("main");
    if (main) {
      main.addEventListener("scroll", handleScroll, { passive: true });
      return () => main.removeEventListener("scroll", handleScroll);
    }
  }, [pathname, searchParams, mounted]);

  return null;
}
