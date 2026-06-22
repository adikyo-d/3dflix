interface MovieDetailsProps {
  movie: any;
}

export default function MovieDetails({
  movie,
}: MovieDetailsProps) {
  return (
    <section
      id="overview"
      className="max-w-7xl mx-auto px-6 lg:px-10 py-16"
    >
      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

        {/* SYNOPSIS */}
        <div className="bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-[#00e054] mb-6">
            Synopsis
          </h2>

          <p className="text-gray-300 leading-8 text-lg">
            {movie.overview || "Synopsis belum tersedia."}
          </p>
        </div>

        {/* INFO PANEL */}
        <div className="bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-[#00e054] mb-6">
            Information
          </h2>

          <div className="space-y-6">

            <div>
              <p className="text-gray-500 text-sm uppercase">
                Release Date
              </p>

              <p className="text-white font-semibold">
                {movie.release_date}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm uppercase">
                Runtime
              </p>

              <p className="text-white font-semibold">
                {movie.runtime} Minutes
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm uppercase">
                Language
              </p>

              <p className="text-white font-semibold">
                {movie.spoken_languages
                  ?.map((lang: any) => lang.english_name)
                  .join(", ")}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm uppercase">
                Status
              </p>

              <p className="text-green-400 font-semibold">
                {movie.status}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}