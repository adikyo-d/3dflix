"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ReviewsProps {
  movieId: number;
}

interface Review {
  id: number;
  username: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function Reviews({ movieId }: ReviewsProps) {
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const { data: session } = useSession();

  const fetchReviews = () => {
    fetch(`/api/movies/${movieId}/reviews`)
      .then((r) => r.json())
      .then((data) => setReviewList(data.reviews || []))
      .catch(() => {});
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-8 py-20">
      <h2 className="text-4xl font-black text-white mb-8">Reviews</h2>

      <div className="grid gap-6">
        {reviewList.length > 0 ? (
          reviewList.map((review) => (
            <div
              key={review.id}
              className="bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {review.username}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {review.created_at?.slice(0, 10)}
                  </p>
                </div>
                <div className="text-yellow-400 text-lg">
                  {"★".repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {review.review_text || "(tanpa teks)"}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-[#14181c] rounded-3xl p-10 text-center">
            <p className="text-gray-400">No reviews available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
