import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchTrendingMovies, 
  fetchPopularMovies, 
  fetchMoviesByGenre, 
  fetchAllMovies,
  addToWatchHistory 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface FilterParams {
  recentOnly?: boolean;
  minRating?: number;
}

interface MovieGridProps {
  title: string;
  viewAllLink?: string;
  type: 'trending' | 'popular' | 'genre' | 'discover';
  genreId?: string;
  filterParams?: FilterParams;
}

const MovieGrid = ({ 
  title, 
  viewAllLink, 
  type, 
  genreId, 
  filterParams = {} 
}: MovieGridProps) => {
  const { toast } = useToast();
  const { recentOnly, minRating } = filterParams;

  // Create query key based on type and filters
  let queryKey: any[] = [];
  
  if (type === 'trending') {
    queryKey = ['/api/movies/trending', recentOnly];
  } else if (type === 'popular') {
    queryKey = ['/api/movies/popular', minRating];
  } else if (type === 'genre') {
    queryKey = ['/api/movies/genre', genreId];
  } else {
    queryKey = ['/api/movies/discover'];
  }

  // Create fetch function based on type and filters
  const getFetchFn = () => {
    if (type === 'trending') {
      return () => fetchTrendingMovies(recentOnly);
    } else if (type === 'popular') {
      return () => fetchPopularMovies(minRating);
    } else if (type === 'genre') {
      return () => fetchMoviesByGenre(genreId!);
    } else {
      return fetchAllMovies;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: getFetchFn(),
  });
  
  // Extract movies array from data
  const movies = data?.results || [];

  const handleWatchClick = async (movieId: number) => {
    try {
      await addToWatchHistory(movieId);
      
      // Open Telegram bot in new tab
      window.open(`https://t.me/your_movie_bot?start=${movieId}`, '_blank');
      
      toast({
        title: "Movie added to watch history",
        description: "Opening Telegram bot to watch the movie.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add movie to watch history.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-gray-400 hover:text-netflix-red text-sm transition">
            View All
          </a>
        )}
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-netflix-dark p-8 rounded-lg text-center">
          <i className="fas fa-exclamation-triangle text-netflix-red text-4xl mb-4"></i>
          <p className="text-white text-lg">Failed to load movies.</p>
          <p className="text-gray-400 mt-2">Please try again later.</p>
        </div>
      )}
      
      {movies && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onWatchClick={handleWatchClick} 
            />
          ))}
        </div>
      )}
      
      {movies && movies.length === 0 && !isLoading && !error && (
        <div className="bg-netflix-dark p-8 rounded-lg text-center">
          <i className="fas fa-film text-netflix-red text-4xl mb-4"></i>
          <p className="text-white text-lg">No movies found.</p>
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
