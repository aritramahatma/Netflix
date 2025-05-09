import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import MobileMenu from '@/components/MobileMenu';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import GenreSelector from '@/components/GenreSelector';
import BackToTop from '@/components/BackToTop';
import { 
  fetchTrendingMovies, 
  fetchPopularMovies,
  fetchAllMovies,
  addToWatchHistory 
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const Home = () => {
  const { toast } = useToast();
  const [location] = useLocation();
  const [section, setSection] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Extract section parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    setSection(params.get('section'));
  }, [location]);

  // Fetch trending movies for hero section
  const { data: trendingMoviesData, isLoading } = useQuery({
    queryKey: ['/api/movies/trending'],
    queryFn: () => fetchTrendingMovies(),
  });

  const trendingMovies = trendingMoviesData as any;

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

  // Get a random trending movie for the hero section
  const heroMovie = trendingMovies?.results?.length > 0 
    ? trendingMovies.results[Math.floor(Math.random() * trendingMovies.results.length)]
    : null;

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      <MobileMenu />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        {isLoading ? (
          <div className="relative rounded-lg overflow-hidden flex justify-center items-center" style={{ height: '50vh', minHeight: '400px' }}>
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : heroMovie ? (
          <HeroSection movie={heroMovie} onWatchClick={handleWatchClick} />
        ) : null}

        {/* Trending Movies Section */}
        {section === null && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Trending Now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingMovies?.results?.slice(0, 5).map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} onWatchClick={handleWatchClick} />
              ))}
            </div>
          </div>
        )}

        {/* Genre Selector */}
        {section === null && (
          <div className="mb-8">
            <GenreSelector />
          </div>
        )}

        {/* Other Movies Section */}
        {section === null && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Other Movies</h2>
            <InfiniteScroll 
              queryKey={['/api/movies/discover']}
              fetchFn={(page) => fetchAllMovies(page)}
              title=""
            />
          </div>
        )}

        {/* Infinite Scroll for Sections */}
        {section === 'trending' && (
          <InfiniteScroll 
            queryKey={['/api/movies/trending', false]}
            fetchFn={(page) => fetchTrendingMovies(false, page)}
            title="All Trending Movies"
          />
        )}

        {section === 'popular' && (
          <InfiniteScroll 
            queryKey={['/api/movies/popular', 0]}
            fetchFn={(page) => fetchPopularMovies(0, page)}
            title="All Popular Movies"
          />
        )}

        {section === 'others' && (
          <InfiniteScroll 
            queryKey={['/api/movies/discover']}
            fetchFn={(page) => fetchAllMovies(page)}
            title="Other Movies"
          />
        )}
      </main>

      <BackToTop />
    </div>
  );
};

export default Home;