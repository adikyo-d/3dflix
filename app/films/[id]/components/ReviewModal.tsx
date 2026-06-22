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
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review_text: reviewText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        alert(data.error || "Gagal mengirim review");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
      <div className="w-full max-w-lg bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-[#00e054] mb-6">
          Rate & Review
        </h2>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full bg-black border border-[#00e054]/20 rounded-xl p-4 text-white mb-4"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <textarea
          rows={5}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full bg-black border border-[#00e054]/20 rounded-xl p-4 text-white mb-6"
        />

        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gray-700 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#00e054] text-black font-bold disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
