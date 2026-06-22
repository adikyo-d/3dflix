"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_banned: number;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBan = async (id: number, currentlyBanned: boolean) => {
    const action = currentlyBanned ? "Unban" : "Ban";
    if (!confirm(`${action} user ini?`)) return;

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_banned: !currentlyBanned }),
    });

    if (res.ok) fetchUsers();
    else alert("Gagal mengupdate status user");
  };

  const handleDelete = async (id: number, username: string) => {
    if (
      !confirm(
        `Hapus user "${username}"? Semua data user (reviews, likes, watchlist) juga akan terhapus secara permanen.`,
      )
    )
      return;

    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers(users.filter((u) => u.id !== id));
    else alert("Gagal menghapus user");
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Kelola Users</h1>

      <div className="bg-[#14181c] border border-[#2c3440] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2c3440] text-xs font-bold uppercase tracking-wider text-[#9ab] bg-[#1a2026]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#2c3440]/50 hover:bg-[#1c2228] transition-colors"
              >
                <td className="px-4 py-3 text-[#9ab]">{user.id}</td>
                <td className="px-4 py-3 text-white font-semibold">
                  {user.username}
                </td>
                <td className="px-4 py-3 text-[#9ab]">{user.email || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${user.role === "admin" ? "bg-[#00e054]/10 text-[#00e054]" : "bg-[#2c3440] text-[#9ab]"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.is_banned ? (
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-red-500/10 text-red-400">
                      Banned
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-green-500/10 text-green-400">
                      Aktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() => handleBan(user.id, !!user.is_banned)}
                          className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                            user.is_banned
                              ? "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                              : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                          }`}
                        >
                          {user.is_banned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="px-3 py-1 text-xs font-bold rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
