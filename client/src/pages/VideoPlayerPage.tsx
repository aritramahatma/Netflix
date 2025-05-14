
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
      )}
    </div>
  );
};

export default VideoPlayerPage;
