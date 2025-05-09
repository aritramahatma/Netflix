
import React, { memo } from 'react';
import { Movie } from '@shared/schema';
import { VideoPlayer } from './VideoPlayer';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = memo(({ movie }: MovieCardProps) => {
  const [showVideo, setShowVideo] = React.useState(false);
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setShowVideo(true)}>
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-netflix-red text-white px-6 py-2 rounded-full">
            Play
          </button>
        </div>
      </div>
      {showVideo && (
        <VideoPlayer
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          movieId={movie.id}
        />
      )}
    </>
  );
});

MovieCard.displayName = 'MovieCard';
export default MovieCard;
