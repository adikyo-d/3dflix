import pool from "@/app/lib/db";
import MovieHero from "./components/MovieHero";
import MovieDetails from "./components/MovieDetails";
import Cast from "./components/Cast";
import Reviews from "./components/Reviews";
import SimilarMovies from "./components/SimilarMovies";
import BackButton from "./components/BackButton";
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
      <BackButton />
      <MovieHero movie={movie} />
      
      <div className="
      sticky top-0
      z-50
      bg-black/90
      backdrop-blur-md
      border-b border-cyan-500/20
     ">
       <div className="max-w-7xl mx-auto px-8 py-4 flex gap-8 text-cyan-400 font-semibold uppercase">
        <a href="#overview">Overview</a>
        <a href="#cast">Cast</a>
        <a href="#reviews">Reviews</a>
        <a href="#similar">Related</a>
       </div>
      </div>

      <MovieDetails movie={movie} />
      <Cast cast={credits.cast} />
      <Reviews reviews={reviews.results} />
      <SimilarMovies movies={similarMovies.results} />
    </main>
  );
}