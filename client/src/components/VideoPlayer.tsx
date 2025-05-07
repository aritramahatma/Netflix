
import { useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';

interface VideoPlayerProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ movieId, isOpen, onClose }: VideoPlayerProps) => {
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <iframe
          src={`https://vidsrc.xyz/embed/movie/${movieId}?api_key=4789fec446eaf7997af0`}
          className="w-full aspect-video"
          allowFullScreen
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
