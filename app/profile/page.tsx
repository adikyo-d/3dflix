import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-10">

      <div className="max-w-xl mx-auto bg-[#1c1c1c] rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        {session?.user ? (
          <div className="space-y-4">

            <div>
              <p className="text-gray-400">
                Username
              </p>
              <p className="text-xl">
                {session.user.name}
              </p>
            </div>


            <div>
              <p className="text-gray-400">
                Email
              </p>
              <p className="text-xl">
                {session.user.email}
              </p>
            </div>


            <div>
              <p className="text-gray-400">
                User ID
              </p>
              <p className="text-xl">
                {session.user.id}
              </p>
            </div>


          </div>

        ) : (

          <p>
            Kamu belum login
          </p>

        )}

      </div>

    </main>
  );
}