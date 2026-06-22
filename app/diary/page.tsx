import { auth } from "@/auth";

export default async function DiaryPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          📔 My Diary
        </h1>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <p className="text-gray-400">
            Halo, {session?.user?.name}
          </p>

          <p className="mt-4">
            Belum ada catatan film yang ditambahkan.
          </p>
        </div>
      </div>
    </main>
  );
}