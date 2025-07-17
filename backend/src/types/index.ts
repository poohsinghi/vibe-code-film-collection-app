import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  favorite_genres: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Film {
  id: number;
  imdb_id: string;
  title: string;
  year: number;
  genre: string;
  director: string;
  plot: string;
  poster_url: string;
  rating: number;
  runtime: number;
  created_at: Date;
}

export interface WatchlistEntry {
  id: number;
  user_id: number;
  film_id: number;
  status: 'want_to_watch' | 'watched' | 'currently_watching';
  rating?: number;
  review?: string;
  watched_date?: Date;
  added_at: Date;
  film?: Film;
}

export interface Collection {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export interface TMDBFilm {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
}

export interface OMDBFilm {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Genre: string;
  Director: string;
  Plot: string;
  imdbRating: string;
  Runtime: string;
}
