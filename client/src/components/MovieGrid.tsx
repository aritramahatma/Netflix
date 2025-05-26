import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchTrendingMovies, 
  fetchPopularMovies, 
  fetchMoviesByGenre, 
  fetchAllMovies,
  getStreamingUrl
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

  // Fetching data with proper query handling
  const fetchData = async () => {
    try {
      if (type === 'trending') {
        return await fetchTrendingMovies(recentOnly);
      } else if (type === 'popular') {
        return await fetchPopularMovies(minRating);
      } else if (type === 'genre') {
        return await fetchMoviesByGenre(genreId!);
      } else if (type === 'discover') {
        return await fetchAllMovies();
      }
      return { results: [] };
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  };

  const { data: movieData, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchData
  });

  // Extract movies array from data safely
  const movies = movieData?.results || [];

  const handleWatchClick = async (movieId: number) => {
    try {
      const streamingUrl = await getStreamingUrl(movieId);
      if (streamingUrl) {
        //Open the video in a new tab or use a video player component
        window.open(streamingUrl, '_blank');
        toast({ title: "Playing movie...", description: "" });
      } else {
        toast({ title: "Error", description: "Streaming URL not found for this movie.", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get streaming URL.",
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
          {movies.map((movie: any) => (
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