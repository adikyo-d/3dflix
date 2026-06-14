interface CastProps {
  cast: any[];
}

export default function Cast({ cast }: CastProps) {
  if (!cast?.length) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-10 mt-16">
      <h2 className="text-2xl font-bold mb-6">
        Cast
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cast.slice(0, 8).map((actor) => (
          <div
            key={actor.id}
            className="bg-zinc-900 p-4 rounded-xl text-center"
          >
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={actor.name}
              className="w-full h-60 object-cover rounded-lg mb-3"
            />

            <p className="font-semibold">
              {actor.name}
            </p>

            <p className="text-gray-400 text-sm">
              {actor.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}