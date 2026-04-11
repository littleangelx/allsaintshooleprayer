import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { supabaseServer } from "@/app/lib/supabase/server";

export async function POST(req) {
  const supabase = await supabaseServer();
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract text from Word doc
  const { value: text } = await mammoth.extractRawText({ buffer });

  /**
   * Split rules:
   * - New lines
   * - Commas
   * - Combination of both
   */
  const names = text
    .split(/[\n,]+/) // 👈 key line
    .map((n) => n.trim())
    .filter(Boolean);

  // Optional cleanup
  const cleanedNames = [...new Set(names.map((n) => n.replace(/\s+/g, " ")))];

  const rows = cleanedNames.map((name) => ({ name }));

  const { error } = await supabase
    .from("prayer_lists")
    .insert({ people: cleanedNames, type: "bereavement" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    count: rows.length,
  });
}
