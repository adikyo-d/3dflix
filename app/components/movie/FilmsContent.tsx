"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Genre } from "@/app/lib/tmdb";

const TMDB_IMG = "https://image.tmdb.org/t/p";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Terpopuler", icon: "fa-fire" },
  { value: "vote_average.desc", label: "Rating Tertinggi", icon: "fa-star" },
  { value: "vote_count.desc", label: "Terbanyak Ditonton", icon: "fa-eye" },
  { value: "primary_release_date.desc", label: "Terbaru", icon: "fa-clock" },
];

const MOODS = [
  { value: "happy", label: "Happy", icon: "fa-face-smile", genres: "35,10751,16" },
  { value: "romantic", label: "Romantis", icon: "fa-heart", genres: "10749" },
  { value: "thrilling", label: "Seru", icon: "fa-bolt", genres: "28,53" },
  { value: "scary", label: "Menyeramkan", icon: "fa-ghost", genres: "27" },
  { value: "mindbending", label: "Mind-Bending", icon: "fa-brain", genres: "878,9648" },
  { value: "emotional", label: "Emosional", icon: "fa-masks-theater", genres: "18" },
  { value: "adventure", label: "Petualangan", icon: "fa-compass", genres: "12,14" },
];

const YEAR_START = 1970;
const CURRENT_YEAR = new Date().getFullYear();

const FALLBACK_COLORS = [
  "from-emerald-900 to-green-800",
  "from-teal-900 to-emerald-800",
  "from-green-900 to-teal-800",
  "from-cyan-900 to-green-800",
];

interface LocalMovie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  popularity: number;
  genre_ids: number[];
  like_count: number;
  review_count: number;
  avg_rating: number | null;
  watch_count: number;
}

interface FilmsContentProps {
  genres: Genre[];
  initialMovies: LocalMovie[];
  initialTotalPages: number;
  initialPage: number;
  initialQuery: string;
  initialSort: string;
  initialGenre: string;
  initialYear: string;
  initialMood: string;
}

