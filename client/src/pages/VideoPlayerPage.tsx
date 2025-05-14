
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '@/lib/api';
import { getBackdropUrl } from '@/lib/tmdb';
import { getYearFromDate, formatRuntime } from '@/lib/utils';

const VideoPlayerPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  
  const { data: movie } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    queryFn: () => fetchMovieById(movieId),
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
              </div>
            </div>
          </div>

          {/* Similar Movies Section */}
          <div className="bg-netflix-black/90 p-4 border-t border-gray-800">
            <div className="container mx-auto">
              <h2 className="text-xl font-bold text-white mb-4">More Like This</h2>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {movie.similar?.results?.slice(0, 10).map((similarMovie) => (
                  <a 
                    href={`/watch/${similarMovie.id}`}
                    key={similarMovie.id} 
                    className="flex-shrink-0 w-48 transform hover:scale-105 transition duration-300"
                  >
                    <div className="relative group">
                      <img
                        src={similarMovie.poster_path ? `https://image.tmdb.org/t/p/w500${similarMovie.poster_path}` : 'https://i.ibb.co/8X7hTpN/404-movie-poster-default.jpg'}
                        alt={similarMovie.title}
                        className="w-full h-72 object-cover rounded-lg mb-2"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <i className="fas fa-play text-2xl mb-2"></i>
                          <p className="text-sm">Play Now</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-white text-sm font-medium truncate">{similarMovie.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{getYearFromDate(similarMovie.release_date)}</span>
                      <span>•</span>
                      <span className="bg-netflix-red px-2 py-0.5 rounded text-white">
                        {similarMovie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayerPage;
