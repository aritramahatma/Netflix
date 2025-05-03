import { apiRequest } from "./queryClient";

// API routes for movies
export const fetchTrendingMovies = async () => {
  const res = await fetch('/api/movies/trending');
  if (!res.ok) throw new Error('Failed to fetch trending movies');
  return res.json();
};

export const fetchMovieById = async (id: string) => {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch movie with id ${id}`);
  return res.json();
};

export const fetchMoviesByGenre = async (genreId: string) => {
  const res = await fetch(`/api/movies/genre/${genreId}`);
  if (!res.ok) throw new Error(`Failed to fetch movies for genre ${genreId}`);
  return res.json();
};

export const fetchPopularMovies = async () => {
  const res = await fetch('/api/movies/popular');
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
};

export const fetchSimilarMovies = async (movieId: string) => {
  const res = await fetch(`/api/movies/${movieId}/similar`);
  if (!res.ok) throw new Error(`Failed to fetch similar movies for ${movieId}`);
  return res.json();
};

export const fetchMovieCredits = async (movieId: string) => {
  const res = await fetch(`/api/movies/${movieId}/credits`);
  if (!res.ok) throw new Error(`Failed to fetch movie credits for ${movieId}`);
  return res.json();
};

export const searchMovies = async (query: string) => {
  const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search movies');
  return res.json();
};

export const fetchGenres = async () => {
  const res = await fetch('/api/genres');
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
};

export const addToWatchHistory = async (movieId: number) => {
  return apiRequest('POST', '/api/watch-history', { movieId });
};

export const getWatchHistory = async () => {
  const res = await fetch('/api/watch-history');
  if (!res.ok) throw new Error('Failed to fetch watch history');
  return res.json();
};
