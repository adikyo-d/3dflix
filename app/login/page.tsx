"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, 
    });

    setLoading(false);

    if (result?.error) {
      setError("Username atau password salah!");
    } else {
      router.push("/");
      router.refresh(); // Refresh supaya Navbar langsung update session
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form onSubmit={handleLogin} className="bg-[#1c2228] p-8 rounded-lg border border-[#2c3440] w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Sign In</h2>
        
        {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
        
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 bg-[#14181c] text-white border border-[#2c3440] rounded focus:border-[#00e054] outline-none"
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 bg-[#14181c] text-white border border-[#2c3440] rounded focus:border-[#00e054] outline-none"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-[#00e054] text-black font-bold p-3 rounded mt-2 hover:bg-[#00c04b] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "MEMPROSES..." : "MASUK"}
        </button>
      </form>
    </div>
  );
}