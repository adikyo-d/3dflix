"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link'; 

// Utility untuk memformat angka stat
const formatViews = (num: number) => {
  if (!num) return '0';
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toString();
};

// Map Genre TMDB
const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

const Hero = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch Data dari TMDB
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY; 
        
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();

        const formattedMovies = data.results.slice(0, 5).map((m: any, index: number) => ({
          id: m.id,
          title: m.title || m.original_title,
          release_year: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
          duration: '120m', 
          rating: m.vote_average ? m.vote_average.toFixed(1) : 'NR',
          genres: m.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean).slice(0, 3), 
          synopsis: m.overview,
          views: Math.floor(m.popularity * 100), 
          lists: m.vote_count, 
          likes: Math.floor(m.vote_count * 0.8), 
          trending_rank: index + 1,
          poster_path: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          backdrop_path: `https://image.tmdb.org/t/p/original${m.backdrop_path}`,
        }));

        setMovies(formattedMovies);
      } catch (error) {
        console.error("Gagal mengambil data TMDB:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    if (movies.length > 0) {
      goTo((current + 1) % movies.length);
    }
  }, [current, goTo, movies.length]);

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, movies.length]);

  if (isLoading) {
    return (
      <section className="w-full bg-[#0d1117] flex items-center justify-center" style={{ height: '90vh', minHeight: 560 }}>
        <div className="text-[#00e054] text-xl font-bold animate-pulse">Loading Featured Films...</div>
      </section>
    );
  }

  if (!movies.length) return null;

  const movie = movies[current];

  return (
    <section id="hero" className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: 560 }}>
      <div
        className="absolute inset-0 transition-opacity duration-700 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backdrop_path})`,
          opacity: isAnimating ? 0 : 0.4,
        }}
      />

      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `linear-gradient(135deg, rgba(13,17,23,0.9) 0%, rgba(20,24,28,0.8) 60%, rgba(13,17,23,0.9) 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#00e054 1px, transparent 1px), linear-gradient(90deg, #00e054 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div
        className="absolute rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: '50%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #00e054 0%, transparent 70%)',
          transition: 'opacity 0.6s',
        }}
      />

      <div
        className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center"
        style={{ opacity: isAnimating ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className="flex items-center gap-12 w-full">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{ color: '#00e054', borderColor: '#00e054', background: 'rgba(0,224,84,0.08)' }}
              >
                🎬 Featured Film
              </span>
              {movie.trending_rank && (
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{ color: '#40bcf4', borderColor: '#40bcf4', background: 'rgba(64,188,244,0.08)' }}
                >
                  #{movie.trending_rank} Trending
                </span>
              )}
            </div>

            <h1
              className="text-white font-black leading-none mb-3"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                textShadow: '0 0 60px rgba(0,224,84,0.3)',
                letterSpacing: '-0.02em',
              }}
            >
              {movie.title}
            </h1>

            <div className="flex items-center flex-wrap gap-3 mb-4" style={{ color: '#9ab' }}>
              <span className="font-semibold">{movie.release_year}</span>
              <span style={{ color: '#2c3440' }}>•</span>
              <span>{movie.duration}</span>
              <span style={{ color: '#2c3440' }}>•</span>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-star text-xs" style={{ color: '#00e054' }} />
                {movie.rating}
              </span>
              <span style={{ color: '#2c3440' }}>•</span>
              <div className="flex flex-wrap gap-1">
                {movie.genres.map((g: string) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: 'rgba(44,52,64,0.8)', color: '#9ab' }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <p
              className="mb-6 leading-relaxed"
              style={{
                color: '#9ab',
                fontSize: '0.95rem',
                maxWidth: 520,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {movie.synopsis}
            </p>

            <div className="flex items-center gap-6 mb-8" style={{ color: '#678', fontSize: '0.8rem', fontWeight: 700 }}>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-eye" style={{ color: '#00e054' }} />
                {formatViews(movie.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-table-cells" style={{ color: '#40bcf4' }} />
                {formatViews(movie.lists)} lists
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-heart" style={{ color: '#ff8000' }} />
                {formatViews(movie.likes)} likes
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href={`/films/${movie.id}`}
                id={`hero-cta-watch-${movie.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-200"
                style={{
                  background: '#00e054',
                  color: '#000',
                  boxShadow: '0 0 24px rgba(0,224,84,0.35)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 36px rgba(0,224,84,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(0,224,84,0.35)';
                }}
              >
                <i className="fa-solid fa-star" />
                Rate & Review
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                id={`hero-cta-detail-${movie.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide border transition-all duration-200"
                style={{ borderColor: '#2c3440', color: '#9ab' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00e054';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2c3440';
                  e.currentTarget.style.color = '#9ab';
                }}
              >
                <i className="fa-solid fa-circle-info" />
                View Details
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center gap-4" style={{ flexShrink: 0 }}>
            <div
              className="relative overflow-hidden rounded-xl bg-[#2c3440]"
              style={{
                width: 260,
                boxShadow: '0 0 60px rgba(0,224,84,0.2), 0 30px 60px rgba(0,0,0,0.7)',
                border: '1px solid rgba(0,224,84,0.2)',
              }}
            >
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full"
                style={{ aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex items-center gap-2" style={{ transform: 'translateX(-50%)' }}>
        {movies.map((_, i) => (
          <button
            key={i}
            id={`hero-dot-${i}`}
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? 32 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? '#00e054' : '#2c3440',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      <button
        id="hero-prev"
        onClick={() => goTo((current - 1 + movies.length) % movies.length)}
        className="absolute left-4 top-1/2 z-20 flex items-center justify-center transition-all duration-200"
        style={{
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(20,24,28,0.7)',
          border: '1px solid #2c3440',
          color: '#9ab',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00e054'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2c3440'; e.currentTarget.style.color = '#9ab'; }}
      >
        <i className="fa-solid fa-chevron-left" />
      </button>
      <button
        id="hero-next"
        onClick={next}
        className="absolute right-4 top-1/2 z-20 flex items-center justify-center transition-all duration-200"
        style={{
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(20,24,28,0.7)',
          border: '1px solid #2c3440',
          color: '#9ab',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00e054'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2c3440'; e.currentTarget.style.color = '#9ab'; }}
      >
        <i className="fa-solid fa-chevron-right" />
      </button>

      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height: 120, background: 'linear-gradient(transparent, #14181c)' }}
      />
    </section>
  );
};

export default Hero;