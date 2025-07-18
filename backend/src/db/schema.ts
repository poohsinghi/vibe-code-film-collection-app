import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Enums
export const watchStatusEnum = pgEnum('watch_status', ['want_to_watch', 'watching', 'watched']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  favoriteGenres: text('favorite_genres').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Films table
export const films = pgTable('films', {
  id: serial('id').primaryKey(),
  imdbId: varchar('imdb_id', { length: 20 }).unique(),
  tmdbId: integer('tmdb_id'),
  title: varchar('title', { length: 500 }).notNull(),
  year: integer('year'),
  genre: varchar('genre', { length: 500 }),
  director: varchar('director', { length: 255 }),
  actors: text('actors'),
  plot: text('plot'),
  poster: text('poster'),
  imdbRating: varchar('imdb_rating', { length: 10 }),
  runtime: varchar('runtime', { length: 20 }),
  language: varchar('language', { length: 100 }),
  country: varchar('country', { length: 100 }),
  awards: text('awards'),
  type: varchar('type', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Watchlist table
export const watchlist = pgTable('watchlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  filmId: integer('film_id').notNull().references(() => films.id, { onDelete: 'cascade' }),
  status: watchStatusEnum('status').notNull().default('want_to_watch'),
  personalRating: integer('personal_rating'), // 1-10 scale
  notes: text('notes'),
  watchedDate: timestamp('watched_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  watchlist: many(watchlist),
}));

export const filmsRelations = relations(films, ({ many }) => ({
  watchlist: many(watchlist),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
  film: one(films, {
    fields: [watchlist.filmId],
    references: [films.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Film = typeof films.$inferSelect;
export type NewFilm = typeof films.$inferInsert;

export type Watchlist = typeof watchlist.$inferSelect;
export type NewWatchlist = typeof watchlist.$inferInsert;

export type WatchStatus = 'want_to_watch' | 'watching' | 'watched';
