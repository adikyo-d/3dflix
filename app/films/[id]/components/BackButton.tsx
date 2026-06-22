"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        fixed top-6 left-6 z-50
        flex items-center gap-2
        px-5 py-3
        rounded-full
        bg-gradient-to-r from-green-500 to-emerald-400
        text-black font-semibold
        shadow-[0_0_25px_rgba(34,197,94,0.5)]
        hover:scale-105
        transition-all duration-300
      "
    >
      ← Back
    </button>
  );
}