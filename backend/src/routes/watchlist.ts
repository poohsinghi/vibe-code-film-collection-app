import { Response, Router } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// Get user's watchlist
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT w.*, f.title, f.year, f.poster_url, f.genre, f.director, f.rating as film_rating
      FROM watchlist w
      JOIN films f ON w.film_id = f.id
      WHERE w.user_id = $1
    `;
    
    const queryParams: any[] = [userId];

    if (status) {
      query += ' AND w.status = $2';
      queryParams.push(status);
    }

    query += ' ORDER BY w.added_at DESC';
    
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    res.json({
      watchlist: result.rows,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add film to watchlist
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { filmId, status = 'want_to_watch' } = req.body;

    if (!filmId) {
      return res.status(400).json({ error: 'Film ID is required' });
    }

    // Check if film exists
    const filmExists = await pool.query('SELECT id FROM films WHERE id = $1', [filmId]);
    if (filmExists.rows.length === 0) {
      return res.status(404).json({ error: 'Film not found' });
    }

    // Check if already in watchlist
    const existingEntry = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = $1 AND film_id = $2',
      [userId, filmId]
    );

    if (existingEntry.rows.length > 0) {
      return res.status(409).json({ error: 'Film already in watchlist' });
    }

    // Add to watchlist
    const result = await pool.query(
      'INSERT INTO watchlist (user_id, film_id, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, filmId, status]
    );

    res.status(201).json({
      message: 'Film added to watchlist',
      entry: result.rows[0]
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add film to watchlist' });
  }
});

// Update watchlist entry
router.put('/:entryId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { entryId } = req.params;
    const { status, rating, review, watchedDate } = req.body;

    // Verify ownership
    const existingEntry = await pool.query(
      'SELECT id FROM watchlist WHERE id = $1 AND user_id = $2',
      [entryId, userId]
    );

    if (existingEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist entry not found' });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (rating !== undefined) {
      updates.push(`rating = $${paramCount++}`);
      values.push(rating);
    }
    if (review !== undefined) {
      updates.push(`review = $${paramCount++}`);
      values.push(review);
    }
    if (watchedDate !== undefined) {
      updates.push(`watched_date = $${paramCount++}`);
      values.push(watchedDate);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(entryId, userId);

    const query = `
      UPDATE watchlist 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Watchlist entry updated',
      entry: result.rows[0]
    });
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ error: 'Failed to update watchlist entry' });
  }
});

// Remove from watchlist
router.delete('/:entryId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { entryId } = req.params;

    const result = await pool.query(
      'DELETE FROM watchlist WHERE id = $1 AND user_id = $2 RETURNING *',
      [entryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist entry not found' });
    }

    res.json({ message: 'Film removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove film from watchlist' });
  }
});

// Get watchlist statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_films,
        COUNT(CASE WHEN status = 'watched' THEN 1 END) as watched_count,
        COUNT(CASE WHEN status = 'want_to_watch' THEN 1 END) as want_to_watch_count,
        COUNT(CASE WHEN status = 'currently_watching' THEN 1 END) as currently_watching_count,
        AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
        COUNT(CASE WHEN rating IS NOT NULL THEN 1 END) as rated_count
      FROM watchlist 
      WHERE user_id = $1
    `, [userId]);

    const genreStats = await pool.query(`
      SELECT f.genre, COUNT(*) as count
      FROM watchlist w
      JOIN films f ON w.film_id = f.id
      WHERE w.user_id = $1 AND w.status = 'watched'
      GROUP BY f.genre
      ORDER BY count DESC
      LIMIT 10
    `, [userId]);

    res.json({
      overview: stats.rows[0],
      topGenres: genreStats.rows
    });
  } catch (error) {
    console.error('Watchlist stats error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist statistics' });
  }
});

export { router as watchlistRoutes };
