import { Dialog, DialogContent } from './ui/dialog';
import { useState } from 'react';

interface VideoPlayerProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ movieId, isOpen, onClose }: VideoPlayerProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <div className="relative pb-[56.25%] h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-netflix-dark">
              <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-netflix-dark">
              <p className="text-white mb-4">Failed to load video</p>
              <button 
                onClick={handleRetry}
                className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-opacity-80"
              >
                Retry
              </button>
            </div>
          ) : (
            <iframe
              src={`https://vidsrc.xyz/embed/movie/${movieId}?api_key=4789fec446eaf7997af0`}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;