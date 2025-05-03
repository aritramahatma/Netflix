import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import BackToTop from '@/components/BackToTop';
import { fetchMovieById, fetchMovieCredits, fetchSimilarMovies, addToWatchHistory } from '@/lib/api';
import { getPosterUrl, getBackdropUrl, getProfileUrl, formatRuntime, getYearFromDate } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { useToast } from '@/hooks/use-toast';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch movie details
  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useQuery({
    queryKey: [`/api/movies/${id}`],
    queryFn: () => fetchMovieById(id),
  });

  // Fetch movie credits
  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: [`/api/movies/${id}/credits`],
    queryFn: () => fetchMovieCredits(id),
    enabled: !!movie,
  });

  // Fetch similar movies
  const { data: similarMovies, isLoading: isLoadingSimilar } = useQuery({
    queryKey: [`/api/movies/${id}/similar`],
    queryFn: () => fetchSimilarMovies(id),
    enabled: !!movie,
  });

  const isLoading = isLoadingMovie || isLoadingCredits || isLoadingSimilar;

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

  if (movieError) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Header />
        <MobileMenu />
        <main className="container mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <i className="fas fa-exclamation-triangle text-netflix-red text-5xl mb-4"></i>
            <h1 className="text-white text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-gray-400 mb-8">We couldn't find the movie you're looking for.</p>
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
        {isLoading ? (
          <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : movie ? (
          <>
            {/* Movie Backdrop */}
            <div className="relative rounded-lg overflow-hidden mb-8" style={{ height: '50vh', minHeight: '400px' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
              <img 
                src={getBackdropUrl(movie.backdrop_path, 'w1280')} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Movie Info */}
            <div className="flex flex-col md:flex-row -mt-32 relative z-20 mb-10">
              <div className="md:w-1/3 lg:w-1/4 mb-6 md:mb-0 flex-shrink-0">
                <img 
                  src={getPosterUrl(movie.poster_path, 'w500')} 
                  alt={movie.title} 
                  className="rounded-lg shadow-lg max-w-full md:max-w-xs mx-auto"
                />
              </div>
              <div className="md:w-2/3 lg:w-3/4 md:pl-8">
                <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-gray-300">{getYearFromDate(movie.release_date)}</span>
                  {movie.runtime && <span className="text-gray-300">• {formatRuntime(movie.runtime)}</span>}
                  <span className="bg-netflix-red text-white px-2 py-0.5 text-xs rounded">
                    {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-white text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300">{movie.overview}</p>
                </div>
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-xl font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map(genre => (
                        <span key={genre.id} className="bg-netflix-gray text-white px-3 py-1 rounded-full text-sm">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    className="bg-netflix-red hover:bg-opacity-80 text-white py-2 px-5 rounded flex items-center transition"
                    onClick={() => handleWatchClick(parseInt(id))}
                  >
                    <i className="fas fa-play mr-2"></i> Watch on Telegram
                  </button>
                </div>
              </div>
            </div>
            
            {/* Cast */}
            {credits && credits.cast && credits.cast.length > 0 && (
              <div className="mb-10">
                <h3 className="text-white text-2xl font-bold mb-4">Cast</h3>
                <div className="cast-scroll flex gap-4 pb-4">
                  {credits.cast.slice(0, 10).map(person => (
                    <div key={person.id} className="flex-shrink-0 w-32">
                      <img 
                        src={getProfileUrl(person.profile_path)} 
                        alt={`${person.name}`} 
                        className="w-full h-auto rounded-lg mb-2"
                      />
                      <h4 className="text-white text-sm font-medium">{person.name}</h4>
                      <p className="text-gray-400 text-xs">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Similar Movies */}
            {similarMovies && similarMovies.results && similarMovies.results.length > 0 && (
              <div>
                <h3 className="text-white text-2xl font-bold mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {similarMovies.results.slice(0, 10).map(movie => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      onWatchClick={handleWatchClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
      
      <BackToTop />
    </div>
  );
};

export default MoviePage;
