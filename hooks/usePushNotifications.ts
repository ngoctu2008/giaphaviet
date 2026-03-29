"use client";

import { useState, useEffect } from "react";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setIsLoading(false);
    } catch (error) {
      console.error("Service worker registration failed:", error);
      setIsLoading(false);
    }
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;

      const response = await fetch('/api/push/vapid-public-key');
      const data = await response.json();

      if (!data.publicKey) {
          throw new Error("No public key found");
      }
      const vapidPublicKey = data.publicKey;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setSubscription(sub);

      // Send to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sub),
      });

      return sub;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      throw error;
    }
  }

  async function unsubscribeFromPush() {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);

        // Remove from server
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
    }
  }

  return {
    isSupported,
    subscription,
    isLoading,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

// Utility function to convert VAPID public key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
