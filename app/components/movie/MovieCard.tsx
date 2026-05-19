"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  rating?: number;
  genre?: string[];
  posterUrl?: string;
  director?: string;
  watched?: boolean;
  liked?: boolean;
}

const FALLBACK_COLORS = [
  "from-emerald-900 to-green-800",
  "from-teal-900 to-emerald-800",
  "from-green-900 to-teal-800",
  "from-cyan-900 to-green-800",
];

export default function MovieCard({
  id,
  title,
  year,
  rating,
  genre = [],
  posterUrl,
  director,
  watched = false,
  liked = false,
}: MovieCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fallback = FALLBACK_COLORS[id % FALLBACK_COLORS.length];

  const ratingColor =
    rating !== undefined
      ? rating >= 4
        ? "#00e054"
        : rating >= 3
        ? "#40bcf4"
        : "#9ab"
      : "#9ab";

  return (
    <Link
      href={`/films/${id}`}
      id={`movie-card-${id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden cursor-pointer select-none"
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster Container */}
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl">
        {/* Poster image or fallback gradient */}
        {posterUrl && !imgError ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-linier-to-br ${fallback} flex flex-col items-center justify-center p-4`}
          >
            <i className="fa-solid fa-clapperboard text-5xl text-white/20 mb-3" />
            <span className="text-white/60 text-xs font-bold text-center leading-tight line-clamp-3">
              {title}
            </span>
          </div>
        )}

        {/* Dark overlay on hover */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-xl"
        />

        {/* Glow border on hover */}
        <div
          className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#00e054]/60 transition-all duration-300"
          style={{
            boxShadow: hovered ? "0 0 20px rgba(0,224,84,0.2) inset" : "none",
          }}
        />

        {/* Rating Badge */}
        {rating !== undefined && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black backdrop-blur-sm"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: ratingColor,
              border: `1px solid ${ratingColor}33`,
            }}
          >
            <i className="fa-solid fa-star text-[10px]" />
            {rating.toFixed(1)}
          </div>
        )}

        {/* Watched & Liked badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {watched && (
            <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm border border-[#00e054]/40 flex items-center justify-center">
              <i className="fa-solid fa-eye text-[10px] text-[#00e054]" />
            </div>
          )}
          {liked && (
            <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm border border-rose-500/40 flex items-center justify-center">
              <i className="fa-solid fa-heart text-[10px] text-rose-400" />
            </div>
          )}
        </div>

        {/* Hover detail overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {director && (
            <p className="text-[10px] text-[#9ab] font-medium leading-tight mb-1">
              dir.{" "}
              <span className="text-white font-bold">{director}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                style={{
                  background: "rgba(0,224,84,0.15)",
                  color: "#00e054",
                  border: "1px solid rgba(0,224,84,0.3)",
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-2 px-0.5">
        <h3 className="text-white text-xs font-bold leading-tight line-clamp-1 group-hover:text-[#00e054] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-[#9ab] text-[10px] mt-0.5">{year}</p>
      </div>
    </Link>
  );
}
