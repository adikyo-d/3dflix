import Hero from "./components/movie/Hero";
import TrendingSection from "./components/movie/TrendingSection";
import PopularSection from "./components/movie/PopularSection";
import { getHomeMovieSections } from "./lib/home-movies";

export default async function Home() {
  const { trending, mostWatched, topRated } = await getHomeMovieSections();

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Hero />
      <TrendingSection movies={trending} />
      <PopularSection mostWatched={mostWatched} topRated={topRated} />
    </main>
  );
}

