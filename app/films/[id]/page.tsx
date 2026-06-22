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
  getSimilarMovies,
} from "@/app/lib/tmdb";

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rows]: any = await pool.execute(
    "SELECT id, tmdb_id FROM movies WHERE tmdb_id = ?",
    [id]
  );

  if (!rows.length) {
    throw new Error("Film tidak ditemukan");
  }

  const tmdbId = rows[0].tmdb_id;

  const [movie, credits, similarMovies] = await Promise.all([
    getMovieDetail(tmdbId),
    getMovieCredits(tmdbId),
    getSimilarMovies(tmdbId),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <BackButton />
      <MovieHero movie={movie} movieId={rows[0].id} />
      
      <div className="
      sticky top-0
      z-50
      bg-[#14181c]/95
      backdrop-blur-md
      border-b 
     "
      style={{
         borderColor: "rgba(0,224,84,0.2)"
     }}
     >
       <div className="max-w-7xl mx-auto px-8 py-4 flex gap-8 font-semibold uppercase">
        <a href="#overview" className="text-[#00e054] hover:text-white transition">Overview</a>
        <a href="#cast" className="text-[#00e054] hover:text-white transition">Cast</a>
        <a href="#reviews" className="text-[#00e054] hover:text-white transition">Reviews</a>
        <a href="#similar" className="text-[#00e054] hover:text-white transition">Similar Movies</a>
       </div>
      </div>

      <MovieDetails movie={movie} />
      <Cast cast={credits.cast} />
      <Reviews
        movieId={rows[0].id}
      />
      <SimilarMovies movies={similarMovies.results} />
    </main>
  );
}