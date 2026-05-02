"use client";

import { useEffect } from "react";

export default function ScrollRestoration() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  return null;
}
        });
      }
    }
    initialized.current = true;
  }, [pathname]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const saveScroll = () => {
      sessionStorage.setItem(
        "scrollPos_" + pathname,
        main.scrollTop.toString(),
      );
    };

    main.addEventListener("scroll", saveScroll, { passive: true });
    return () => main.removeEventListener("scroll", saveScroll);
  }, [pathname]);

  return null;
}
