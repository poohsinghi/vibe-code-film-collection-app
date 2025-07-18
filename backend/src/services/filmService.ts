import axios from 'axios';
import { desc, eq, like, or } from 'drizzle-orm';
import { db } from '../db';
import { films, type Film } from '../db/schema';

export interface SearchFilmsResult {
  films: Film[];
  totalResults: number;
  page: number;
}

export interface ExternalFilmData {
  imdbId?: string;
  tmdbId?: number;
  title: string;
  year?: number;
  genre?: string;
  director?: string;
  actors?: string;
  plot?: string;
  poster?: string;
  imdbRating?: string;
  runtime?: string;
  language?: string;
  country?: string;
  awards?: string;
  type?: string;
}

export class FilmService {
  static async searchFilms(query: string, page: number = 1): Promise<SearchFilmsResult> {
    try {
      // First search in local database
      const localFilms = await db
        .select()
        .from(films)
        .where(or(
          like(films.title, `%${query}%`),
          like(films.director, `%${query}%`),
          like(films.actors, `%${query}%`)
        ))
        .limit(10)
        .offset((page - 1) * 10);

      // If we have local results, return them
      if (localFilms.length > 0) {
        return {
          films: localFilms,
          totalResults: localFilms.length,
          page
        };
      }

      // Otherwise, search external APIs
      return await this.searchExternalAPIs(query, page);
    } catch (error) {
      console.error('Film search error:', error);
      throw new Error('Failed to search films');
    }
  }

  static async searchExternalAPIs(query: string, page: number = 1): Promise<SearchFilmsResult> {
    try {
      // Search using OMDB API
      const omdbResponse = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: process.env.OMDB_API_KEY,
          s: query,
          page,
          type: 'movie'
        }
      });

      if (omdbResponse.data.Response === 'False') {
        return { films: [], totalResults: 0, page };
      }

      const externalFilms: ExternalFilmData[] = omdbResponse.data.Search.map((film: any) => ({
        imdbId: film.imdbID,
        title: film.Title,
        year: parseInt(film.Year) || undefined,
        poster: film.Poster !== 'N/A' ? film.Poster : undefined,
        type: film.Type
      }));

      // Save to database and return
      const savedFilms = await this.saveFilmsToDatabase(externalFilms);

      return {
        films: savedFilms,
        totalResults: parseInt(omdbResponse.data.totalResults) || savedFilms.length,
        page
      };
    } catch (error) {
      console.error('External API search error:', error);
      throw new Error('Failed to search external APIs');
    }
  }

  static async saveFilmsToDatabase(externalFilms: ExternalFilmData[]): Promise<Film[]> {
    const savedFilms: Film[] = [];

    for (const filmData of externalFilms) {
      try {
        // Check if film already exists
        let existingFilm: Film | undefined;
        
        if (filmData.imdbId) {
          [existingFilm] = await db
            .select()
            .from(films)
            .where(eq(films.imdbId, filmData.imdbId))
            .limit(1);
        }

        if (existingFilm) {
          savedFilms.push(existingFilm);
        } else {
          // Create new film
          const [newFilm] = await db
            .insert(films)
            .values(filmData)
            .returning();
          
          savedFilms.push(newFilm);
        }
      } catch (error) {
        console.error('Error saving film to database:', error);
        // Continue with other films
      }
    }

    return savedFilms;
  }

  static async getFilmById(id: number): Promise<Film | undefined> {
    const [film] = await db
      .select()
      .from(films)
      .where(eq(films.id, id))
      .limit(1);

    return film;
  }

  static async getFilmByImdbId(imdbId: string): Promise<Film | undefined> {
    const [film] = await db
      .select()
      .from(films)
      .where(eq(films.imdbId, imdbId))
      .limit(1);

    return film;
  }

  static async getPopularFilms(limit: number = 20): Promise<Film[]> {
    return await db
      .select()
      .from(films)
      .orderBy(desc(films.createdAt))
      .limit(limit);
  }

  static async getFilmDetails(imdbId: string): Promise<Film | undefined> {
    let existingFilm: Film | undefined;
    
    try {
      // First check if we have detailed info in database
      existingFilm = await this.getFilmByImdbId(imdbId);
      
      if (existingFilm && existingFilm.plot) {
        return existingFilm;
      }

      // Fetch detailed info from OMDB
      const omdbResponse = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: process.env.OMDB_API_KEY,
          i: imdbId,
          plot: 'full'
        }
      });

      if (omdbResponse.data.Response === 'False') {
        return existingFilm;
      }

      const filmData = omdbResponse.data;
      const detailedFilmData: ExternalFilmData = {
        imdbId: filmData.imdbID,
        title: filmData.Title,
        year: parseInt(filmData.Year) || undefined,
        genre: filmData.Genre !== 'N/A' ? filmData.Genre : undefined,
        director: filmData.Director !== 'N/A' ? filmData.Director : undefined,
        actors: filmData.Actors !== 'N/A' ? filmData.Actors : undefined,
        plot: filmData.Plot !== 'N/A' ? filmData.Plot : undefined,
        poster: filmData.Poster !== 'N/A' ? filmData.Poster : undefined,
        imdbRating: filmData.imdbRating !== 'N/A' ? filmData.imdbRating : undefined,
        runtime: filmData.Runtime !== 'N/A' ? filmData.Runtime : undefined,
        language: filmData.Language !== 'N/A' ? filmData.Language : undefined,
        country: filmData.Country !== 'N/A' ? filmData.Country : undefined,
        awards: filmData.Awards !== 'N/A' ? filmData.Awards : undefined,
        type: filmData.Type
      };

      if (existingFilm) {
        // Update existing film with detailed info
        const [updatedFilm] = await db
          .update(films)
          .set({
            ...detailedFilmData,
            updatedAt: new Date()
          })
          .where(eq(films.id, existingFilm.id))
          .returning();

        return updatedFilm;
      } else {
        // Create new film with detailed info
        const [newFilm] = await db
          .insert(films)
          .values(detailedFilmData)
          .returning();

        return newFilm;
      }
    } catch (error) {
      console.error('Error fetching film details:', error);
      return existingFilm;
    }
  }

  static async updateFilm(id: number, updates: Partial<Omit<Film, 'id' | 'createdAt'>>): Promise<Film | undefined> {
    const [updatedFilm] = await db
      .update(films)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(films.id, id))
      .returning();

    return updatedFilm;
  }

  static async deleteFilm(id: number): Promise<boolean> {
    const result = await db
      .delete(films)
      .where(eq(films.id, id));

    return result.length > 0;
  }
}
