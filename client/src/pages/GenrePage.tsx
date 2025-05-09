import { useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import BackToTop from '@/components/BackToTop';
import InfiniteScroll from '@/components/InfiniteScroll';
import { fetchMoviesByGenre, fetchGenres } from '@/lib/api';

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch genre details
  const { data: genres, isLoading: isLoadingGenres, error: genreError } = useQuery({
    queryKey: ['/api/genres'],
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Find the current genre name
  const currentGenre = genres?.find(g => g.id.toString() === id);

  // Handle errors
  if (genreError) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Header />
        <MobileMenu />
        <main className="container mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <i className="fas fa-exclamation-triangle text-netflix-red text-5xl mb-4"></i>
            <h1 className="text-white text-2xl font-bold mb-4">Error Loading Genres</h1>
            <p className="text-gray-400 mb-8">We couldn't load the genre information. Please try again later.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-netflix-red hover:bg-opacity-80 text-white py-2 px-6 rounded transition"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      <MobileMenu />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {isLoadingGenres ? (
          <div className="py-10">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-white text-3xl font-bold mb-2">
                {currentGenre ? currentGenre.name : 'Unknown'} Movies
              </h1>
              <p className="text-gray-400">
                Explore our collection of {currentGenre ? currentGenre.name.toLowerCase() : ''} movies
              </p>
            </div>
            
            <InfiniteScroll 
              queryKey={['/api/movies/genre', id]}
              fetchFn={(page) => fetch(`/api/movies/genre/${id}?page=${page}`).then(res => res.json())}
              title="" // No title needed as we have a heading above
            />
          </>
        )}
      </main>
      
      <BackToTop />
    </div>
  );
};

export default GenrePage;
