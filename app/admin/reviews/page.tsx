"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  username: string;
  movie_title: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const res = await fetch("/api/admin/reviews");
    if (res.ok) setReviews(await res.json());
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus review ini secara permanen?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      alert("Gagal menghapus review");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Kelola Reviews</h1>

      <div className="grid gap-4">
        {reviews.length === 0 && (
          <p className="text-[#9ab]">Belum ada review.</p>
        )}
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#14181c] border border-[#2c3440] rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-bold">
                    {review.username}
                  </span>
                  <span className="text-[#9ab] text-sm">di</span>
                  <span className="text-[#00e054] font-semibold text-sm">
                    {review.movie_title}
                  </span>
                  <span className="text-yellow-400 text-sm">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-[#9ab] text-sm mb-2">
                  {review.review_text || "(tanpa teks)"}
                </p>
                <p className="text-xs text-[#678]">
                  {review.created_at?.slice(0, 10)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="px-3 py-1 text-xs font-bold rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
