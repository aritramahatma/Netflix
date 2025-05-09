
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from './ui/dialog';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
}

export function VideoPlayer({ isOpen, onClose, movieId }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load video player');
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, movieId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <div className="relative pb-[56.25%] h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-netflix-red"></div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center">
                <p className="mb-2">{error}</p>
                <button 
                  onClick={onClose}
                  className="bg-netflix-red px-4 py-2 rounded hover:bg-opacity-80"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <iframe
            key={movieId}
            src={`https://vidsrc.to/embed/movie/${movieId}`}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ visibility: isLoading ? 'hidden' : 'visible' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
