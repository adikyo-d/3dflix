import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { auth } from "@/auth";

// GET Reviews
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      movie_id,
      rating,
      content,
    } = body;

    const [movieRows]: any = await pool.execute(
      "SELECT id FROM movies WHERE id = ?",
      [movie_id]
    );

    if (movieRows.length === 0) {
      return NextResponse.json(
        { message: "Film tidak ditemukan" },
        { status: 404 }
      );
    }

    const movieDbId = movieRows[0].id;

    if (!rating || rating < 1 || rating > 5 || !content?.trim()) {
      return NextResponse.json(
        { message: "Rating dan isi review wajib diisi" },
        { status: 400 }
      );
    }

    await pool.execute(
      `
      INSERT INTO reviews
      (
        user_id,
        movie_id,
        rating,
        content,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        content = VALUES(content),
        created_at = VALUES(created_at)
      `,
      [
        Number(session.user.id),
        movieDbId,
        rating,
        content.trim(),
        new Date(),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Review berhasil ditambahkan",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal menyimpan review" },
      { status: 500 }
    );
  }
}
