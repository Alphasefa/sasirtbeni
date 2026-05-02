"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const positions = useRef<Record<string, number>>({});
  const isBackNavigation = useRef(false);

  const getKey = useCallback(() => {
    return (
      pathname + (searchParams?.toString() ? "?" + searchParams.toString() : "")
    );
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isBackNavigation.current) {
      const key = getKey();
      const saved = positions.current[key];
      if (saved !== undefined && saved > 0) {
        setTimeout(() => {
          window.scrollTo(0, saved);
        }, 50);
      }
      isBackNavigation.current = false;
    }
  }, [pathname, getKey]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const key = getKey();
      positions.current[key] = window.scrollY;
    };

    const handlePopState = () => {
      const key = getKey();
      const currentPos = window.scrollY;
      if (currentPos > 50) {
        positions.current[key] = currentPos;
      }
      isBackNavigation.current = true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [getKey]);

  return null;
}
