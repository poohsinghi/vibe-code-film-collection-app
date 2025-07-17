import axios from 'axios';
import { Request, Response, Router } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest, OMDBFilm, TMDBFilm } from '../types';

const router = Router();

// Search films from OMDB/TMDB
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

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
      return res.json({ films: [], totalResults: 0 });
    }

    const films = omdbResponse.data.Search.map((film: any) => ({
      imdbId: film.imdbID,
      title: film.Title,
      year: parseInt(film.Year),
      poster: film.Poster !== 'N/A' ? film.Poster : null,
      type: film.Type
    }));

    res.json({
      films,
      totalResults: parseInt(omdbResponse.data.totalResults),
      page: parseInt(page as string)
    });
  } catch (error) {
    console.error('Film search error:', error);
    res.status(500).json({ error: 'Failed to search films' });
  }
});

// Get film details by IMDB ID
router.get('/details/:imdbId', async (req: Request, res: Response) => {
  try {
    const { imdbId } = req.params;

    // Check if film exists in our database
    const existingFilm = await pool.query('SELECT * FROM films WHERE imdb_id = $1', [imdbId]);
    
    if (existingFilm.rows.length > 0) {
      return res.json(existingFilm.rows[0]);
    }

    // Fetch from OMDB API
    const omdbResponse = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: process.env.OMDB_API_KEY,
        i: imdbId,
        plot: 'full'
      }
    });

    if (omdbResponse.data.Response === 'False') {
      return res.status(404).json({ error: 'Film not found' });
    }

    const omdbData: OMDBFilm = omdbResponse.data;

    // Save to database
    const result = await pool.query(
      `INSERT INTO films (imdb_id, title, year, genre, director, plot, poster_url, rating, runtime)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        omdbData.imdbID,
        omdbData.Title,
        parseInt(omdbData.Year),
        omdbData.Genre,
        omdbData.Director,
        omdbData.Plot,
        omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
        parseFloat(omdbData.imdbRating) || null,
        omdbData.Runtime ? parseInt(omdbData.Runtime.replace(' min', '')) : null
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Film details error:', error);
    res.status(500).json({ error: 'Failed to fetch film details' });
  }
});

// Get trending films (requires TMDB API)
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const { timeWindow = 'week' } = req.query;

    if (!process.env.TMDB_API_KEY) {
      return res.status(503).json({ error: 'TMDB API not configured' });
    }

    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/${timeWindow}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY
        }
      }
    );

    const films = tmdbResponse.data.results.map((film: TMDBFilm) => ({
      tmdbId: film.id,
      title: film.title,
      year: film.release_date ? new Date(film.release_date).getFullYear() : null,
      overview: film.overview,
      poster: film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : null,
      rating: film.vote_average,
      genreIds: film.genre_ids
    }));

    res.json({ films });
  } catch (error) {
    console.error('Trending films error:', error);
    res.status(500).json({ error: 'Failed to fetch trending films' });
  }
});

// Get film recommendations based on user's watched films
router.get('/recommendations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get user's favorite genres from watched films
    const userGenres = await pool.query(`
      SELECT f.genre, COUNT(*) as count
      FROM watchlist w
      JOIN films f ON w.film_id = f.id
      WHERE w.user_id = $1 AND w.status = 'watched' AND w.rating >= 7
      GROUP BY f.genre
      ORDER BY count DESC
      LIMIT 3
    `, [userId]);

    if (userGenres.rows.length === 0) {
      return res.json({ films: [], message: 'Not enough data for recommendations' });
    }

    // Get films from user's favorite genres that they haven't watched
    const recommendations = await pool.query(`
      SELECT f.*, 
             CASE WHEN w.id IS NOT NULL THEN true ELSE false END as in_watchlist
      FROM films f
      LEFT JOIN watchlist w ON f.id = w.film_id AND w.user_id = $1
      WHERE f.genre LIKE ANY($2) 
        AND w.id IS NULL
        AND f.rating >= 7.0
      ORDER BY f.rating DESC, RANDOM()
      LIMIT 20
    `, [userId, userGenres.rows.map(g => `%${g.genre}%`)]);

    res.json({ films: recommendations.rows });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export { router as filmRoutes };
