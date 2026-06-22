"use client";

import { useState, useEffect } from "react";
import ReviewModal from "./ReviewModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  release_date: string;
}

export default function MovieHero({
  movie,
  movieId,
}: {
  movie: Movie;
  movieId: number;
}) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watched, setWatched] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Ambil status like berdasarkan ID film saat komponen dimuat
  useEffect(() => {
    if (!movieId) return;

    fetch(`/api/movies/${movieId}/like`)
      .then((r) => r.json())
      .then((data) => {
        setLiked(Boolean(data.liked));
        setLikeCount(Number(data.like_count) || 0);
      })
      .catch((err) => console.error("Gagal memuat data like:", err));

    fetch(`/api/movies/${movieId}/watchlist`)
      .then((r) => r.json())
      .then((data) => {
        setInWatchlist(Boolean(data.in_watchlist));
        setWatched(Boolean(data.watched));
      })
      .catch((err) => console.error("Gagal memuat status film:", err));
  }, [movieId]);

  // Handler untuk menyukai / membatalkan suka pada film
  const handleLike = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/movies/${movieId}/like`, {
        method: liked ? "DELETE" : "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui like");
      setLiked(Boolean(data.liked));
      setLikeCount(Number(data.like_count) || 0);
    } catch (error) {
      console.error("Error handle like:", error);
    }
  };

  // Handler untuk menyimpan film ke daftar Watchlist
  const updateMovieStatus = async (target: "watchlist" | "watched") => {
    if (!session || !session.user) {
      router.push("/login");
      return;
    }

    try {
      setActionLoading(true);
      const shouldRemove =
        (target === "watchlist" && inWatchlist && !watched) ||
        (target === "watched" && watched);

      const res = await fetch(`/api/movies/${movieId}/watchlist`, {
        method: shouldRemove ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: shouldRemove
          ? undefined
          : JSON.stringify({ watched: target === "watched" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui status film");
      setInWatchlist(Boolean(data.in_watchlist));
      setWatched(Boolean(data.watched));
    } catch (error) {
      console.error("Error update movie status:", error);
      alert(error instanceof Error ? error.message : "Gagal memperbarui status film");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/80" />

      {/* GLOW */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00e054]/10 via-transparent to-[#00e054]/5" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
          {/* LEFT SIDE */}
          <div>
            <div className="mb-4">
              <span className="px-4 py-2 rounded-full border border-[#00e054] text-[#00e054] text-sm font-semibold">
                FEATURED MOVIE
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black uppercase text-white mb-3">
              {movie.title}
            </h1>

            <div className="flex gap-3 text-gray-300 mb-5">
              <span>{movie.release_date}</span>
              <span>&bull;</span>
              <span>{movie.runtime || 0} min</span>
            </div>

            <p className="max-w-3xl text-gray-400 leading-relaxed mb-8">
              {movie.overview}
            </p>

            <div className="flex gap-4 flex-wrap mb-8">
              <button
                onClick={() => {
                  if (!session) {
                    router.push("/login");
                    return;
                  }
                  setShowReviewModal(true);
                }}
                className="px-8 py-4 rounded-xl bg-[#00e054] text-black transition-all duration-300 font-bold hover:bg-[#00ff66] hover:scale-105 hover:shadow-[0_0_25px_rgba(0,224,84,0.6)]"
              >
                RATE & REVIEW
              </button>

              <button
                onClick={handleLike}
                className={`px-8 py-4 rounded-xl border font-bold transition-all duration-300 ${
                  liked
                    ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600"
                    : "border-rose-400 text-rose-400 hover:bg-rose-500 hover:text-white"
                }`}
              >
                <i className={`fa-${liked ? "solid" : "regular"} fa-heart mr-2`} />
                {liked ? "LIKED" : "LIKE"} ({likeCount})
              </button>

              <button
                onClick={() => updateMovieStatus("watchlist")}
                disabled={actionLoading}
                className={`px-8 py-4 rounded-xl border transition disabled:opacity-50 ${
                  inWatchlist && !watched
                    ? "border-[#00e054] bg-[#00e054] text-black"
                    : "border-[#00e054] text-[#00e054] hover:bg-[#00e054] hover:text-black"
                }`}
              >
                <i className="fa-solid fa-bookmark mr-2" />
                {inWatchlist && !watched ? "IN WATCHLIST" : "ADD TO WATCHLIST"}
              </button>

              <button
                onClick={() => updateMovieStatus("watched")}
                disabled={actionLoading}
                className={`px-8 py-4 rounded-xl border transition disabled:opacity-50 ${
                  watched
                    ? "border-sky-400 bg-sky-400 text-black"
                    : "border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black"
                }`}
              >
                <i className="fa-solid fa-eye mr-2" />
                {watched ? "WATCHED" : "MARK AS WATCHED"}
              </button>
            </div>

            {/* METRICS + VISUAL */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/50 backdrop-blur-md border border-[#00e054]/30 rounded-2xl p-6">
                <h3 className="text-[#00e054] font-bold mb-4">METRICS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {movie.vote_average?.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {movie.vote_count}
                    </div>
                    <div className="text-sm text-gray-500">Votes</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 backdrop-blur-md border border-[#00e054]/30 rounded-2xl p-6">
                <h3 className="text-[#00e054] font-bold mb-4">
                  VISUAL EXPERIENCE
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded border border-[#00e054]/30">
                    4K
                  </span>
                  <span className="px-3 py-1 rounded border border-[#00e054]/30">
                    HDR
                  </span>
                  <span className="px-3 py-1 rounded border border-[#00e054]/30">
                    ATMOS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - POSTER */}
          <div className="flex flex-col items-center lg:items-end justify-start">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
                className="w-full max-w-[380px] rounded-3xl object-cover border border-[#00e054]/20 mb-4"
                style={{
                  boxShadow:
                    "0 0 40px rgba(0,224,84,0.15), 0 20px 60px rgba(0,0,0,0.6)",
                }}
              />
            )}
            {showReviewModal && (
              <ReviewModal
                movieId={movieId}
                onClose={() => setShowReviewModal(false)}
                onSuccess={() => {
                  setShowReviewModal(false);
                  router.refresh();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
