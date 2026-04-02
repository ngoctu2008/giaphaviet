"use client";
import { useEffect } from "react";

export function PWAInstallCapture() {
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;

      // Dispatch a custom event so our hook knows it's ready
      window.dispatchEvent(new Event("pwa-prompt-ready"));
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return null;
}
