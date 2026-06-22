"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface ReviewsProps {
  reviews: any[];
  movieId: number;
}

export default function Reviews({
  reviews,
  movieId,
}: ReviewsProps) {
  
  console.log("movieId =", movieId);
  console.log({reviews, movieId,});
  const [reviewList, setReviewList] = useState(reviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();


  const handleSubmit = async () => {
    if (!name || !content) {
      alert("Lengkapi review terlebih dahulu");
      return;
    }

    try {
      setLoading(true);

      console.log({
        user_id: session?.user?.id,
        movie_id: movieId,
        rating,
       content,
      });

      const res = await  fetch(`/api/reviews/${movieId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session?.user?.id,
          movie_id: movieId,
          rating,
          content,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const newReview = {
          id: Date.now(),
          user_id: name,
          rating,
          content,
          created_at: new Date().toISOString(),
        };

        setReviewList([newReview, ...reviewList]);

        setName("");
        setContent("");
        setRating(5);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reviews"
      className="max-w-7xl mx-auto px-8 py-20"
    >
      <h2 className="text-4xl font-black text-white mb-8">
        Reviews
      </h2>

      {/* LIST REVIEW */}
      <div className="grid gap-6">
        {reviewList?.length > 0 ? (
          reviewList.map((review: any) => (
            <div
              key={review.id}
              className="bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {review.user_id || review.author}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {review.created_at?.slice(0, 10)}
                  </p>
                </div>

                <div className="text-[#00e054] text-lg">
                  {"⭐".repeat(review.rating || 5)}
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">
                {review.content}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-[#14181c] rounded-3xl p-10 text-center">
            <p className="text-gray-400">
              No reviews available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}