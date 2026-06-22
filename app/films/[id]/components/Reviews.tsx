interface ReviewsProps {
  reviews: any[];
}

export default function Reviews({
  reviews,
}: ReviewsProps) {
  return (
    <section
      id="reviews"
      className="max-w-7xl mx-auto px-8 py-16"
    >
      <h2 className="text-4xl font-black text-white mb-8">
        Reviews
      </h2>

      {/* WRITE REVIEW */}
      <div className="bg-[#14181c] border border-[#00e054]/20 rounded-3xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-[#00e054] mb-4">
          Write a Review
        </h3>

        <input
          type="text"
          placeholder="Your name..."
          className="
            w-full
            bg-black
            border border-[#00e054]/20
            rounded-xl
            p-4
            text-white
            mb-4
            outline-none
          "
        />

        <select
          className="
            w-full
            bg-black
            border border-[#00e054]/20
            rounded-xl
            p-4
            text-white
            mb-4
          "
        >
          <option>⭐ 1 Star</option>
          <option>⭐⭐ 2 Stars</option>
          <option>⭐⭐⭐ 3 Stars</option>
          <option>⭐⭐⭐⭐ 4 Stars</option>
          <option>⭐⭐⭐⭐⭐ 5 Stars</option>
        </select>

        <textarea
          rows={5}
          placeholder="Write your review..."
          className="
            w-full
            bg-black
            border border-[#00e054]/20
            rounded-xl
            p-4
            text-white
            mb-4
            outline-none
          "
        />

        <button
          className="
            px-8
            py-3
            rounded-xl
            bg-[#00e054]
            text-black
            font-bold
            hover:bg-[#00ff66]
            transition
          "
        >
          Submit Review
        </button>
      </div>

      {/* REVIEWS LIST */}
      <div className="grid gap-6">
        {reviews?.length > 0 ? (
          reviews.map((review: any) => (
            <div
              key={review.id}
              className="
                bg-[#14181c]
                border
                border-[#00e054]/20
                rounded-3xl
                p-6
              "
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {review.author}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {review.created_at?.slice(0, 10)}
                  </p>
                </div>

                <div className="text-[#00e054]">
                  ⭐⭐⭐⭐⭐
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