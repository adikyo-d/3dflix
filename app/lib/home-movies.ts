import "server-only";

import type { RowDataPacket } from "mysql2";
import pool from "@/app/lib/db";

export interface HomeMovie {
  id: number;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseYear: number | null;
  rating: number;
  popularity: number;
  likeCount: number;
  watchCount: number;
  reviewCount: number;
  genres: string[];
}

interface HomeMovieRow extends RowDataPacket {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  release_year: number | null;
  rating: string | number | null;
  popularity: string | number;
  like_count: number;
  watch_count: number;
  review_count: number;
  genres: string | null;
}

const SELECT_MOVIE_STATS = `
  SELECT
    m.id,
    m.tmdb_id,
    m.title,
    m.overview,
    m.poster_path,
    YEAR(m.release_date) AS release_year,
    m.popularity,
    COALESCE(AVG(r.rating), m.vote_average, 0) AS rating,
    COUNT(DISTINCT l.id) AS like_count,
    COUNT(DISTINCT CASE WHEN w.watched = true THEN w.id END) AS watch_count,
    COUNT(DISTINCT r.id) AS review_count,
    GROUP_CONCAT(DISTINCT g.name ORDER BY g.name SEPARATOR '||') AS genres
  FROM movies m
  LEFT JOIN likes l ON l.movie_id = m.id
  LEFT JOIN watchlists w ON w.movie_id = m.id
  LEFT JOIN reviews r ON r.movie_id = m.id
  LEFT JOIN movie_genres mg ON mg.movie_id = m.id
  LEFT JOIN genres g ON g.id = mg.genre_id
`;

function mapMovie(row: HomeMovieRow): HomeMovie {
  return {
    id: row.id,
    tmdbId: row.tmdb_id,
    title: row.title,
    overview: row.overview ?? "Sinopsis belum tersedia.",
    posterPath: row.poster_path,
    releaseYear: row.release_year,
    rating: Number(row.rating) || 0,
    popularity: Number(row.popularity) || 0,
    likeCount: Number(row.like_count) || 0,
    watchCount: Number(row.watch_count) || 0,
    reviewCount: Number(row.review_count) || 0,
    genres: row.genres ? row.genres.split("||") : [],
  };
}

export async function getHomeMovieSections() {
  const [trendingResult, watchedResult, ratedResult] = await Promise.all([
    pool.query<HomeMovieRow[]>(
      `${SELECT_MOVIE_STATS}
       GROUP BY m.id
       ORDER BY m.popularity DESC, m.vote_count DESC
       LIMIT 10`
    ),
    pool.query<HomeMovieRow[]>(
      `${SELECT_MOVIE_STATS}
       GROUP BY m.id
       ORDER BY watch_count DESC, m.popularity DESC
       LIMIT 10`
    ),
    pool.query<HomeMovieRow[]>(
      `${SELECT_MOVIE_STATS}
       GROUP BY m.id
       ORDER BY rating DESC, review_count DESC, m.vote_count DESC
       LIMIT 10`
    ),
  ]);

  return {
    trending: trendingResult[0].map(mapMovie),
    mostWatched: watchedResult[0].map(mapMovie),
    topRated: ratedResult[0].map(mapMovie),
  };
}
