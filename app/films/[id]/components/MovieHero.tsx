interface Movie {
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  release_date: string;
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#00e054]/10 via-transparent to-[#00e054]/5" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          {/* LEFT SIDE */}
          <div>
            <div className="mb-4">
              <span className="px-4 py-2 rounded-full border border-[#00e054] text-[#00e054] text-sm font-semibold">
                FEATURED MOVIE
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black uppercase text-white mb-3">
              {movie.title}
            </h1>

            <div className="flex gap-3 text-gray-300 mb-5">
              <span>{movie.release_date}</span>
              <span>•</span>
              <span>{movie.runtime || 0} min</span>
            </div>

            <p className="max-w-3xl text-gray-400 leading-relaxed mb-8">
              {movie.overview}
            </p>

            <div className="flex gap-4 flex-wrap mb-8">
              <button className="px-8 py-4 rounded-xl bg-[#00e054] text-black font-bold hover:bg-[#00ff66] transition">
                ▶ PLAY MOVIE
              </button>

              <button className="px-8 py-4 rounded-xl border border-[#00e054] text-[#00e054] hover:bg-[#00e054] hover:text-black transition">
                + WATCHLIST
              </button>
            </div>

            {/* METRICS + VISUAL */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/50 backdrop-blur-md border border-[#00e054]/30 rounded-2xl p-6">
                <h3 className="text-[#00e054] font-bold mb-4">
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

              <div className="bg-black/50 backdrop-blur-md border border-[#00e054]/30 rounded-2xl p-6">
                <h3 className="text-[#00e054] font-bold mb-4">
                  VISUAL EXPERIENCE
                </h3>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded border border-[#00e054]/30">
                    4K
                  </span>

                  <span className="px-3 py-1 rounded border border-[#00e054]/30">
                    HDR
                  </span>

                  <span className="px-3 py-1 rounded border border-[#00e054]/30">
                    ATMOS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - POSTER */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
              alt={movie.title}
              className="w-full max-w-[380px] rounded-3xl object-cover border border-[#00e054]/20"
              style={{
                boxShadow:
                  "0 0 40px rgba(0,224,84,0.15), 0 20px 60px rgba(0,0,0,0.6)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}