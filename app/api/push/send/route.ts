import { NextResponse } from "next/server";
import { sendPushNotification } from "@/utils/push";

export async function POST(request: Request) {
  try {
    const { title, body, url } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
    }

    // Call the push utility
    await sendPushNotification(title, body, url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
