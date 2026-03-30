"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationPrompt() {
  const { isSupported, subscription, subscribeToPush, isLoading } = usePushNotifications();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("push-prompt-dismissed");
      if (dismissed) {
        setIsDismissed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isSupported && !subscription && !isDismissed) {
      // Check if user has already granted or denied permission natively
      if (Notification.permission === "default") {
        setShowPrompt(true);
      }
    }
  }, [isLoading, isSupported, subscription, isDismissed]);

  const handleSubscribe = async () => {
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        await subscribeToPush();
        setShowPrompt(false);
      } else {
        // User denied the permission prompt natively
        handleDismiss();
      }
    } catch (error) {
      console.error("Failed to subscribe from prompt:", error);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem("push-prompt-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-sky-200/50 p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-sky-100 p-2 rounded-xl shrink-0">
            <Bell className="w-5 h-5 text-sky-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-stone-900">Bật thông báo ứng dụng</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Để không bỏ lỡ các tin tức mới nhất về dòng họ và thông báo các ngày giỗ sắp tới.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Từ chối
          </button>
          <button
            onClick={handleSubscribe}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
