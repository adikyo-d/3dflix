import { getGenres, discoverMovies } from "@/app/lib/tmdb";
import FilmsContent from "@/app/components/movie/FilmsContent";

interface FilmsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const params = await searchParams;
  const [genres, initialData] = await Promise.all([
    getGenres(),
    params.q
      ? (await import("@/app/lib/tmdb")).searchMovies(params.q, 1)
      : discoverMovies({
          sort_by: params.sort || "popularity.desc",
          with_genres: params.genre,
          year: params.year ? Number(params.year) : undefined,
          page: params.page ? Number(params.page) : 1,
        }),
  ]);

  return (
    <main className="min-h-screen bg-[#14181c]">
      <FilmsContent
        genres={genres}
        initialMovies={initialData.results}
        initialTotalPages={initialData.total_pages}
        initialPage={initialData.page}
        initialQuery={params.q || ""}
        initialSort={params.sort || "popularity.desc"}
        initialGenre={params.genre || ""}
        initialYear={params.year || ""}
        initialMood={params.mood || ""}
      />
    </main>
  );
}
