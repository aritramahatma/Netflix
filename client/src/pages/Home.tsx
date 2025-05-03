import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import HeroSection from '@/components/HeroSection';
import MovieGrid from '@/components/MovieGrid';
import GenreSelector from '@/components/GenreSelector';
import BackToTop from '@/components/BackToTop';
import InfiniteScroll from '@/components/InfiniteScroll';
import { fetchTrendingMovies, addToWatchHistory } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const Home = () => {
  const { toast } = useToast();
  const [location] = useLocation();
  const [section, setSection] = useState<string | null>(null);

  // Extract section parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    setSection(params.get('section'));
  }, [location]);

  // Fetch trending movies for hero section
  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ['/api/movies/trending'],
    queryFn: fetchTrendingMovies,
  });

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
        
        {/* Movie Sections */}
        {(section === null || section === 'trending') && (
          <MovieGrid 
            title="Trending Now" 
            viewAllLink="/?section=trending" 
            type="trending" 
          />
        )}
        
        {(section === null || section === 'genres') && (
          <GenreSelector />
        )}
        
        {(section === null || section === 'popular') && (
          <MovieGrid 
            title="Popular Movies" 
            viewAllLink="/?section=popular" 
            type="popular" 
          />
        )}
        
        {section === 'trending' && (
          <InfiniteScroll 
            queryKey={['/api/movies/trending']}
            fetchFn={(page) => fetch(`/api/movies/trending?page=${page}`).then(res => res.json())}
            title="All Trending Movies"
          />
        )}
        
        {section === 'popular' && (
          <InfiniteScroll 
            queryKey={['/api/movies/popular']}
            fetchFn={(page) => fetch(`/api/movies/popular?page=${page}`).then(res => res.json())}
            title="All Popular Movies"
          />
        )}
      </main>
      
      <BackToTop />
    </div>
  );
};

export default Home;
