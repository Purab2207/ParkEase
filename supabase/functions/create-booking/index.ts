import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function generateBookingId(): string {
  const year = new Date().getFullYear();
  const hex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase();
  return `PE-${year}-${hex}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const { event_id, bay_id, lot_id, phone, email, entry_window, vehicle_number, group_size = 1 } = await req.json();

    if (!phone || !/^\d{10}$/.test(phone))
      return new Response(JSON.stringify({ detail: "Phone must be 10 digits" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Upsert user by email only — phone excluded to avoid unique constraint conflicts across sessions.
    // Phone is stored in bookings.phone which is what ops (gate attendant, QR delivery) reads.
    const { data: userRow } = await supabase
      .from("users")
      .upsert({ email }, { onConflict: "email" })
      .select("id")
      .single();

    if (!userRow)
      return new Response(JSON.stringify({ detail: "Could not resolve user" }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });

    // Validate event
    const { data: eventRows } = await supabase.from("events").select("*").eq("id", event_id).limit(1);
    if (!eventRows || eventRows.length === 0)
      return new Response(JSON.stringify({ detail: "Event not found" }), {
        status: 404, headers: { ...CORS, "Content-Type": "application/json" },
      });

    const event = eventRows[0];
    const validWindows: string[] = event.entry_windows || [];
    if (validWindows.length > 0 && !validWindows.includes(entry_window))
      return new Response(
        JSON.stringify({ detail: `Invalid entry window. Choose one of: ${validWindows.join(", ")}` }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );

    const now = new Date().toISOString();

    // Atomic bay claim
    const { data: claimed } = await supabase
      .from("bays")
      .update({ status: "booked", booked_at: now })
      .eq("event_id", event_id)
      .eq("pillar_code", bay_id)
      .eq("status", "available")
      .select();

    if (!claimed || claimed.length === 0) {
      const { data: exists } = await supabase.from("bays").select("id").eq("event_id", event_id).eq("pillar_code", bay_id).limit(1);
      return new Response(
        JSON.stringify({ detail: exists?.length ? "Bay already taken" : "Bay not found" }),
        { status: exists?.length ? 409 : 404, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const bayRow = claimed[0];
    const bookingId = generateBookingId();

    await supabase.from("bookings").insert({
      booking_id: bookingId, event_id, bay_id: bayRow.id,
      user_id: userRow.id, phone, email,
      vehicle_number: vehicle_number ?? null, entry_window,
      amount_paid: event.price, status: "confirmed",
    });

    // Decrement spots_remaining — triggers Supabase Realtime on frontend
    const newRemaining = Math.max(event.spots_remaining - 1, 0);
    await supabase.from("events").update({ spots_remaining: newRemaining }).eq("id", event_id);

    return new Response(
      JSON.stringify({
        booking_id: bookingId, event_id, bay_id, lot_id, phone, email,
        vehicle_number: vehicle_number ?? null, entry_window,
        amount_paid: event.price, status: "confirmed", created_at: now,
      }),
      { status: 201, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
