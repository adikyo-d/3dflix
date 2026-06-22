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
      movieId,
      rating,
      content,
    } = body;

    const [movieRows]: any = await pool.execute(
      "SELECT id FROM movies WHERE tmdb_id = ?",
      [movieId]
    );

    if (movieRows.length === 0) {
      return NextResponse.json(
        { message: "Film tidak ditemukan" },
        { status: 404 }
      );
    }

    const movieDbId = movieRows[0].id;

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
      `,
      [
        Number(session.user.id),
        movieDbId,
        rating,
        content,
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