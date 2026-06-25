import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth-utils";
import pool from "@/app/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const fields: string[] = [];
    const values: any[] = [];

    const allowed = [
      "title",
      "overview",
      "poster_path",
      "backdrop_path",
      "vote_average",
      "vote_count",
      "release_date",
      "popularity",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(body[key]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada field yang diupdate" },
        { status: 400 },
      );
    }

    values.push(id);
    await pool.execute(
      `UPDATE movies SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Validasi akses admin
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  try {
  
    await pool.execute("DELETE FROM movie_genres WHERE movie_id = ?", [id]);

    
    await pool.execute("DELETE FROM likes WHERE movie_id = ?", [id]);

    
    await pool.execute("DELETE FROM reviews WHERE movie_id = ?", [id]);


    await pool.execute("DELETE FROM watchlists WHERE movie_id = ?", [id]);

   
    await pool.execute("DELETE FROM movies WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {

    console.error("DATABASE DELETE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
