import { auth } from "@/auth";
import pool from "@/app/lib/db";
import { redirect } from "next/navigation";

export default async function DiaryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [watchedMovies]: any = await pool.execute(
    `SELECT w.id, w.created_at, m.title, m.poster_path, m.tmdb_id
     FROM watchlists w
     JOIN movies m ON w.movie_id = m.id
     WHERE w.user_id = ? AND w.watched = true
     ORDER BY w.created_at DESC`,
    [session.user.id]
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          📔 My Diary
        </h1>

        {watchedMovies.length === 0 ? (
          <div className="bg-zinc-900 p-6 rounded-xl">
            Belum ada film yang ditandai sudah ditonton.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {watchedMovies.map((movie: any) => (
              <a key={movie.id} href={`/films/${movie.tmdb_id}`} className="group">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="aspect-[2/3] w-full rounded-xl object-cover transition group-hover:scale-105"
                />
                <h2 className="mt-3 font-semibold group-hover:text-[#00e054]">
                  {movie.title}
                </h2>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
