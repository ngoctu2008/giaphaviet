import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    // We can allow anonymous subscriptions, or require auth
    // For this app, we'll try to link to a user if authenticated

    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
    }

    // Insert or update the subscription
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert({
        user_id: user?.id || null,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'endpoint' });

    if (error) {
      console.error("Supabase error saving subscription:", error);
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in subscribe route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
