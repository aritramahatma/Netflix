
import { Dialog, DialogContent } from './ui/dialog';

interface VideoPlayerProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ movieId, isOpen, onClose }: VideoPlayerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            src={`https://vidsrc.xyz/embed/movie/${movieId}?api_key=4789fec446eaf7997af0`}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
