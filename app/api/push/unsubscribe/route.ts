import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // We only need the endpoint to delete
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .match({ endpoint });

    if (error) {
      console.error("Supabase error deleting subscription:", error);
      return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in unsubscribe route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
