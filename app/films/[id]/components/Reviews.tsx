interface ReviewsProps {
  reviews: any[];
}

export default function Reviews({
  reviews,
}: ReviewsProps) {

  if (!reviews?.length) {
    return null;
  }
  
  return (
    <section className="max-w-7xl mx-auto px-10 mt-16 pb-20">
      <h2 className="text-2xl font-bold mb-6">
        Reviews
      </h2>

      <div className="space-y-6">
        {reviews.slice(0, 5).map((review) => (
          <div
            key={review.id}
            className="bg-zinc-900 p-6 rounded-xl"
          >
            <h3 className="font-bold mb-2">
              {review.author}
            </h3>

            <p className="text-gray-300">
              {review.content.slice(0, 300)}...
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}