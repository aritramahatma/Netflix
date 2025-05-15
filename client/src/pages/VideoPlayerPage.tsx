import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '@/lib/api';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb';
import { getYearFromDate, formatRuntime } from '@/lib/utils';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';

const VideoPlayerPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const { data: movie, isLoading } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    queryFn: () => fetchMovieById(movieId),
    staleTime: 0, // Disable caching
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Top Ad Slot */}
      <div className="w-full h-[90px] bg-netflix-gray flex items-center justify-center">
        <span className="text-gray-400">Advertisement</span>
      </div>

      {/* Video Player */}
      <div className="relative w-full h-56 md:h-[calc(100vh-270px)]">
        <iframe
          src={`https://vidsrc.to/embed/movie/${movieId}`}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
          allow="autoplay; fullscreen"
          onError={() => window.open(`https://vidsrc.to/embed/movie/${movieId}`, '_blank')}
        />
      </div>

      {/* Bottom Ad Slot */}
      <div className="w-full h-[90px] bg-netflix-gray flex items-center justify-center">
        <span className="text-gray-400">Advertisement</span>
      </div>

      {/* Similar Movies Section */}
      {movie && (
        <div className="bg-netflix-black/90 p-4 border-t border-gray-800">
          <div className="container mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Similar Movies</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            ) : movie?.similar?.results?.length > 0 || movie?.recommendations?.results?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(movie?.similar?.results?.length > 0 ? movie.similar.results : movie.recommendations.results).slice(0, 12).map((similarMovie) => (
                  <div 
                    key={similarMovie.id} 
                    className="bg-netflix-gray/20 rounded-lg overflow-hidden group relative"
                  >
                    <div className="relative aspect-[2/3]">
                      <img
                        src={getPosterUrl(similarMovie.poster_path)}
                        alt={similarMovie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={`/watch/${similarMovie.id}`}
                          className="bg-netflix-red hover:bg-netflix-red/80 text-white rounded-full w-12 h-12 flex items-center justify-center"
                        >
                          <i className="fas fa-play"></i>
                        </a>
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="text-white text-sm font-medium truncate">{similarMovie.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                        <span>{getYearFromDate(similarMovie.release_date)}</span>
                        <span className="bg-netflix-red/20 px-1.5 py-0.5 rounded">
                          {similarMovie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No similar movies found</p>
            )}
          </div>

          {/* Movie Info Section */}
          <div className="container mx-auto flex items-center gap-4 mt-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                <span>{getYearFromDate(movie.release_date)}</span>
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{formatRuntime(movie.runtime)}</span>
                  </>
                )}
                <span>•</span>
                <span className="bg-netflix-red/20 px-1.5 py-0.5 rounded text-sm font-medium">
                  {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{movie.overview}</p>
            </div>
          </div>
                <h2 className="text-xl font-bold text-white mb-4">Similar Movies</h2>
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <MovieCardSkeleton key={i} />
                    ))}
                  </div>
                ) : movie?.similar?.results?.length > 0 || movie?.recommendations?.results?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {(movie?.similar?.results?.length > 0 ? movie.similar.results : movie.recommendations.results).slice(0, 12).map((similarMovie) => (
                      <div 
                        key={similarMovie.id} 
                        className="bg-netflix-gray/20 rounded-lg overflow-hidden group relative"
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={getPosterUrl(similarMovie.poster_path)}
                            alt={similarMovie.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a 
                              href={`/watch/${similarMovie.id}`}
                              className="bg-netflix-red hover:bg-netflix-red/80 text-white rounded-full w-12 h-12 flex items-center justify-center"
                            >
                              <i className="fas fa-play"></i>
                            </a>
                          </div>
                        </div>
                        <div className="p-2">
                          <h3 className="text-white text-sm font-medium truncate">{similarMovie.title}</h3>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                            <span>{getYearFromDate(similarMovie.release_date)}</span>
                            <span className="bg-netflix-red/20 px-1.5 py-0.5 rounded">
                              {similarMovie.vote_average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No similar movies found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerPage;