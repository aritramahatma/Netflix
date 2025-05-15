import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '@/lib/api';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb';
import { getYearFromDate, formatRuntime } from '@/lib/utils';

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
          onError={() => window.open(`https://vidsrc.to/embed/movie/${movieId}`, '_blank')}
        />
      </div>

      {/* Bottom Ad Slot */}
      <div className="w-full h-[90px] bg-netflix-gray flex items-center justify-center">
        <span className="text-gray-400">Advertisement</span>
      </div>

      {/* Movie Info Section */}
      {movie && (
        <>
          <div className="bg-netflix-black/90 p-4 border-t border-gray-800">
            <div className="container mx-auto flex items-center gap-4">
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
                  <span className="bg-netflix-red px-2 py-0.5 rounded text-white">
                    {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{movie.overview}</p>

                {/* Similar Movies Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-white mb-4">More Like This</h2>
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <MovieCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : movie?.similar?.results?.length > 0 || movie?.recommendations?.results?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {(movie?.similar?.results?.length > 0 ? movie.similar.results : movie.recommendations.results).slice(0, 8).map((similarMovie) => (
                      <a 
                        href={`/watch/${similarMovie.id}`}
                        key={similarMovie.id} 
                        className="bg-netflix-gray/50 rounded-lg overflow-hidden transition-transform hover:scale-105"
                      >
                        <div className="relative group">
                          <img
                            src={getPosterUrl(similarMovie.poster_path)}
                            alt={similarMovie.title}
                            className="w-full h-64 object-cover"
                            loading="lazy"
                          />
                          <div className="p-4">
                            <h3 className="text-white text-lg font-medium truncate">{similarMovie.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                              <span>{getYearFromDate(similarMovie.release_date)}</span>
                              <span>•</span>
                              <span className="bg-netflix-red px-2 py-0.5 rounded text-white">
                                {similarMovie.vote_average.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                              {similarMovie.overview}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {similarMovie.genre_ids?.slice(0, 2).map((genreId) => (
                                <span key={genreId} className="text-xs bg-netflix-gray px-2 py-1 rounded">
                                  {movie.genres?.find(g => g.id === genreId)?.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No similar movies found</p>
                  )}
                </div>
              </div>
            </div>
          </div>


        </>
      )}
    </div>
  );
};

export default VideoPlayerPage;