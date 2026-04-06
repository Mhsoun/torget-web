"use client";

import { useEffect } from "react";

export function PublicLayoutDebugProbe() {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7268/ingest/5a5cc7fb-dc54-4f3b-8e40-459b194f7edd", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1a99c7" },
      body: JSON.stringify({
        sessionId: "1a99c7",
        runId: "run-2",
        hypothesisId: "H1",
        location: "components/debug/PublicLayoutDebugProbe.tsx:8",
        message: "Public layout debug probe mounted",
        data: {
          path: window.location.pathname,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const logo = document.querySelector('img[src*="/brands/torget/logo.svg"]') as HTMLImageElement | null;
    // #region agent log
    fetch("http://127.0.0.1:7268/ingest/5a5cc7fb-dc54-4f3b-8e40-459b194f7edd", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1a99c7" },
      body: JSON.stringify({
        sessionId: "1a99c7",
        runId: "run-2",
        hypothesisId: "H2",
        location: "components/debug/PublicLayoutDebugProbe.tsx:29",
        message: "Header logo dimensions in public layout",
        data: logo
          ? {
              attrWidth: logo.getAttribute("width"),
              attrHeight: logo.getAttribute("height"),
              inlineWidth: logo.style.width || null,
              inlineHeight: logo.style.height || null,
              computedWidth: window.getComputedStyle(logo).width,
              computedHeight: window.getComputedStyle(logo).height,
              className: logo.className,
            }
          : { logoFound: false },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return null;
}
