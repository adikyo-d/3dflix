-- Jalankan sekali pada database yang sudah dibuat dari migration.sql versi lama.
-- Script ini mempertahankan data watchlist, mengubah movie_id dari TMDB ID
-- menjadi primary key movies.id, lalu menambahkan status watched.

START TRANSACTION;

ALTER TABLE watchlists
  ADD COLUMN IF NOT EXISTS watched BOOLEAN NOT NULL DEFAULT FALSE AFTER movie_id;

SET @watchlist_fk = (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'watchlists'
    AND COLUMN_NAME = 'movie_id'
    AND REFERENCED_TABLE_NAME = 'movies'
  LIMIT 1
);

SET @watchlist_uses_tmdb = (
  SELECT COUNT(*)
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'watchlists'
    AND COLUMN_NAME = 'movie_id'
    AND REFERENCED_TABLE_NAME = 'movies'
    AND REFERENCED_COLUMN_NAME = 'tmdb_id'
);

SET @drop_old_fk = IF(
  @watchlist_fk IS NOT NULL,
  CONCAT('ALTER TABLE watchlists DROP FOREIGN KEY `', @watchlist_fk, '`'),
  'SELECT 1'
);
PREPARE drop_fk_statement FROM @drop_old_fk;
EXECUTE drop_fk_statement;
DEALLOCATE PREPARE drop_fk_statement;

SET @convert_movie_ids = IF(
  @watchlist_uses_tmdb > 0,
  'UPDATE watchlists w JOIN movies m ON w.movie_id = m.tmdb_id SET w.movie_id = m.id',
  'SELECT 1'
);
PREPARE convert_statement FROM @convert_movie_ids;
EXECUTE convert_statement;
DEALLOCATE PREPARE convert_statement;

ALTER TABLE watchlists
  ADD CONSTRAINT watchlists_movie_fk
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE;

COMMIT;
