interface MovieDetailsProps {
  movie: any;
}

export default function MovieDetails({
  movie,
}: MovieDetailsProps) {
  console.log(movie);
  console.log(movie.overview);
  return (
    <section className="max-w-7xl mx-auto px-10 mt-16">
      <h2 className="text-2xl font-bold mb-4">
        Synopsis
      </h2>

      <h1 className="text-red-500">
        {movie.title}
      </h1>

      <p>
        {movie.overview || "Sinopsis tidak tersedia"}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-8 text-gray-300">

        <div>
          <p className="text-gray-500">Release Date</p>
          <p>{movie.release_date}</p>
        </div>

        <div>
          <p className="text-gray-500">Runtime</p>
          <p>{movie.runtime} Minutes</p>
        </div>

        <div>
          <p className="text-gray-500">Language</p>
          <p> 
            {movie.spoken_languages
              ?.map((lang: any) => lang.english_name)
              .join(", ")}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p>{movie.status}</p>
        </div>

      </div>
    </section>
  );
}