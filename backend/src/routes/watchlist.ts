import { Router } from 'express';
import { WatchlistController } from '../controllers/watchlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All watchlist routes require authentication
router.use(authenticateToken);

// Watchlist routes
router.get('/', WatchlistController.getWatchlist);
router.post('/', WatchlistController.addToWatchlist);
router.put('/:filmId', WatchlistController.updateWatchlistItem);
router.delete('/:filmId', WatchlistController.removeFromWatchlist);
router.get('/stats', WatchlistController.getWatchlistStats);
router.get('/recent', WatchlistController.getRecentActivity);

export default router;
