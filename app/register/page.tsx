"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      setPesan("Sukses mendaftar! Mengalihkan ke login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setPesan(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form onSubmit={handleRegister} className="bg-[#1c2228] p-8 rounded-lg border border-[#2c3440] w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Create Account</h2>
        {pesan && <p className="text-[#00e054] text-sm text-center">{pesan}</p>}
        
        <input type="text" placeholder="Username Baru" value={username} onChange={(e) => setUsername(e.target.value)} className="p-3 bg-[#14181c] text-white border border-[#2c3440] rounded focus:border-[#00e054] outline-none" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 bg-[#14181c] text-white border border-[#2c3440] rounded focus:border-[#00e054] outline-none" required />
        <input type="password" placeholder="Password Baru" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 bg-[#14181c] text-white border border-[#2c3440] rounded focus:border-[#00e054] outline-none" required />
        
        <button type="submit" className="bg-[#00e054] text-black font-bold p-3 rounded hover:bg-[#00c04b] transition mt-2">DAFTAR</button>
        <Link href="/login" className="text-[#9ab] text-xs text-center hover:text-white mt-2">Sudah punya akun? Sign In</Link>
      </form>
    </div>
  );
}