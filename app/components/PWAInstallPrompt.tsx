"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (dismissed) {
        setIsDismissed(true);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setIsInstallable(false);
    setIsDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/50 p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-xl shrink-0">
            <Download className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-stone-900">Cài đặt ứng dụng</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cài đặt Gia phả Việt vào thiết bị của bạn để truy cập nhanh chóng và sử dụng dễ dàng hơn.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Để sau
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm"
          >
            Cài đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}
