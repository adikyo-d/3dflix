import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-5 text-gray-400">
          Silakan login terlebih dahulu.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Settings
        </h1>

        <div className="bg-zinc-900 rounded-xl p-6 space-y-4">

          <div>
            <p className="text-gray-400 text-sm">
              Username
            </p>
            <p className="text-xl font-semibold">
              {session.user.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Email
            </p>
            <p className="text-xl font-semibold">
              {session.user.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Account Status
            </p>
            <p className="text-green-400 font-semibold">
              Logged In
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}