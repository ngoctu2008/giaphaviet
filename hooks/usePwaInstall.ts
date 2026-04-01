"use client";
import { useState, useEffect } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    if (typeof window !== "undefined") {
      const mqStandAlone = window.matchMedia('(display-mode: standalone)').matches;
      // @ts-ignore
      const isIosStandalone = window.navigator.standalone === true;
      if (mqStandAlone || isIosStandalone) {
        setIsInstalled(true);
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

  const installPwa = async () => {
    if (!deferredPrompt) {
      alert("Thiết bị hoặc trình duyệt của bạn không hỗ trợ cài đặt ứng dụng, hoặc ứng dụng đã được cài đặt. Thử dùng Chrome/Safari trên di động và chọn 'Thêm vào màn hình chính' (Add to Home Screen).");
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);

    if (outcome === 'accepted') {
       setIsInstalled(true);
    }
  };

  return { isInstallable, isInstalled, installPwa };
}
