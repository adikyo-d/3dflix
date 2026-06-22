"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileSettingsFormProps {
  initialUsername: string;
  initialEmail: string;
}

export default function ProfileSettingsForm({
  initialUsername,
  initialEmail,
}: ProfileSettingsFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [savedUsername, setSavedUsername] = useState(initialUsername);
  const [savedEmail, setSavedEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { update } = useSession();
  const router = useRouter();

  const hasChanges =
    username.trim() !== savedUsername ||
    email.trim().toLowerCase() !== savedEmail.toLowerCase();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      setUsername(data.user.name);
      setEmail(data.user.email);
      setSavedUsername(data.user.name);
      setSavedEmail(data.user.email);
      await update({
        name: data.user.name,
        email: data.user.email,
      });
      router.refresh();
      setMessage("Username dan email berhasil diperbarui.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Gagal memperbarui profil"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-[#2c3440] bg-[#14181c] p-6"
    >
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-bold text-[#9ab]"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          minLength={3}
          maxLength={50}
          required
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-xl border border-[#2c3440] bg-black px-4 py-3 text-white outline-none transition focus:border-[#00e054]"
        />
        <p className="mt-2 text-xs text-gray-500">
          Username baru digunakan saat login berikutnya.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-bold text-[#9ab]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={100}
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-[#2c3440] bg-black px-4 py-3 text-white outline-none transition focus:border-[#00e054]"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-red-400">
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="rounded-xl bg-[#00e054]/10 p-3 text-[#00e054]"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !hasChanges}
        className="rounded-xl bg-[#00e054] px-6 py-3 font-bold text-black transition hover:bg-[#00c94b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
