import { Router } from 'express';
import { FilmController } from '../controllers/filmController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/search', FilmController.searchFilms);
router.get('/popular', FilmController.getPopularFilms);
router.get('/:id', FilmController.getFilmById);
router.get('/details/:imdbId', FilmController.getFilmDetails);

// Protected routes
router.get('/recommendations', authenticateToken, FilmController.getRecommendations);

export default router;
