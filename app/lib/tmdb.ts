export interface HeroMovie {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number;
  releaseDate: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface DiscoverFilters {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  year?: number;
  query?: string;
}

export interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
  page: number;
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function getApiKey() {
  return process.env.NEXT_PUBLIC_TMDB_API_KEY;
}

export async function getTrendingMoviesForHero(): Promise<HeroMovie[]> {
  const apiKey = getApiKey();

  const res = await fetch(
    `${TMDB_BASE_URL}/trending/movie/day?api_key=${apiKey}&language=id-ID`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil data dari TMDB");
  }

  const data = await res.json();

  return data.results.slice(0, 5).map((movie: any) => ({
    id: movie.id,
    title: movie.title || movie.original_title,
    overview: movie.overview,
    backdropUrl: `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`,
    posterUrl: `${TMDB_IMAGE_BASE_URL}/original${movie.poster_path}`,
    rating: movie.vote_average,
    releaseDate: movie.release_date,
  }));
}

export async function getGenres(): Promise<Genre[]> {
  const apiKey = getApiKey();
  const res = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=id-ID`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.genres;
}

export async function discoverMovies(
  filters: DiscoverFilters = {}
): Promise<TMDBResponse> {
  const apiKey = getApiKey();
  const params = new URLSearchParams({
    api_key: apiKey!,
    language: "id-ID",
    include_adult: "false",
    page: String(filters.page || 1),
  });

  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  else params.set("sort_by", "popularity.desc");

  if (filters.with_genres) params.set("with_genres", filters.with_genres);
  if (filters.year) params.set("primary_release_year", String(filters.year));

  const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return { results: [], total_pages: 0, total_results: 0, page: 1 };
  return res.json();
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse> {
  const apiKey = getApiKey();
  const params = new URLSearchParams({
    api_key: apiKey!,
    language: "id-ID",
    query,
    page: String(page),
    include_adult: "false",
  });

  const res = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return { results: [], total_pages: 0, total_results: 0, page: 1 };
  return res.json();
}
