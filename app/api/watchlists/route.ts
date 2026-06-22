import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, movie_id } = body;

    await pool.execute(
      `
      INSERT INTO watchlists
      (user_id, movie_id)
      VALUES (?, ?)
      `,
      [user_id, movie_id]
    );

    return NextResponse.json({
      success: true,
      message: "Berhasil ditambahkan ke watchlists",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}