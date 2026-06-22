import { auth } from "@/auth";
import pool from "@/app/lib/db";

export default async function ReviewsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Harus login terlebih dahulu</h1>
      </main>
    );
  }

  let reviews: any[] = [];

  try {
    const [rows]: any = await pool.execute(
      `SELECT r.id, r.rating, r.content AS review_text, r.created_at,
              m.title AS movie_title, m.tmdb_id
       FROM reviews r
       JOIN movies m ON r.movie_id = m.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [session.user.id]
    );

    reviews = rows;
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          🎬 My Reviews
        </h1>

        {reviews.length === 0 ? (
          <div className="bg-zinc-900 p-6 rounded-xl">
            Kamu belum memiliki review.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-zinc-900 p-6 rounded-xl"
              >
                <a
                  href={`/films/${review.tmdb_id}`}
                  className="text-xl font-bold text-[#00e054] hover:underline"
                >
                  {review.movie_title}
                </a>

                <p className="font-bold">
                  ⭐ {review.rating}/5
                </p>

                <p className="mt-2 text-gray-300">
                  {review.review_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
