import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [movies]: any = await pool.execute(
      `SELECT m.*,
        (SELECT COUNT(*) FROM likes l WHERE l.movie_id = m.id) as like_count,
        (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) as review_count,
        (SELECT AVG(r.rating) FROM reviews r WHERE r.movie_id = m.id) as avg_rating,
        (SELECT COUNT(*) FROM watchlists w WHERE w.movie_id = m.id AND w.watched = true) as watch_count
       FROM movies m
       WHERE m.id = ?`,
      [id]
    );

    if (movies.length === 0) {
      return NextResponse.json({ error: "Film tidak ditemukan" }, { status: 404 });
    }

    const movie = movies[0];

    // Fetch genres
    const [genres]: any = await pool.execute(
      `SELECT g.id, g.tmdb_id, g.name
       FROM movie_genres mg
       JOIN genres g ON mg.genre_id = g.id
       WHERE mg.movie_id = ?`,
      [movie.id]
    );

    // Fetch reviews
    const [reviews]: any = await pool.execute(
      `SELECT r.*, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = ?
       ORDER BY r.created_at DESC`,
      [movie.id]
    );

    return NextResponse.json({
      ...movie,
      vote_average: Number(movie.vote_average),
      popularity: Number(movie.popularity),
      like_count: movie.like_count,
      review_count: movie.review_count,
      avg_rating: movie.avg_rating ? Number(movie.avg_rating) : null,
      watch_count: movie.watch_count,
      genres,
      reviews,
    });
  } catch (error: any) {
    console.error("Movie detail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail film", detail: error.message },
      { status: 500 }
    );
  }
}
