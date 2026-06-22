import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth-utils";
import pool from "@/app/lib/db";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const [rows]: any = await pool.execute(
      `SELECT r.id, r.rating, r.content AS review_text, r.created_at,
              u.username, m.title as movie_title
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN movies m ON r.movie_id = m.id
       ORDER BY r.created_at DESC`,
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
