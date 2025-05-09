
import { Link } from "wouter";
import { useState } from "react";
import { getImageUrl } from "@/lib/tmdb";
import VideoPlayer from "./VideoPlayer";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { id, title, poster_path, vote_average } = movie;

  const handleWatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoOpen(true);
  };

  const rating = vote_average.toFixed(1);

  return (
    <>
      <Link href={`/movie/${id}`}>
        <div className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105">
          <img
            src={getImageUrl(poster_path, 'w500')}
            alt={title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-white font-semibold truncate">{title}</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 mr-2">★ {rating}</span>
                <button
                  onClick={handleWatchClick}
                  className="bg-netflix-red text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <VideoPlayer
        movieId={id}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
};

export default MovieCard;
