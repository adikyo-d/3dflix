import { auth } from "@/auth";
import pool from "@/app/lib/db";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "./ProfileSettingsForm";
import type { RowDataPacket } from "mysql2";

interface SettingsUserRow extends RowDataPacket {
  username: string;
  email: string;
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [rows] = await pool.execute<SettingsUserRow[]>(
    "SELECT username, email FROM users WHERE id = ? LIMIT 1",
    [session.user.id]
  );
  const user = rows[0];

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Profile Settings
        </h1>

        <p className="mb-8 text-gray-400">
          Perbarui identitas akun yang tampil pada profil dan ulasanmu.
        </p>

        <ProfileSettingsForm
          initialUsername={user.username}
          initialEmail={user.email}
        />
      </div>
    </main>
  );
}
