import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  normalizeProjectPayload,
  normalizeProjectRecord,
} from "@/Lib/projectData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_DELETE_PASSWORD || "Empaerial123";

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("Projects").select("*");
    if (error) throw error;
    return NextResponse.json(
      Array.isArray(data) ? data.map(normalizeProjectRecord) : []
    );
  } catch (error) {
    console.error("GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const payload = normalizeProjectPayload(body);

    const { data, error } = await supabase
      .from("Projects")
      .insert([payload])
      .select();

    if (error) throw error;
    return NextResponse.json(normalizeProjectRecord(data[0]));
  } catch (error) {
    console.error("POST error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 }
      );
    }

    const updates = normalizeProjectPayload(body);

    const { data, error } = await supabase
      .from("Projects")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json(normalizeProjectRecord(data[0]));
  } catch (error) {
    console.error("PATCH error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const supabase = getSupabase();
    const { id, password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { error } = await supabase.from("Projects").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
