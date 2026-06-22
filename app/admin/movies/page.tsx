"use client";

import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
}

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchMovies = async () => {
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("q", search);

      const res = await fetch(`/api/movies?${params}`); // API publik movie catalog kamu
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const handleDelete = async (id: number, title: string) => {
    if (
      !confirm(
        `Hapus film "${title}"? Semua review dan watchlist terkait juga akan terhapus.`,
      )
    )
      return;
    const res = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchMovies();
    } else {
      alert("Gagal menghapus film.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Kelola Film</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari film..."
            className="bg-[#1c2228] border border-[#2c3440] text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#00e054]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#00e054] text-black text-sm font-bold rounded-lg hover:bg-[#00c849]"
          >
            Cari
          </button>
        </form>
      </div>

      <div className="bg-[#14181c] border border-[#2c3440] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2c3440] text-xs font-bold uppercase tracking-wider text-[#9ab] bg-[#1a2026]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Film</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr
                key={movie.id}
                className="border-b border-[#2c3440]/50 hover:bg-[#1c2228] transition-colors"
              >
                <td className="px-4 py-3 text-[#9ab]">{movie.id}</td>
                <td className="px-4 py-3 font-bold text-white">
                  {movie.title}
                </td>
                <td className="px-4 py-3 text-[#9ab]">
                  {movie.release_date?.slice(0, 4) || "-"}
                </td>
                <td className="px-4 py-3 text-[#00e054] font-bold">
                  {Number(movie.vote_average).toFixed(1)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(movie.id, movie.title)}
                    className="px-3 py-1 text-xs font-bold rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 text-sm font-bold rounded-lg bg-[#2c3440] text-white disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-sm text-[#9ab]">
          Halaman {page} dari {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 text-sm font-bold rounded-lg bg-[#2c3440] text-white disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
