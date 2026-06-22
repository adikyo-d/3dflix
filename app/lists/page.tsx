import pool from "@/app/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
 
export default async function ListPage() {
     const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const [watchlists]: any = await pool.execute(`
  SELECT
  w.id,
  w.user_id,
  w.movie_id,
  w.created_at,
  m.title,
  m.poster_path,
  m.tmdb_id
FROM watchlists w
JOIN movies m
  ON w.movie_id = m.tmdb_id
ORDER BY w.created_at DESC
`);

console.log("WATCHLIST:", watchlists);

  return (
    <main className="min-h-screen bg-[#14181c] text-white p-10">
        <h1 className="text-4xl font-bold text-[#00e054] mb-8">
          My Watchlists
        </h1>

      {watchlists.length === 0 ? (
        <p className="text-gray-400">
          Belum ada film di watchlists.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {watchlists.map((movie: any) => (
    <a
      key={movie.id}
      href={`/films/${movie.tmdb_id}`}
      className="group"
    >
      <div className="overflow-hidden rounded-2xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="
            w-full
            h-[320px]
            object-cover
            transition
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      <h3
        className="
          text-white
          mt-3
          font-semibold
          line-clamp-2
          group-hover:text-[#00e054]
          transition
        "
      >
        {movie.title}
      </h3>
    </a>
  ))}
</div>
      )}
    </main>
  );
}