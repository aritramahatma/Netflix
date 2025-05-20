import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '@/lib/api';
import Footer from "@/components/Footer";
import { useEffect } from 'react';

const VideoPlayerPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const { data: movie } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    queryFn: () => fetchMovieById(movieId),
    staleTime: 0,
  });

  useEffect(() => {
    document.title = movie?.title ? `Watch ${movie.title} - 404 Movie` : '404 Movie';
  }, [movie?.title]);

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-[calc(100vh-90px)]">
        <iframe
          src={`https://vidsrc.to/embed/movie/${movieId}`}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          allow="autoplay *; fullscreen *; encrypted-media *"
          referrerPolicy="no-referrer"
          loading="lazy"
          style={{ border: 'none' }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default VideoPlayerPage;