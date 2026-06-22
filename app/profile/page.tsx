import { auth } from "@/auth";
import pool from "@/app/lib/db";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Kamu belum login
        </h1>
      </main>
    );
  }

  let reviewCount = 0;

  try {
    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) AS total FROM reviews WHERE user_id = ?",
      [session.user.id]
    );

    reviewCount = rows[0]?.total || 0;
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-10">
      <div className="max-w-3xl mx-auto bg-[#1c1c1c] rounded-xl p-8 shadow-lg">

        <div className="flex items-center gap-5 mb-8">

          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold">
            {session.user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {session.user.name}
            </h1>

            <p className="text-gray-400">
              {session.user.email}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">

          <div className="bg-[#2a2a2a] p-5 rounded-lg">
            <p className="text-gray-400 text-sm">
              User ID
            </p>

            <p className="text-2xl font-bold">
              {session.user.id}
            </p>
          </div>

          <div className="bg-[#2a2a2a] p-5 rounded-lg">
            <p className="text-gray-400 text-sm">
              Total Reviews
            </p>

            <p className="text-2xl font-bold">
              {reviewCount}
            </p>
          </div>

        </div>

        <div className="space-y-3">

          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            🎬 My Reviews
          </div>

          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            ⭐ Favorite Movies
          </div>

          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            ⚙️ Settings
          </div>

        </div>

      </div>
    </main>
  );
}