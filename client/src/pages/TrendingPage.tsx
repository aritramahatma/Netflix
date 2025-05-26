
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { fetchTrendingMovies, addToWatchHistory } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const TrendingPage = () => {
  const { toast } = useToast();
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch initial trending movies
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['/api/movies/trending', 1],
    queryFn: () => fetchTrendingMovies(false, 1),
  });

  // Load more movies when page changes
  const { data: moreData } = useQuery({
    queryKey: ['/api/movies/trending', page],
    queryFn: () => fetchTrendingMovies(false, page),
    enabled: page > 1,
  });

  // Handle initial data
  useEffect(() => {
    if (initialData?.results) {
      setAllMovies(initialData.results);
      setHasMore(initialData.total_pages > 1);
    }
  }, [initialData]);

  // Handle loading more data
  useEffect(() => {
    if (moreData?.results && page > 1) {
      setAllMovies(prev => [...prev, ...moreData.results]);
      setHasMore(page < moreData.total_pages && allMovies.length < 100);
      setIsLoadingMore(false);
    }
  }, [moreData, page]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore && allMovies.length < 100) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const handleWatchClick = async (movieId: number) => {
    try {
      await addToWatchHistory(movieId);
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

  // Scroll event listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, allMovies.length]);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      <MobileMenu />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Trending Movies
          </h1>
          <p className="text-gray-400">
            Explore our collection of trending movies
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(20).fill(0).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-netflix-dark p-8 rounded-lg text-center">
            <i className="fas fa-exclamation-triangle text-netflix-red text-4xl mb-4"></i>
            <p className="text-white text-lg">Failed to load trending movies.</p>
            <p className="text-gray-400 mt-2">Please try again later.</p>
          </div>
        )}

        {allMovies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allMovies.slice(0, 100).map((movie: any) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onWatchClick={handleWatchClick} 
              />
            ))}
          </div>
        )}

        {/* Loading more indicator */}
        {isLoadingMore && hasMore && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* End of results message */}
        {(allMovies.length >= 100 || !hasMore) && allMovies.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-400">
              {allMovies.length >= 100 ? "Showing top 100 trending movies" : "You've reached the end!"}
            </p>
          </div>
        )}

        {allMovies.length === 0 && !isLoading && !error && (
          <div className="bg-netflix-dark p-8 rounded-lg text-center">
            <i className="fas fa-film text-netflix-red text-4xl mb-4"></i>
            <p className="text-white text-lg">No trending movies found.</p>
          </div>
        )}
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
};

export default TrendingPage;
