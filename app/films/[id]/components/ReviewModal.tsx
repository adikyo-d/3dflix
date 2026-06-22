"use client";

import { useState } from "react";

interface ReviewModalProps {
  onClose: () => void;
  movieId: number;
}

export default function ReviewModal({
  onClose,
  movieId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const handleSubmit = async () => {
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId,
        rating,
        content,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Review berhasil ditambahkan");
      onClose();
    } else {
      alert("❌ Gagal menambahkan review");
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi error");
  }
};

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
      <div className="w-full max-w-lg bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-8">

        <h2 className="text-3xl font-bold text-[#00e054] mb-6">
          ⭐ Rate & Review
        </h2>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full bg-black border border-[#00e054]/20 rounded-xl p-4 text-white mb-4"
        >
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
        </select>

        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
          className="w-full bg-black border border-[#00e054]/20 rounded-xl p-4 text-white mb-6"
        />

        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="
              px-6 py-3 rounded-xl
              bg-gray-700 text-white
              hover:bg-gray-600
              hover:scale-105
              transition-all duration-200
              cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-6 py-3 rounded-xl
              bg-[#00e054] text-black font-bold
              hover:bg-[#00ff66]
              hover:scale-105
              transition-all duration-200
              cursor-pointer
            "
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}