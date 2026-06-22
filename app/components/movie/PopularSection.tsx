"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomeMovie } from "@/app/lib/home-movies";

function formatCount(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function PopularSection({
  mostWatched,
  topRated,
}: {
  mostWatched: HomeMovie[];
  topRated: HomeMovie[];
}) {
  const [tab, setTab] = useState<"watched" | "rated">("watched");
  const movies = tab === "watched" ? mostWatched : topRated;
  const featured = movies[0];
  const maximumWatches = Math.max(...movies.map((movie) => movie.watchCount), 1);

  if (!featured) return null;

  return (
    <section
      id="popular"
      className="scroll-mt-16 bg-gradient-to-b from-[#0d1117] to-[#14181c] py-14"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-[#ff8000]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8000]">
                Peringkat komunitas
              </p>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Popular Films
              </h2>
            </div>
          </div>

          <div className="flex rounded-lg border border-[#2c3440] bg-[#1c2228] p-1">
            <button
              type="button"
              onClick={() => setTab("watched")}
              className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                tab === "watched"
                  ? "bg-[#00e054] text-black"
                  : "text-[#9ab] hover:text-white"
              }`}
            >
              <i className="fa-solid fa-eye mr-1.5" />
              Most Watched
            </button>
            <button
              type="button"
              onClick={() => setTab("rated")}
              className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                tab === "rated"
                  ? "bg-[#00e054] text-black"
                  : "text-[#9ab] hover:text-white"
              }`}
            >
              <i className="fa-solid fa-star mr-1.5" />
              Top Rated
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-xl border border-[#2c3440] bg-[#1c2228]">
            <div className="p-3 sm:p-4">
              {movies.map((movie, index) => {
                const rank = index + 1;
                return (
                  <Link
                    key={movie.id}
                    href={`/films/${movie.tmdbId}`}
                    className="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition hover:border-[#2c3440] hover:bg-[#2c3440]/40"
                  >
                    <span
                      className="w-7 shrink-0 text-right text-lg font-black"
                      style={{ color: RANK_COLORS[index] ?? "#566270" }}
                    >
                      {rank}
                    </span>

                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded border border-[#2c3440] bg-[#0d1117]">
                      {movie.posterPath ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <i className="fa-solid fa-film absolute inset-0 flex items-center justify-center text-[#2c3440]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white transition group-hover:text-[#00e054]">
                        {movie.title}
                      </p>
                      <p className="truncate text-xs text-[#678]">
                        {movie.releaseYear ?? "—"} • {movie.genres[0] ?? "Film"}
                      </p>
                    </div>

                    <div className="hidden min-w-24 flex-col items-end gap-1 sm:flex">
                      <span className="text-xs font-bold text-[#00e054]">
                        <i
                          className={`fa-solid ${
                            tab === "watched" ? "fa-eye" : "fa-comment"
                          } mr-1`}
                        />
                        {formatCount(
                          tab === "watched"
                            ? movie.watchCount
                            : movie.reviewCount
                        )}
                      </span>
                      <div className="h-1 w-20 overflow-hidden rounded-full bg-[#2c3440]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#00e054] to-[#40bcf4]"
                          style={{
                            width: `${
                              tab === "watched"
                                ? (movie.watchCount / maximumWatches) * 100
                                : movie.rating * 20
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <span className="min-w-11 shrink-0 text-xs font-bold text-[#9ab]">
                      <i className="fa-solid fa-star mr-1 text-[#FFD700]" />
                      {movie.rating.toFixed(1)}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-[#2c3440] px-4 py-4 text-center">
              <Link
                href={
                  tab === "watched"
                    ? "/films?sort=popularity.desc"
                    : "/films?sort=vote_average.desc"
                }
                className="text-xs font-bold uppercase tracking-widest text-[#9ab] transition hover:text-[#00e054]"
              >
                Lihat Semua Film →
              </Link>
            </div>
          </div>

          <Link
            href={`/films/${featured.tmdbId}`}
            className="group relative hidden aspect-[2/3] overflow-hidden rounded-xl border border-[#2c3440] bg-[#1c2228] lg:block"
          >
            {featured.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${featured.posterPath}`}
                alt={featured.title}
                fill
                sizes="320px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c2228] via-transparent to-black/20" />
            <span className="absolute left-4 top-4 text-5xl font-black text-[#FFD700] drop-shadow-lg">
              #1
            </span>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="mb-2 text-xl font-black text-white">
                {featured.title}
              </h3>
              <div className="mb-4 flex gap-4 text-xs font-bold text-[#9ab]">
                <span>
                  <i className="fa-solid fa-eye mr-1 text-[#00e054]" />
                  {formatCount(featured.watchCount)}
                </span>
                <span>
                  <i className="fa-solid fa-star mr-1 text-[#FFD700]" />
                  {featured.rating.toFixed(1)}
                </span>
              </div>
              <span className="block rounded-lg bg-[#00e054] py-2 text-center text-xs font-bold uppercase tracking-wide text-black">
                Lihat Detail
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
