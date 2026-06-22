import pool from "@/app/lib/db";
import MovieHero from "./components/MovieHero";
import MovieDetails from "./components/MovieDetails";
import Cast from "./components/Cast";
import Reviews from "./components/Reviews";
import SimilarMovies from "./components/SimilarMovies";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieReviews,
  getSimilarMovies,
} from "@/app/lib/tmdb";

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rows]: any = await pool.execute(
    "SELECT tmdb_id FROM movies WHERE tmdb_id  = ?",
    [id]
  );

  if (!rows.length) {
    throw new Error("Film tidak ditemukan");
  }

  const tmdbId = rows[0].tmdb_id;

  const [movie, credits, reviews, similarMovies] = await Promise.all([
    getMovieDetail(tmdbId),
    getMovieCredits(tmdbId),
    getMovieReviews(tmdbId),
    getSimilarMovies(tmdbId),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <MovieHero movie={movie} />
      <MovieDetails movie={movie} />
      <Cast cast={credits.cast} />
      <Reviews reviews={reviews.results} />
      <SimilarMovies movies={similarMovies.results} />
    </main>
  );
}