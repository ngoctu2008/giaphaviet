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

    // Check if the prompt was already captured before this component mounted
    if (typeof window !== "undefined" && (window as any).deferredPWAInstallPrompt) {
      setDeferredPrompt((window as any).deferredPWAInstallPrompt);
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      if (typeof window !== "undefined") {
        (window as any).deferredPWAInstallPrompt = e;
      }
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    const handleCustomPromptReady = () => {
      if (typeof window !== "undefined" && (window as any).deferredPWAInstallPrompt) {
        setDeferredPrompt((window as any).deferredPWAInstallPrompt);
        setIsInstallable(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("pwa-prompt-ready", handleCustomPromptReady);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwa-prompt-ready", handleCustomPromptReady);
    };
  }, []);

  const installPwa = async () => {
    // Try to get from window if state was lost
    const promptEvent = deferredPrompt || (typeof window !== "undefined" ? (window as any).deferredPWAInstallPrompt : null);

    // If no deferred prompt, maybe they are on iOS or the app is already installed
    if (!promptEvent) {
      alert("Thiết bị hoặc trình duyệt của bạn chưa sẵn sàng cài đặt ứng dụng, hoặc ứng dụng đã được cài đặt. Đối với iPhone/iPad (Safari), vui lòng chọn nút 'Chia sẻ' ở dưới cùng màn hình và chọn 'Thêm vào màn hình chính' (Add to Home Screen).");
      return;
    }

    // Show the install prompt
    try {
      promptEvent.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await promptEvent.userChoice;

      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        (window as any).deferredPWAInstallPrompt = null;
      }
      setIsInstallable(false);

      if (outcome === 'accepted') {
         setIsInstalled(true);
      }
    } catch (error) {
      console.error("Error prompting PWA install:", error);
    }
  };

  return { isInstallable, isInstalled, installPwa };
}
