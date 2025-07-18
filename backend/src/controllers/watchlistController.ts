import { Response } from 'express';
import { WatchStatus } from '../db/schema';
import { WatchlistService } from '../services/watchlistService';
import { AuthRequest } from '../types';

export class WatchlistController {
  static async getWatchlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { status } = req.query;

      const watchlist = await WatchlistService.getUserWatchlist(
        userId,
        status as WatchStatus
      );

      res.json({ watchlist });
    } catch (error) {
      console.error('Get watchlist error:', error);
      res.status(500).json({ error: 'Failed to get watchlist' });
    }
  }

  static async addToWatchlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { filmId, status = 'want_to_watch' } = req.body;

      if (!filmId) {
        res.status(400).json({ error: 'Film ID is required' });
        return;
      }

      const watchlistItem = await WatchlistService.addToWatchlist(
        userId,
        parseInt(filmId),
        status as WatchStatus
      );

      res.status(201).json({
        message: 'Film added to watchlist',
        item: watchlistItem
      });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ error: 'Failed to add film to watchlist' });
    }
  }

  static async updateWatchlistItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { filmId } = req.params;
      const { status, personalRating, notes, watchedDate } = req.body;

      const filmIdNum = parseInt(filmId);
      if (isNaN(filmIdNum)) {
        res.status(400).json({ error: 'Invalid film ID' });
        return;
      }

      const updates: any = {};
      if (status) updates.status = status;
      if (personalRating) updates.personalRating = parseInt(personalRating);
      if (notes) updates.notes = notes;
      if (watchedDate) updates.watchedDate = new Date(watchedDate);

      const updatedItem = await WatchlistService.updateWatchlistItem(
        userId,
        filmIdNum,
        updates
      );

      if (!updatedItem) {
        res.status(404).json({ error: 'Watchlist item not found' });
        return;
      }

      res.json({
        message: 'Watchlist item updated',
        item: updatedItem
      });
    } catch (error) {
      console.error('Update watchlist item error:', error);
      res.status(500).json({ error: 'Failed to update watchlist item' });
    }
  }

  static async removeFromWatchlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { filmId } = req.params;

      const filmIdNum = parseInt(filmId);
      if (isNaN(filmIdNum)) {
        res.status(400).json({ error: 'Invalid film ID' });
        return;
      }

      const removed = await WatchlistService.removeFromWatchlist(userId, filmIdNum);

      if (!removed) {
        res.status(404).json({ error: 'Watchlist item not found' });
        return;
      }

      res.json({ message: 'Film removed from watchlist' });
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      res.status(500).json({ error: 'Failed to remove film from watchlist' });
    }
  }

  static async getWatchlistStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      
      const stats = await WatchlistService.getWatchlistStats(userId);
      
      res.json({ stats });
    } catch (error) {
      console.error('Get watchlist stats error:', error);
      res.status(500).json({ error: 'Failed to get watchlist stats' });
    }
  }

  static async getRecentActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { limit = 10 } = req.query;
      
      const recentActivity = await WatchlistService.getRecentActivity(
        userId,
        parseInt(limit as string) || 10
      );
      
      res.json({ recentActivity });
    } catch (error) {
      console.error('Get recent activity error:', error);
      res.status(500).json({ error: 'Failed to get recent activity' });
    }
  }
}
