import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = 20;
  const offset = (page - 1) * limit;
  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const sort = searchParams.get("sort") || "popularity.desc";

  try {
    const conditions: string[] = [];
    const params: any[] = [];

    if (query) {
      conditions.push("m.title LIKE ?");
      params.push(`%${query}%`);
    }

    if (genre) {
      const genreIds = genre.split(",");
      const placeholders = genreIds.map(() => "?").join(",");

      conditions.push(`m.id IN (
      SELECT movie_id FROM movie_genres mg JOIN genres g ON mg.genre_id = g.id WHERE g.tmdb_id IN (${placeholders})
    )
  `);
      params.push(...genreIds.map(Number));
    }
    
    if (year) {
      conditions.push("YEAR(m.release_date) = ?");
      params.push(Number(year));
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Sort mapping
    const sortMap: Record<string, string> = {
      "popularity.desc": "m.popularity DESC",
      "vote_average.desc": "m.vote_average DESC",
      "vote_count.desc": "m.vote_count DESC",
      "primary_release_date.desc": "m.release_date DESC",
    };
    const orderBy = sortMap[sort] || "m.popularity DESC";

    // Count total
    const [countRows]: any = await pool.execute(
      `SELECT COUNT(*) as total FROM movies m ${whereClause}`,
      params
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch movies with stats
    const [movies]: any = await pool.execute(
      `SELECT m.*,
        (SELECT COUNT(*) FROM likes l WHERE l.movie_id = m.id) as like_count,
        (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) as review_count,
        (SELECT AVG(r.rating) FROM reviews r WHERE r.movie_id = m.id) as avg_rating,
        (SELECT COUNT(*) FROM watchlist w WHERE w.movie_id = m.id AND w.watched = true) as watch_count
       FROM movies m
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Fetch genres for each movie
    const movieIds = movies.map((m: any) => m.id);
    let genresByMovie: Record<number, { id: number; tmdb_id: number; name: string }[]> = {};

    if (movieIds.length > 0) {
      const placeholders = movieIds.map(() => "?").join(",");
      const [genreRows]: any = await pool.execute(
        `SELECT mg.movie_id, g.id, g.tmdb_id, g.name
         FROM movie_genres mg
         JOIN genres g ON mg.genre_id = g.id
         WHERE mg.movie_id IN (${placeholders})`,
        movieIds
      );

      for (const row of genreRows) {
        if (!genresByMovie[row.movie_id]) genresByMovie[row.movie_id] = [];
        genresByMovie[row.movie_id].push({
          id: row.id,
          tmdb_id: row.tmdb_id,
          name: row.name,
        });
      }
    }

    const results = movies.map((m: any) => ({
      id: m.id,
      tmdb_id: m.tmdb_id,
      title: m.title,
      overview: m.overview,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      vote_average: Number(m.vote_average),
      vote_count: m.vote_count,
      release_date: m.release_date,
      popularity: Number(m.popularity),
      like_count: m.like_count,
      review_count: m.review_count,
      avg_rating: m.avg_rating ? Number(m.avg_rating) : null,
      watch_count: m.watch_count,
      genres: genresByMovie[m.id] || [],
    }));

    return NextResponse.json({
      results,
      page,
      total_pages: totalPages,
      total_results: total,
    });
  } catch (error: any) {
    console.error("Movies API error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data film", detail: error.message },
      { status: 500 }
    );
  }
}
