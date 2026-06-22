import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

// GET Reviews
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movie_id");

    if (!movieId) {
      return NextResponse.json(
        { message: "movie_id wajib diisi" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM reviews
      WHERE movie_id = ?
      ORDER BY created_at DESC
      `,
      [movieId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil review" },
      { status: 500 }
    );
  }
}

// POST Review
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      movie_id,
      rating,
      content,
    } = body;

    console.log({
      user_id,
      movie_id,
      rating,
      content,
    });

    await pool.execute(
      `
      INSERT INTO reviews
      (
        user_id,
        movie_id,
        rating,
        content
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        user_id,
        movie_id,
        rating,
        content,
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