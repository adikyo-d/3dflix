import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [reviews]: any = await pool.execute(
      `SELECT r.id, r.rating, r.review_text, r.created_at, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    const [avgRows]: any = await pool.execute(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE movie_id = ?",
      [id]
    );

    return NextResponse.json({
      reviews,
      avg_rating: avgRows[0].avg_rating ? Number(avgRows[0].avg_rating) : null,
      review_count: avgRows[0].count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { rating, review_text } = await request.json();

    if (!rating || rating < 0.5 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 0.5 - 5" },
        { status: 400 }
      );
    }

    await pool.execute(
      `INSERT INTO reviews (user_id, movie_id, rating, review_text)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), review_text = VALUES(review_text)`,
      [session.user.id, id, rating, review_text || null]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await pool.execute(
      "DELETE FROM reviews WHERE user_id = ? AND movie_id = ?",
      [session.user.id, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
