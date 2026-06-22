import pool from "@/app/lib/db";
import FilmsContent from "@/app/components/movie/FilmsContent";

interface FilmsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const params = await searchParams;

  // Fetch genres dari DB
  const [genres]: any = await pool.execute(
    "SELECT id, tmdb_id, name FROM genres ORDER BY name"
  );

  // Build query untuk initial data
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 20;
  const offset = (page - 1) * limit;
  const query = params.q || "";
  console.log("SEARCH QUERY =", query);
  const genre = params.genre || "";
  const year = params.year || "";
  const sort = params.sort || "popularity.desc";

  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (query) {
    conditions.push("m.title LIKE ?");
    queryParams.push(`%${query}%`);
  }

  if (genre) {
    conditions.push(
      "m.id IN (SELECT movie_id FROM movie_genres mg JOIN genres g ON mg.genre_id = g.id WHERE g.tmdb_id = ?)"
    );
    queryParams.push(Number(genre));
  }

  if (year) {
    conditions.push("YEAR(m.release_date) = ?");
    queryParams.push(Number(year));
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortMap: Record<string, string> = {
    "popularity.desc": "m.popularity DESC",
    "vote_average.desc": "m.vote_average DESC",
    "vote_count.desc": "m.vote_count DESC",
    "primary_release_date.desc": "m.release_date DESC",
  };
  const orderBy = sortMap[sort] || "m.popularity DESC";

  const [countRows]: any = await pool.execute(
    `SELECT COUNT(*) as total FROM movies m ${whereClause}`,
    queryParams
  );
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  const [movies]: any = await pool.execute(
    `SELECT m.*,
      (SELECT COUNT(*) FROM likes l WHERE l.movie_id = m.id) as like_count,
      (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) as review_count,
      (SELECT AVG(r.rating) FROM reviews r WHERE r.movie_id = m.id) as avg_rating,
      (SELECT COUNT(*) FROM watchlist w WHERE w.movie_id = m.id AND w.watched = true) as watch_count
     FROM movies m
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  // Fetch genres per movie
  const movieIds = movies.map((m: any) => m.id);
  let genresByMovie: Record<number, number[]> = {};

  if (movieIds.length > 0) {
    const placeholders = movieIds.map(() => "?").join(",");
    const [genreRows]: any = await pool.execute(
      `SELECT mg.movie_id, g.tmdb_id
       FROM movie_genres mg
       JOIN genres g ON mg.genre_id = g.id
       WHERE mg.movie_id IN (${placeholders})`,
      movieIds
    );
    for (const row of genreRows) {
      if (!genresByMovie[row.movie_id]) genresByMovie[row.movie_id] = [];
      genresByMovie[row.movie_id].push(row.tmdb_id);
    }
  }

  const initialMovies = movies.map((m: any) => ({
    id: m.id,
    tmdb_id: m.tmdb_id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    vote_average: Number(m.vote_average),
    vote_count: m.vote_count,
    release_date: m.release_date
      ? new Date(m.release_date).toISOString().split("T")[0]
      : "",
    popularity: Number(m.popularity),
    genre_ids: genresByMovie[m.id] || [],
    like_count: m.like_count,
    review_count: m.review_count,
    avg_rating: m.avg_rating ? Number(m.avg_rating) : null,
    watch_count: m.watch_count,
  }));

  return (
    <main className="min-h-screen bg-[#14181c]">
      <FilmsContent
        genres={genres.map((g: any) => ({ id: g.tmdb_id, name: g.name }))}
        initialMovies={initialMovies}
        initialTotalPages={totalPages}
        initialPage={page}
        initialQuery={params.q || ""}
        initialSort={params.sort || "popularity.desc"}
        initialGenre={params.genre || ""}
        initialYear={params.year || ""}
        initialMood={params.mood || ""}
      />
    </main>
  );
}
