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
      "SELECT COUNT(*) as count FROM likes WHERE movie_id = ?",
      [id]
    );

    let liked = false;
    if (session?.user?.id) {
      const [userLike]: any = await pool.execute(
        "SELECT id FROM likes WHERE user_id = ? AND movie_id = ?",
        [session.user.id, id]
      );
      liked = userLike.length > 0;
    }

    return NextResponse.json({
      like_count: countRows[0].count,
      liked,
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
    await pool.execute(
      "INSERT IGNORE INTO likes (user_id, movie_id) VALUES (?, ?)",
      [session.user.id, id]
    );

    const [countRows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM likes WHERE movie_id = ?",
      [id]
    );

    return NextResponse.json({ liked: true, like_count: countRows[0].count });
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
      "DELETE FROM likes WHERE user_id = ? AND movie_id = ?",
      [session.user.id, id]
    );

    const [countRows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM likes WHERE movie_id = ?",
      [id]
    );

    return NextResponse.json({ liked: false, like_count: countRows[0].count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
