"use client";

import { useState } from "react";

interface ReviewModalProps {
  movieId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  movieId,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validasi sederhana agar user tidak mengirim konten kosong
    if (!content.trim()) {
      alert("❌ Konten review tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId, // ← Diubah dari movieId menjadi movie_id agar sinkron dengan database
          rating,
          content,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Review berhasil ditambahkan");
        onSuccess();
      } else {
        alert(data.message || "❌ Gagal menambahkan review");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Terjadi error pada sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-8 shadow-2xl shadow-black/80">
        <h2 className="text-3xl font-bold text-[#00e054] mb-6">
          ⭐ Rate & Review
        </h2>

        <label className="block text-xs font-bold text-[#9ab] mb-2 uppercase tracking-wider">
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full bg-black border border-[#2c3440] focus:border-[#00e054]/50 rounded-xl p-4 text-white mb-4 focus:outline-none transition-colors"
        >
          <option value={1}>⭐ (1 / 5)</option>
          <option value={2}>⭐⭐ (2 / 5)</option>
          <option value={3}>⭐⭐⭐ (3 / 5)</option>
          <option value={4}>⭐⭐⭐⭐ (4 / 5)</option>
          <option value={5}>⭐⭐⭐⭐⭐ (5 / 5)</option>
        </select>

        <label className="block text-xs font-bold text-[#9ab] mb-2 uppercase tracking-wider">
          Ulasan Anda
        </label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis ulasan menarikmu tentang film ini di sini..."
          className="w-full bg-black border border-[#2c3440] focus:border-[#00e054]/50 rounded-xl p-4 text-white mb-6 focus:outline-none transition-colors resize-none"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#2c3440] hover:bg-[#3f4b5a] text-white text-sm font-bold transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#00e054] hover:bg-[#00ff66] text-black text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-[#00e054]/20"
          >
            {loading ? "Mengirim..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}