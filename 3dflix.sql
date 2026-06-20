-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 10 Jun 2026 pada 16.15
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `3dflix`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `release_year` int(4) NOT NULL,
  `director` varchar(100) DEFAULT NULL,
  `synopsis` text DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `poster_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `review_text` text DEFAULT NULL,
  `watch_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('member','admin') DEFAULT 'member',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tanggal_lahir` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `tanggal_lahir`) VALUES
(5, 'adikyo99', 'laluadityaramadani@gmail.com', '$2b$10$UBfHUhfNPaBFnw5t4bsy3OvugO/XlHO/9ekKAZWYUn.C9GK/1HY/y', 'member', '2026-05-05 19:51:20', NULL),
(6, 'kepin', 'pin@gmail.com', '$2b$10$uFbPTiyjl3IkSI8jBN.0o.luJLcpBzd6d0YbDZxj9QLUKq13jlOYq', 'member', '2026-05-15 11:50:53', NULL),
(40, 'zeropik', 'saudara-saudaranya@gmail.com', '$2b$10$U10wEmjaWs4Mdz8mBK66zOQkqwa7VqKUfz9xfvPgVm1ZdZFDvWSfe', 'member', '2026-05-15 13:13:38', NULL),
(45, 'kepinn', 'kepinn123@gmail.com', '$2b$10$2fMecpSD0JF98mGBAwXh4utFSBDj0R/dm/XYHkuHvGzh5j3gxUR5C', 'member', '2026-05-18 13:36:51', NULL),
(47, 'Sule', 'yasfi483@gmail.com', '$2b$10$Izaxb73ct9rWlqxmWreLHeoZdr/XjmcyZYLMW0GgbVqL4btlIyb/u', 'member', '2026-05-20 10:56:40', NULL),
(60, 'Sule jule', 'nuzumaki81325@gmail.com', '$2b$10$0DAHjgvH7WMfNK/bHBnpKOxsBkCz3wIv3j.O6HRJ8sbQhjiQ/5.Zu', 'member', '2026-05-20 10:57:49', NULL),
(61, 'dessdaisies', 'dsalsabila725@gmail.com', '$2b$10$y0uEadxme8QG47I77fkonOwd.zctJ/XwUAPW/X9HvTPMcnMx2fTXe', 'member', '2026-05-21 02:32:51', NULL),
(62, 'Dian', 'rosidaasriardiani20@gmail.com', '$2b$10$t.9egQNw6A2jSbmeJf0yXuSDQJHxaJIhrF9cUuv9q4rjuCC8C7sSi', 'member', '2026-05-21 02:36:49', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
