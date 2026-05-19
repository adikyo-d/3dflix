// app/page.tsx
import { getTrendingMoviesForHero } from "@/app/lib/tmdb";
import HeroCarousel from "@/app/components/movie/HeroCarousel"; // Path ke carousel Anda
import Hero from "./components/movie/Hero";

export default async function Home() {
  // Fetch data berjalan di server
  const movies = await getTrendingMoviesForHero();

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Hero/>
      <HeroCarousel movies={movies}/>
      
      {/* Konten 3dflix lainnya di bawah sini */}
    </main>
  );
}

