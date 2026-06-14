interface Movie {
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genres: {
    id: number;
    name: string;
  }[];
}

export default function MovieHero({
  movie,
}: {
  movie: any;
}) {
  return (
    <>
      {/* Backdrop */}
      <section
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </section>

      {/* Hero Content */}
      <section className="max-w-7xl mx-auto px-10 -mt-48 relative z-10">
        <div className="grid md:grid-cols-[320px_1fr] gap-10">

          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-[320px] rounded-xl shadow-2xl"
          />

          {/* Info */}
          <div className="pt-8">
            <h1 className="text-5xl font-bold">
              {movie.title}
            </h1>

            <p className="text-gray-400 mt-3">
              {movie.release_date}
            </p>

            <div className="mt-4 text-yellow-400 text-xl">
              ⭐ {movie.vote_average?.toFixed(1)} / 10
            </div>

            <div className="flex gap-3 flex-wrap mt-6">
              {movie.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-green-500 hover:bg-green-400 text-black px-5 py-3 rounded-lg font-semibold">
                Add to Watchlist
              </button>

              <button className="border border-white px-5 py-3 rounded-lg hover:bg-white hover:text-black">
                Rate Film
              </button>

              <button className="border border-white px-5 py-3 rounded-lg hover:bg-white hover:text-black">
                Write Review
              </button>
            </div>


              <p className="text-gray-300 leading-8">
                {movie.overview}
              </p>
            </div>
          </div>

      </section>
    </>
  );
}

