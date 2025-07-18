import { and, desc, eq, SQL } from 'drizzle-orm';
import { db } from '../db';
import { films, watchlist, type Watchlist, type WatchStatus } from '../db/schema';

export interface WatchlistWithFilm extends Watchlist {
  film: {
    id: number;
    title: string;
    year: number | null;
    genre: string | null;
    poster: string | null;
    imdbRating: string | null;
  };
}

export class WatchlistService {
  static async addToWatchlist(
    userId: number,
    filmId: number,
    status: WatchStatus = 'want_to_watch'
  ): Promise<Watchlist> {
    // Check if already in watchlist
    const existing = await this.getWatchlistItem(userId, filmId);
    
    if (existing) {
      // Update existing entry
      const [updated] = await db
        .update(watchlist)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(and(
          eq(watchlist.userId, userId),
          eq(watchlist.filmId, filmId)
        ))
        .returning();
      
      return updated;
    }

    // Create new watchlist entry
    const [newEntry] = await db
      .insert(watchlist)
      .values({
        userId,
        filmId,
        status
      })
      .returning();

    return newEntry;
  }

  static async getWatchlistItem(userId: number, filmId: number): Promise<Watchlist | undefined> {
    const [item] = await db
      .select()
      .from(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.filmId, filmId)
      ))
      .limit(1);

    return item;
  }

  static async getUserWatchlist(
    userId: number,
    status?: WatchStatus
  ): Promise<WatchlistWithFilm[]> {
    let whereClause: SQL<unknown> = eq(watchlist.userId, userId);
    
    if (status) {
      whereClause = and(
        eq(watchlist.userId, userId),
        eq(watchlist.status, status)
      )!;
    }

    return await db
      .select({
        id: watchlist.id,
        userId: watchlist.userId,
        filmId: watchlist.filmId,
        status: watchlist.status,
        personalRating: watchlist.personalRating,
        notes: watchlist.notes,
        watchedDate: watchlist.watchedDate,
        createdAt: watchlist.createdAt,
        updatedAt: watchlist.updatedAt,
        film: {
          id: films.id,
          title: films.title,
          year: films.year,
          genre: films.genre,
          poster: films.poster,
          imdbRating: films.imdbRating
        }
      })
      .from(watchlist)
      .innerJoin(films, eq(watchlist.filmId, films.id))
      .where(whereClause)
      .orderBy(desc(watchlist.createdAt));
  }

  static async updateWatchlistItem(
    userId: number,
    filmId: number,
    updates: Partial<Pick<Watchlist, 'status' | 'personalRating' | 'notes' | 'watchedDate'>>
  ): Promise<Watchlist | undefined> {
    const [updated] = await db
      .update(watchlist)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.filmId, filmId)
      ))
      .returning();

    return updated;
  }

  static async removeFromWatchlist(userId: number, filmId: number): Promise<boolean> {
    const result = await db
      .delete(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.filmId, filmId)
      ));

    return result.length > 0;
  }

  static async getWatchlistStats(userId: number): Promise<{
    totalFilms: number;
    wantToWatch: number;
    watching: number;
    watched: number;
  }> {
    const userWatchlist = await this.getUserWatchlist(userId);
    
    const stats = userWatchlist.reduce((acc, item) => {
      acc.totalFilms++;
      
      switch (item.status) {
        case 'want_to_watch':
          acc.wantToWatch++;
          break;
        case 'watching':
          acc.watching++;
          break;
        case 'watched':
          acc.watched++;
          break;
      }
      
      return acc;
    }, {
      totalFilms: 0,
      wantToWatch: 0,
      watching: 0,
      watched: 0
    });

    return stats;
  }

  static async getRecentActivity(userId: number, limit: number = 10): Promise<WatchlistWithFilm[]> {
    return await db
      .select({
        id: watchlist.id,
        userId: watchlist.userId,
        filmId: watchlist.filmId,
        status: watchlist.status,
        personalRating: watchlist.personalRating,
        notes: watchlist.notes,
        watchedDate: watchlist.watchedDate,
        createdAt: watchlist.createdAt,
        updatedAt: watchlist.updatedAt,
        film: {
          id: films.id,
          title: films.title,
          year: films.year,
          genre: films.genre,
          poster: films.poster,
          imdbRating: films.imdbRating
        }
      })
      .from(watchlist)
      .innerJoin(films, eq(watchlist.filmId, films.id))
      .where(eq(watchlist.userId, userId))
      .orderBy(desc(watchlist.updatedAt))
      .limit(limit);
  }
}
