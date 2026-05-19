import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type HeroMovie } from '@/app/lib/tmdb';

interface HeroCarouselProps {
  movies: HeroMovie[];
}

const HeroCarousel = ({ movies }: HeroCarouselProps) => {
  const displayMovies = movies?.slice(0, 4) || [];

  if (displayMovies.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <div className="flex justify-between items-baseline mb-4 border-b border-[#2c3440] pb-1">
        <h2 className="text-[#9ab] text-[13px] font-bold uppercase tracking-widest hover:text-white cursor-pointer transition-colors duration-200">
          Popular Films This Week
        </h2>
        <Link href="/films?sort=popularity.desc" className="text-[#9ab] text-[11px] font-bold uppercase tracking-wider hover:text-white transition-colors duration-200">
          More
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {displayMovies.map((movie) => (
          <div key={movie.id} className="relative group/card">

            <Link href={`/films/${movie.id}`} className="block relative cursor-pointer rounded-lg overflow-hidden border border-transparent group-hover/card:border-[#00e054] transition-colors duration-200">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full aspect-2/3 object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              <div className="absolute inset-0 bg-[#14181c]/80 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center pointer-events-none">
                <i className="fa-solid fa-star text-[#00e054] text-3xl mb-1"></i>
                <span className="text-white font-bold text-sm tracking-widest mt-2">
                  {movie.rating.toFixed(1)} / 10
                </span>
              </div>
            </Link>

            <div className="flex justify-center items-center gap-3 text-[11px] font-bold text-[#678] mt-2">
              <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <i className="fa-solid fa-eye text-[#00e054]"></i> 471K
              </span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <i className="fa-solid fa-table-cells text-[#40bcf4]"></i> 69K
              </span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <i className="fa-solid fa-heart text-[#ff8000]"></i> 170K
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default HeroCarousel;
