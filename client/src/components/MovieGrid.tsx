
import MovieCard from './MovieCard';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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
  
  // State for expanded view and pagination
  const [isExpanded, setIsExpanded] = useState(false);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Create query key based on type and filters
  let queryKey: any[] = [];
  let expandedQueryKey: any[] = [];

  if (type === 'trending') {
    queryKey = ['/api/movies/trending', recentOnly];
    expandedQueryKey = ['/api/movies/trending', recentOnly, page];
  } else if (type === 'popular') {
    queryKey = ['/api/movies/popular', minRating];
    expandedQueryKey = ['/api/movies/popular', minRating, page];
  } else if (type === 'genre') {
    queryKey = ['/api/movies/genre', genreId];
    expandedQueryKey = ['/api/movies/genre', genreId, page];
  } else {
    queryKey = ['/api/movies/discover'];
    expandedQueryKey = ['/api/movies/discover', page];
  }

  // Fetching initial data
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

  // Query for loading more movies when expanded
  const fetchExpandedData = async () => {
    try {
      if (type === 'trending') {
        return await fetchTrendingMovies(recentOnly, page);
      } else if (type === 'popular') {
        return await fetchPopularMovies(minRating, page);
      } else if (type === 'genre') {
        return await fetchMoviesByGenre(genreId!, page);
      } else if (type === 'discover') {
        return await fetchAllMovies(page);
      }
      return { results: [] };
    } catch (error) {
      console.error("Error fetching expanded movies:", error);
      throw error;
    }
  };

  const { data: movieData, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchData
  });

  const { data: expandedData } = useQuery({
    queryKey: expandedQueryKey,
    queryFn: fetchExpandedData,
    enabled: isExpanded && page > 1,
  });

  // Extract movies array from data safely
  const movies = movieData?.results || [];

  // Effects to handle expanded state and pagination
  useEffect(() => {
    if (isExpanded && movieData?.results) {
      setAllMovies(movieData.results);
      setHasMore(movieData.total_pages > 1);
    }
  }, [isExpanded, movieData]);

  useEffect(() => {
    if (expandedData?.results && page > 1) {
      setAllMovies(prev => [...prev, ...expandedData.results]);
      setHasMore(page < expandedData.total_pages && allMovies.length < 100);
      setIsLoadingMore(false);
    }
  }, [expandedData, page]);

  // Scroll event listener for infinite scroll when expanded
  useEffect(() => {
    if (!isExpanded) return;

    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded, isLoadingMore, hasMore, allMovies.length]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore && allMovies.length < 100) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const handleWatchClick = async (movieId: number) => {
    try {
      const streamingUrl = await getStreamingUrl(movieId);
      if (streamingUrl) {
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

  // Update View All button to handle inline expansion
  const handleShowAll = () => {
    setIsExpanded(true);
    setPage(1);
  };

  // Show Less functionality
  const handleShowLess = () => {
    setIsExpanded(false);
    setAllMovies([]);
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  };

  const displayMovies = isExpanded ? allMovies : movies;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        {viewAllLink && !isExpanded && (
          <button 
            onClick={handleShowAll}
            className="text-gray-400 hover:text-netflix-red text-sm transition cursor-pointer"
          >
            Show All
          </button>
        )}
        {isExpanded && (
          <button 
            onClick={handleShowLess}
            className="text-gray-400 hover:text-netflix-red text-sm transition cursor-pointer"
          >
            Show Less
          </button>
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

      {/* Update movies grid to show expanded content */}
      {displayMovies && displayMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayMovies.slice(0, isExpanded ? 100 : displayMovies.length).map((movie: any, index: number) => (
            <MovieCard 
              key={`${type}-${movie.id}-${index}`} 
              movie={movie} 
              onWatchClick={handleWatchClick} 
            />
          ))}
        </div>
      )}

      {/* Loading more indicator for expanded view */}
      {isExpanded && isLoadingMore && hasMore && (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* End of results message for expanded view */}
      {isExpanded && (allMovies.length >= 100 || !hasMore) && allMovies.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-400">
            {allMovies.length >= 100 ? (
              <>Showing top <span style={{ color: '#E50914', fontWeight: 'bold' }}>100</span> {title.toLowerCase()}</>
            ) : (
              "You've reached the end!"
            )}
          </p>
        </div>
      )}

      {displayMovies && displayMovies.length === 0 && !isLoading && !error && (
        <div className="bg-netflix-dark p-8 rounded-lg text-center">
          <i className="fas fa-film text-netflix-red text-4xl mb-4"></i>
          <p className="text-white text-lg">No movies found.</p>
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
