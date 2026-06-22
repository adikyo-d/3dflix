import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth-utils";
import pool from "@/app/lib/db";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const [movieRows]: any = await pool.execute(
      "SELECT COUNT(*) as total FROM movies",
    );
    const [userRows]: any = await pool.execute(
      "SELECT COUNT(*) as total FROM users",
    );
    const [reviewRows]: any = await pool.execute(
      "SELECT COUNT(*) as total FROM reviews",
    );
    const [bannedRows]: any = await pool.execute(
      "SELECT COUNT(*) as total FROM users WHERE is_banned = 1",
    );

    return NextResponse.json({
      total_movies: movieRows[0].total,
      total_users: userRows[0].total,
      total_reviews: reviewRows[0].total,
      total_banned: bannedRows[0].total,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
