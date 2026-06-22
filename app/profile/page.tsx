import { auth } from "@/auth";
import pool from "@/app/lib/db";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
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
    const [rows]: any = await pool.query(
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
              Total Reviews
            </p>

            <p className="text-2xl font-bold">
              {reviewCount}
            </p>
          </div>

          <div className="bg-[#2a2a2a] p-5 rounded-lg">
            <p className="text-gray-400 text-sm">
              Account Status
            </p>

            <p className="text-2xl font-bold text-green-500">
              Active
            </p>
          </div>

        </div>

        <div className="space-y-3">

          <Link href="/reviews">
            <div className="bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#333] cursor-pointer">
              🎬 My Reviews
            </div>
          </Link>

          <Link href="/likes">
            <div className="bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#333] cursor-pointer">
              ❤️ Favorite Movies
            </div>
          </Link>

          <Link href="/diary">
            <div className="bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#333] cursor-pointer">
              📔 Diary
            </div>
          </Link>

          <Link href="/settings">
            <div className="bg-[#2a2a2a] p-4 rounded-lg hover:bg-[#333] cursor-pointer">
              ⚙️ Settings
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}