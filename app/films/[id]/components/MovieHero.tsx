interface Movie {
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  release_date: string;
  genres: {
    id: number;
    name: string;
  }[];
}

export default function MovieHero({
  movie,
}: {
  movie: Movie;
}) {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/80" />

      {/* GLOW */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-green-500/10" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-center">

          {/* KIRI */}
          <div>
            <div className="mb-4">
              <span className="px-4 py-2 rounded-full border border-cyan-400 text-cyan-400 text-sm">
                FEATURED MOVIE
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black uppercase text-white mb-2">
              {movie.title}
            </h1>

           <div className="flex gap-3 text-gray-300 mb-4">
              <span>{movie.release_date}</span>
              <span>•</span>
              <span>{movie.runtime || 0} min</span>
            </div>

            <p className="max-w-3xl text-gray-400 leading-relaxed mb-5">
              {movie.overview}
            </p>

            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition">
                ▶ PLAY MOVIE
              </button>

              <button className="px-8 py-4 rounded-xl border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition">
                + WATCHLIST
              </button>
            </div>
          </div>

          {/* KANAN */}
          <div className="space-y-4">
           <div className="overflow-hidden rounded-3xl border border-cyan-500/30 shadow-2xl">
              <img
                src={movie.poster_path ?  `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/no-image.png"}
                alt={movie.title}
                className="w-full h-[520px] object-cover"
              />
            </div>

            <div className="bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5">
              <h3 className="text-cyan-400 font-bold mb-4">
                METRICS
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {movie.vote_average?.toFixed(1)}
                  </div>

                  <div className="text-sm text-gray-500">
                    Rating
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-white">
                    {movie.vote_count}
                  </div>

                  <div className="text-sm text-gray-500">
                    Votes
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-green-400 mb-4">
                VISUAL EXPERIENCE
              </h3>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded border border-green-500/30">
                  4K
                </span>

                <span className="px-3 py-1 rounded border border-green-500/30">
                  HDR
                </span>

                <span className="px-3 py-1 rounded border border-green-500/30">
                  ATMOS
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}