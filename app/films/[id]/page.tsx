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
  const [movie, credits, reviews, similarMovies] = await Promise.all([
    getMovieDetail(id),
    getMovieCredits(id),
    getMovieReviews(id),
    getSimilarMovies(id)
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