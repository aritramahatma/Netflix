import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies = [] }: MovieGridProps) {
  if (!movies) return null;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}