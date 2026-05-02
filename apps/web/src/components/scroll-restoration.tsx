"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const saveScroll = () => {
      scrollPositions.current.set(pathname, main.scrollTop);
    };

    const restoreScroll = () => {
      const savedPosition = scrollPositions.current.get(pathname);
      if (savedPosition !== undefined) {
        setTimeout(() => {
          main.scrollTo(0, savedPosition);
        }, 50);
      }
    };

    window.addEventListener("beforeunload", saveScroll);

    const handlePopState = () => {
      restoreScroll();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [pathname]);

  return null;
}
