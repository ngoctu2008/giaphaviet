import webPush from "web-push";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Configure web-push with VAPID keys
if (
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY
) {
  webPush.setVapidDetails(
    "mailto:admin@example.com", // A contact email for the push service
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

/**
 * Utility function to send a push notification to all stored subscriptions.
 */
export async function sendPushNotification(title: string, body: string, url?: string) {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn("VAPID keys not configured. Push notifications are disabled.");
    return;
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch all subscriptions (for simplicity, we broadcast to all users)
  // In a large app, you'd want to paginate or filter by specific users
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*");

  if (error || !subscriptions || subscriptions.length === 0) {
    console.log("No subscriptions found to notify.");
    return;
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: "/android-chrome-192x192.png",
    badge: "/android-chrome-192x192.png",
    url: url || "/",
  });

  const promises = subscriptions.map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      await webPush.sendNotification(pushSubscription, payload);
    } catch (err: any) {
      console.error(`Failed to send notification to ${sub.endpoint}:`, err.message);

      // If the subscription is gone or invalid (status 410 or 404), remove it from DB
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .match({ endpoint: sub.endpoint });
      }
    }
  });

  await Promise.allSettled(promises);
}
