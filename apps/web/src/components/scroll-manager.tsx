"use client";

import { useEffect, useRef } from "react";

export default function ScrollManager() {
  const scrollRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const key = window.location.pathname;

    // Restore scroll position when returning to this page
    const saved = sessionStorage.getItem("scroll_" + key);
    if (saved && window.location.hash === "") {
      setTimeout(() => {
        window.scrollTo(0, parseInt(saved));
      }, 100);
    }

    // Save scroll position when leaving
    const saveScroll = () => {
      sessionStorage.setItem("scroll_" + key, window.scrollY.toString());
    };

    window.addEventListener("beforeunload", saveScroll);

    // Also save on popstate (back/forward buttons)
    window.addEventListener("popstate", saveScroll);

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      window.removeEventListener("popstate", saveScroll);
    };
  }, []);

  return null;
}