export default function FilmsContent({
  genres,
  initialMovies,
  initialTotalPages,
  initialPage,
  initialQuery,
  initialSort,
  initialGenre,
  initialYear,
  initialMood,
}: FilmsContentProps) {
  console.log("initialQuery:", initialQuery);
  console.log("movies:", initialMovies.length)

  const router = useRouter();
  const [movies, setMovies] = useState<LocalMovie[]>(initialMovies);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(initialPage);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [genre, setGenre] = useState(initialGenre);
  const [year, setYear] = useState(initialYear);
  const [mood, setMood] = useState(initialMood);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const buildUrl = useCallback(
    (overrides: Record<string, string | number> = {}) => {
      const p = new URLSearchParams();
      const vals = {
        q: query,
        sort,
        genre,
        year,
        mood,
        page: String(page),
        ...overrides,
      };
      Object.entries(vals).forEach(([k, v]) => {
        if (v && String(v) !== "" && !(k === "page" && String(v) === "1"))
          p.set(k, String(v));
      });
      return `/films?${p.toString()}`;
    },
    [query, sort, genre, year, mood, page]
  );

  const fetchMovies = useCallback(
    async (overrides: Record<string, string | number> = {}) => {
      setLoading(true);
      const vals = { q: query, sort, genre, year, mood, page, ...overrides };

      try {
        const moodObj = MOODS.find((m) => m.value === vals.mood);
        const genreVal = moodObj ? moodObj.genres : vals.genre;

        const apiParams = new URLSearchParams({
          page: String(vals.page || 1),
          sort: String(vals.sort || "popularity.desc"),
        });

        if (vals.q) apiParams.set("q", String(vals.q));
        if (genreVal) apiParams.set("genre", String(genreVal));
        if (vals.year) apiParams.set("year", String(vals.year));

        const res = await fetch(`/api/movies?${apiParams}`);
        const data = await res.json();

        const results: LocalMovie[] = (data.results ?? []).map(
          (m: any): LocalMovie => ({
          ...m,
          genre_ids: m.genres
            ? m.genres.map((g: any) => g.tmdb_id)
            : m.genre_ids || [],
          }) );

        setMovies(results);
        setTotalPages(data.total_pages || 0);
        setPage(data.page || 1);
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [query, sort, genre, year, mood, page]
  );

  const applyFilters = (overrides: Record<string, string | number> = {}) => {
    const merged = {
      ...overrides,
      page: 1, 
    } as Record<string, string | number>;
    
    if ("query" in overrides) {
      setQuery(String(overrides.query || ""));
      merged.q = overrides.query || "";
      delete merged.query;
    }
    if ("sort" in overrides) setSort(String(overrides.sort));
    if ("genre" in overrides) setGenre(String(overrides.genre));
    if ("year" in overrides) setYear(String(overrides.year));
    if ("mood" in overrides) {
      setMood(String(overrides.mood));
      if (overrides.mood) {
        setGenre("");
        merged.genre = "";
      }
    }
    setPage(1);
    fetchMovies(merged);

    const urlOverrides: Record<string, string | number> = { ...merged };
    if (urlOverrides.q === undefined && query) urlOverrides.q = query;
    if (urlOverrides.sort === undefined) urlOverrides.sort = sort;
    if (urlOverrides.genre === undefined) urlOverrides.genre = genre;
    if (urlOverrides.year === undefined) urlOverrides.year = year;
    if (urlOverrides.mood === undefined) urlOverrides.mood = mood;
    router.push(buildUrl(urlOverrides), { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ query, q: query, page: 100 });
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
    fetchMovies({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setQuery("");
    setSort("popularity.desc");
    setGenre("");
    setYear("");
    setMood("");
    setPage(1);
    fetchMovies({
      q: "",
      sort: "popularity.desc",
      genre: "",
      year: "",
      mood: "",
      page: 1,
    });
    router.push("/films", { scroll: false });
  };

  const hasActiveFilters = query || genre || year || mood || sort !== "popularity.desc";

  const years: number[] = [];   
  for (let y = CURRENT_YEAR; y >= YEAR_START; y--) years.push(y);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
          <i className="fa-solid fa-film text-[#00e054] mr-3" />
          Films
        </h1>
        <p className="text-[#9ab] text-sm">
          Jelajahi ribuan film dari seluruh dunia
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative group">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#9ab] group-focus-within:text-[#00e054] transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul film..."
            className="w-full bg-[#1c2228] border border-[#2c3440] text-white rounded-xl pl-11 pr-28 py-3.5 text-sm focus:outline-none focus:border-[#00e054] focus:shadow-[0_0_0_3px_rgba(0,224,84,0.1)] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#00e054] text-black rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#00c04b] transition-colors"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Filter Toggle (Mobile) */}
      <button
      type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1c2228] border border-[#2c3440] rounded-xl text-sm font-bold text-[#9ab] hover:text-white transition-colors"
      >
        <i className={`fa-solid ${showFilters ? "fa-xmark" : "fa-sliders"}`} />
        {showFilters ? "Tutup Filter" : "Filter & Sortir"}
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-[#00e054]" />
        )}
      </button>

      {/* Filters Section */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } md:block mb-8 space-y-5`}
      >
        {/* Sort Buttons */}
        <div>
          <label className="block text-[#678] text-[11px] font-bold uppercase tracking-widest mb-2">
            Urutkan
          </label>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
              type="button"
                key={opt.value}
                onClick={() => applyFilters({ sort: opt.value })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  sort === opt.value
                    ? "bg-[#00e054] text-black shadow-[0_0_16px_rgba(0,224,84,0.3)]"
                    : "bg-[#1c2228] text-[#9ab] border border-[#2c3440] hover:border-[#00e054]/50 hover:text-white"
                }`}
              >
                <i className={`fa-solid ${opt.icon} text-[10px]`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Genre, Year, Mood row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Genre Select */}
          <div>
            <label className="block text-[#678] text-[11px] font-bold uppercase tracking-widest mb-2">
              Genre
            </label>
            <select aria-label="Select Genre"
              value={genre}
              onChange={(e) => {
                if (e.target.value) setMood("");
                applyFilters({ genre: e.target.value, mood: "" });
              }}
              className="w-full bg-[#1c2228] border border-[#2c3440] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00e054] transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ab' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="">Semua Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div>
            <label className="block text-[#678] text-[11px] font-bold uppercase tracking-widest mb-2">
              Tahun
            </label>
            <select aria-label="Select Year"
              value={year}
              onChange={(e) => applyFilters({ year: e.target.value })}
              className="w-full bg-[#1c2228] border border-[#2c3440] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00e054] transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ab' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="">Semua Tahun</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Mood pills */}
          <div>
            <label className="block text-[#678] text-[11px] font-bold uppercase tracking-widest mb-2">
              Mood
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                type="button"
                  key={m.value}
                  onClick={() => {
                    const newMood = mood === m.value ? "" : m.value;
                    applyFilters({
                      mood: newMood,
                      genre: newMood ? "" : genre,
                    });
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    mood === m.value
                      ? "bg-[#00e054] text-black"
                      : "bg-[#2c3440]/60 text-[#9ab] hover:text-white hover:bg-[#2c3440]"
                  }`}
                >
                  <i className={`fa-solid ${m.icon}`} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters / Clear */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#678] text-[11px] font-bold uppercase tracking-widest">
              Filter aktif:
            </span>
            {query && (
              <FilterChip
                label={`"${query}"`}
                onClear={() => applyFilters({ q: "", query: "" })}
              />
            )}
            {genre && (
              <FilterChip
                label={genres.find((g) => String(g.id) === genre)?.name || genre}
                onClear={() => applyFilters({ genre: "" })}
              />
            )}
            {year && (
              <FilterChip
                label={year}
                onClear={() => applyFilters({ year: "" })}
              />
            )}
            {mood && (
              <FilterChip
                label={MOODS.find((m) => m.value === mood)?.label || mood}
                onClear={() => applyFilters({ mood: "" })}
              />
            )}
            {sort !== "popularity.desc" && (
              <FilterChip
                label={
                  SORT_OPTIONS.find((s) => s.value === sort)?.label || sort
                }
                onClear={() => applyFilters({ sort: "popularity.desc" })}
              />
            )}
            <button
            type="button"
              onClick={clearFilters}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wide ml-2 transition-colors"
            >
              Hapus semua
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4 border-b border-[#2c3440] pb-2">
        <p className="text-[#9ab] text-[13px] font-bold uppercase tracking-widest">
          {loading
            ? "Memuat..."
            : `${movies.length > 0 ? `Halaman ${page} dari ${totalPages}` : "Tidak ada hasil"}`}
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-2/3 bg-[#2c3440] rounded-xl" />
              <div className="mt-2 h-3 bg-[#2c3440] rounded w-3/4" />
              <div className="mt-1 h-2 bg-[#2c3440] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Movie Grid */}
      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <FilmCard key={movie.id} movie={movie} genres={genres} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <i className="fa-solid fa-film-slash text-5xl text-[#2c3440] mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">
            Film tidak ditemukan
          </h3>
          <p className="text-[#9ab] text-sm mb-6 max-w-md">
            Coba ubah filter atau kata kunci pencarian kamu
          </p>
          <button
          type="button"
            onClick={clearFilters}
            className="px-5 py-2.5 bg-[#00e054] text-black rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#00c04b] transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button type="button" aria-label="Previous Page"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-[#1c2228] border border-[#2c3440] text-[#9ab] hover:text-white hover:border-[#00e054]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          {generatePageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`dot-${i}`} className="text-[#678] text-xs px-1">
                ...
              </span>
            ) : (
              <button
              type="button"
                key={p}
                onClick={() => goToPage(p as number)}
                className={`min-w-[36px] px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  page === p
                    ? "bg-[#00e054] text-black"
                    : "bg-[#1c2228] border border-[#2c3440] text-[#9ab] hover:text-white hover:border-[#00e054]/50"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button type="button" aria-label="Next Page"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-[#1c2228] border border-[#2c3440] text-[#9ab] hover:text-white hover:border-[#00e054]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}

function FilmCard({
  movie,
  genres,
}: {
  movie: LocalMovie;
  genres: Genre[];
}) {
  const [imgError, setImgError] = useState(false);
  const fallback = FALLBACK_COLORS[movie.id % FALLBACK_COLORS.length];
  const rating = movie.vote_average;
  const ratingColor =
    rating >= 7 ? "#00e054" : rating >= 5 ? "#40bcf4" : "#9ab";
  const movieYear = movie.release_date?.substring(0, 4) || "";
  const movieGenres = movie.genre_ids
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 2);

  return (
    <Link
      href={`/films/${movie.tmdb_id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden cursor-pointer select-none"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl">
        {movie.poster_path && !imgError ? (
          <Image
            src={`${TMDB_IMG}/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${fallback} flex flex-col items-center justify-center p-4`}
          >
            <i className="fa-solid fa-clapperboard text-5xl text-white/20 mb-3" />
            <span className="text-white/60 text-xs font-bold text-center leading-tight line-clamp-3">
              {movie.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-xl" />

        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#00e054]/60 transition-all duration-300" />

        {rating > 0 && (
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

        {/* Stats badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {movie.like_count > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm bg-black/70 text-rose-400 border border-rose-500/30">
              <i className="fa-solid fa-heart text-[8px]" />
              {movie.like_count}
            </div>
          )}
          {movie.watch_count > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm bg-black/70 text-[#00e054] border border-[#00e054]/30">
              <i className="fa-solid fa-eye text-[8px]" />
              {movie.watch_count}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Review count on hover */}
          {movie.review_count > 0 && (
            <p className="text-[10px] text-[#9ab] font-medium leading-tight mb-1">
              <i className="fa-solid fa-comment text-[8px] mr-1" />
              {movie.review_count} review
              {movie.avg_rating && (
                <span className="text-[#00e054] ml-1">
                  ({movie.avg_rating.toFixed(1)})
                </span>
              )}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {movieGenres.map((g) => (
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

      <div className="mt-2 px-0.5">
        <h3 className="text-white text-xs font-bold leading-tight line-clamp-1 group-hover:text-[#00e054] transition-colors duration-200">
          {movie.title}
        </h3>
        <p className="text-[#9ab] text-[10px] mt-0.5">{movieYear}</p>
      </div>
    </Link>
  );
}

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00e054]/10 border border-[#00e054]/30 text-[#00e054] text-[11px] font-bold">
      {label}
      <button
        onClick={onClear}
        className="hover:text-white transition-colors"
      >
        <i className="fa-solid fa-xmark text-[9px]" />
      </button>
    </span>
  );
}

function generatePageNumbers(
  current: number,
  total: number
): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
