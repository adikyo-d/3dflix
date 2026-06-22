import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY;
}

export async function GET() {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch dan simpan genres
    const genreRes = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`
    );
    const genreData = await genreRes.json();
    const genres: { id: number; name: string }[] = genreData.genres || [];

    for (const genre of genres) {
      await pool.execute(
        `INSERT INTO genres (tmdb_id, name) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [genre.id, genre.name]
      );
    }

    const [genreRows]: any = await pool.execute("SELECT id, tmdb_id FROM genres");
    const genreMap = new Map<number, number>();
    for (const row of genreRows) {
      genreMap.set(row.tmdb_id, row.id);
    }

    let totalInserted = 0;

    for (let page = 1; page <= 50; page++) {
      const movieRes = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}`
      );
      const movieData = await movieRes.json();
      const movies = movieData.results || [];

      for (const movie of movies) {
        // Insert movie
        const [result]: any = await pool.execute(
          `INSERT INTO movies (tmdb_id, title, overview, poster_path, backdrop_path, vote_average, vote_count, release_date, popularity)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             title = VALUES(title),
             overview = VALUES(overview),
             poster_path = VALUES(poster_path),
             backdrop_path = VALUES(backdrop_path),
             vote_average = VALUES(vote_average),
             vote_count = VALUES(vote_count),
             release_date = VALUES(release_date),
             popularity = VALUES(popularity)`,
          [
            movie.id,
            movie.title || movie.original_title,
            movie.overview || null,
            movie.poster_path || null,
            movie.backdrop_path || null,
            movie.vote_average || 0,
            movie.vote_count || 0,
            movie.release_date || null,
            movie.popularity || 0,
          ]
        );

        // Ambil local movie id
        const [movieRows]: any = await pool.execute(
          "SELECT id FROM movies WHERE tmdb_id = ?",
          [movie.id]
        );
        const movieDbId = movieRows[0]?.id;

        // Insert movie_genres
        const genreIds: number[] = movie.genre_ids || [];
        for (const tmdbGenreId of genreIds) {
          const localGenreId = genreMap.get(tmdbGenreId);
          if (localGenreId) {
            await pool.execute(
              `INSERT IGNORE INTO movie_genres (movie_id, genre_id) VALUES (?, ?)`,
              [movieDbId, localGenreId]
            );
          }
        }

        totalInserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seed selesai! ${totalInserted} film dan ${genres.length} genre disimpan.`,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Gagal seed data", detail: error.message },
      { status: 500 }
    );
  }
}
