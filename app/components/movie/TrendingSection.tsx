"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomeMovie } from "@/app/lib/home-movies";

const RANK_STYLES: Record<number, string> = {
  1: "bg-[#FFD700] text-black shadow-[0_0_14px_rgba(255,215,0,0.45)]",
  2: "bg-[#C0C0C0] text-black shadow-[0_0_14px_rgba(192,192,192,0.35)]",
  3: "bg-[#CD7F32] text-white shadow-[0_0_14px_rgba(205,127,50,0.35)]",
};

function formatCount(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function TrendingSection({
  movies,
}: {
  movies: HomeMovie[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (movies.length === 0) return null;

  const scroll = (direction: number) => {
    scrollRef.current?.scrollBy({
      left: direction * 600,
      behavior: "smooth",
    });
  };

  return (
    <section id="trending" className="scroll-mt-16 bg-[#14181c] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-[#00e054]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00e054]">
                Pilihan minggu ini
              </p>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Trending Films
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Geser trending ke kiri"
              onClick={() => scroll(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2c3440] bg-[#1c2228] text-[#9ab] transition hover:border-[#00e054] hover:text-white"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
              type="button"
              aria-label="Geser trending ke kanan"
              onClick={() => scroll(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2c3440] bg-[#1c2228] text-[#9ab] transition hover:border-[#00e054] hover:text-white"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
            <Link
              href="/films?sort=popularity.desc"
              className="ml-2 text-xs font-bold uppercase tracking-wider text-[#9ab] transition hover:text-[#00e054]"
            >
              More →
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie, index) => {
            const rank = index + 1;
            return (
              <Link
                key={movie.id}
                href={`/films/${movie.tmdbId}`}
                className="group w-[180px] shrink-0 snap-start overflow-hidden rounded-xl border border-[#2c3440] bg-[#1c2228] transition duration-300 hover:-translate-y-1.5 hover:border-[#00e054] hover:shadow-[0_18px_35px_rgba(0,0,0,0.55)]"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-[#0d1117]">
                  {movie.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      fill
                      sizes="180px"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-[#2c3440]">
                      <i className="fa-solid fa-clapperboard" />
                    </div>
                  )}

                  <span
                    className={`absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-md text-sm font-black ${
                      RANK_STYLES[rank] ?? "bg-[#2c3440] text-[#9ab]"
                    }`}
                  >
                    #{rank}
                  </span>

                  <span className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-bold text-[#00e054]">
                    <i className="fa-solid fa-star mr-1" />
                    {movie.rating.toFixed(1)}
                  </span>

                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black via-black/20 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    <p className="line-clamp-3 text-xs leading-relaxed text-gray-200">
                      {movie.overview}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <h3 className="truncate text-sm font-bold text-white transition group-hover:text-[#00e054]">
                    {movie.title}
                  </h3>
                  <p className="truncate text-xs text-[#678]">
                    {movie.releaseYear ?? "—"} • {movie.genres[0] ?? "Film"}
                  </p>
                  <div className="flex gap-3 text-xs font-semibold text-[#678]">
                    <span>
                      <i className="fa-solid fa-eye mr-1 text-[#00e054]" />
                      {formatCount(movie.watchCount)}
                    </span>
                    <span>
                      <i className="fa-solid fa-heart mr-1 text-[#ff8000]" />
                      {formatCount(movie.likeCount)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
