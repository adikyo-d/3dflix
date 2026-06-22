import Link from "next/link";

interface SimilarMoviesProps {
  movies: any[];
}

export default function SimilarMovies({
  movies,
}: SimilarMoviesProps) {
  if (!movies?.length) {
    return null;
  }

  return (
    <section id="similar">
      <h2 className="text-2xl font-bold mb-6">
        Similar Movies
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {movies.slice(0, 10).map((movie) => (
          <Link
            key={movie.id}
            href={`/films/${movie.id}`}
          >
            {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-72 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-72 bg-zinc-800 rounded-lg flex items-center justify-center">
              No Poster
            </div>
          )}

            <p className="mt-2 font-medium">
              {movie.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}