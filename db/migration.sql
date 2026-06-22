
ALTER TABLE users
  ADD COLUMN role ENUM('member', 'admin') NOT NULL DEFAULT 'member';

-- Tabel genres
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tmdb_id INT NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

-- Tabel movies
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tmdb_id INT NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  overview TEXT,
  poster_path VARCHAR(255),
  backdrop_path VARCHAR(255),
  vote_average DECIMAL(3,1) DEFAULT 0,
  vote_count INT DEFAULT 0,
  release_date DATE,
  popularity DECIMAL(10,3) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relasi many-to-many movies <-> genres
CREATE TABLE movie_genres (
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- Tabel likes (user menyukai film)
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Tabel reviews (user me-review film dengan rating)
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Tabel watchlist (user menandai film ditonton/ingin ditonton)
CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  watched BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_watchlist (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
