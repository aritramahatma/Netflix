import { Hono } from 'hono';
import { getTMDBData } from './tmdb';

export function setupRoutes(app: Hono) {
  app.get('/api/movies/popular', async (c) => {
    const data = await getTMDBData('movie/popular');
    return c.json(data);
  });

  app.get('/api/movies/trending', async (c) => {
    const data = await getTMDBData('trending/movie/week');
    return c.json(data);
  });

  app.get('/api/movies/:id', async (c) => {
    const id = c.param('id');
    const data = await getTMDBData(`movie/${id}`);
    return c.json(data);
  });

  app.get('/api/movies/:id/similar', async (c) => {
    const id = c.param('id');
    const data = await getTMDBData(`movie/${id}/similar`);
    return c.json(data);
  });

  app.get('/api/movies/:id/credits', async (c) => {
    const id = c.param('id');
    const data = await getTMDBData(`movie/${id}/credits`);
    return c.json(data);
  });

  app.get('/api/genres', async (c) => {
    const data = await getTMDBData('genre/movie/list');
    return c.json(data);
  });
}