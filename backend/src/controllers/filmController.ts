import { Request, Response } from 'express';
import { FilmService } from '../services/filmService';
import { AuthRequest } from '../types';

export class FilmController {
  static async searchFilms(req: Request, res: Response): Promise<void> {
    try {
      const { q, page = 1 } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const pageNum = parseInt(page as string) || 1;
      const result = await FilmService.searchFilms(q, pageNum);

      res.json(result);
    } catch (error) {
      console.error('Film search error:', error);
      res.status(500).json({ error: 'Failed to search films' });
    }
  }

  static async getPopularFilms(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20 } = req.query;
      const limitNum = parseInt(limit as string) || 20;
      
      const films = await FilmService.getPopularFilms(limitNum);
      
      res.json({ films });
    } catch (error) {
      console.error('Get popular films error:', error);
      res.status(500).json({ error: 'Failed to get popular films' });
    }
  }

  static async getFilmById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const filmId = parseInt(id);

      if (isNaN(filmId)) {
        res.status(400).json({ error: 'Invalid film ID' });
        return;
      }

      const film = await FilmService.getFilmById(filmId);
      
      if (!film) {
        res.status(404).json({ error: 'Film not found' });
        return;
      }

      res.json({ film });
    } catch (error) {
      console.error('Get film error:', error);
      res.status(500).json({ error: 'Failed to get film' });
    }
  }

  static async getFilmDetails(req: Request, res: Response): Promise<void> {
    try {
      const { imdbId } = req.params;

      if (!imdbId) {
        res.status(400).json({ error: 'IMDB ID is required' });
        return;
      }

      const film = await FilmService.getFilmDetails(imdbId);
      
      if (!film) {
        res.status(404).json({ error: 'Film not found' });
        return;
      }

      res.json({ film });
    } catch (error) {
      console.error('Get film details error:', error);
      res.status(500).json({ error: 'Failed to get film details' });
    }
  }

  static async getRecommendations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      
      // For now, return popular films as recommendations
      // In the future, this could use a more sophisticated recommendation algorithm
      const films = await FilmService.getPopularFilms(10);
      
      res.json({ 
        films,
        message: 'Recommendations based on popular films'
      });
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
}
