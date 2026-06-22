import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  try {
    const [countRows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM watchlists WHERE movie_id = ? AND watched = true",
      [id]
    );

    let inWatchlists = false;
    let watched = false;
    if (session?.user?.id) {
      const [userWatch]: any = await pool.execute(
        "SELECT id, watched FROM watchlists WHERE user_id = ? AND movie_id = ?",
        [session.user.id, id]
      );
      if (userWatch.length > 0) {
        inWatchlists = true;
        watched = !!userWatch[0].watched;
      }
    }

    return NextResponse.json({
      watch_count: countRows[0].count,
      in_watchlist: inWatchlists,
      watched,
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
    const { watched } = await request.json();

    await pool.execute(
      `INSERT INTO watchlists (user_id, movie_id, watched)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE watched = VALUES(watched)`,
      [session.user.id, id, watched ?? false]
    );

    return NextResponse.json({ success: true, in_watchlist: true, watched: !!watched });
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
      "DELETE FROM watchlists WHERE user_id = ? AND movie_id = ?",
      [session.user.id, id]
    );

    return NextResponse.json({ success: true, in_watchlist: false, watched: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
