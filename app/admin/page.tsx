"use client";

import { useState, useEffect } from "react";

interface Stats {
  total_movies: number;
  total_users: number;
  total_reviews: number;
  total_banned: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  if (!stats) {
    return <p className="text-[#9ab] p-4">Memuat data statistik...</p>;
  }

  const cards = [
    {
      label: "Total Film",
      value: stats.total_movies,
      icon: "fa-film",
      color: "#00e054",
    },
    {
      label: "Total Users",
      value: stats.total_users,
      icon: "fa-users",
      color: "#40bcf4",
    },
    {
      label: "Total Reviews",
      value: stats.total_reviews,
      icon: "fa-comments",
      color: "#ff8000",
    },
    {
      label: "User Banned",
      value: stats.total_banned,
      icon: "fa-ban",
      color: "#ef4444",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-8 text-white">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#14181c] border border-[#2c3440] rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9ab]">
                {card.label}
              </span>
              <i
                className={`fa-solid ${card.icon} text-lg`}
                style={{ color: card.color }}
              />
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
