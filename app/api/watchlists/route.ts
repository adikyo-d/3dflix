import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
    }

    const { movie_id, watched = false } = await req.json();

    await pool.execute(
      `
      INSERT INTO watchlists
      (user_id, movie_id, watched)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE watched = VALUES(watched)
      `,
      [session.user.id, movie_id, Boolean(watched)]
    );

    return NextResponse.json({
      success: true,
      message: "Berhasil ditambahkan ke watchlists",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Gagal menambahkan watchlist",
      },
      { status: 500 }
    );
  }
}
