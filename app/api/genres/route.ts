import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const [genres]: any = await pool.execute(
      "SELECT id, tmdb_id, name FROM genres ORDER BY name"
    );

    return NextResponse.json(genres);
  } catch (error: any) {
    console.error("Genres API error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data genre" },
      { status: 500 }
    );
  }
}
