
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface VideoPlayerProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ movieId, isOpen, onClose }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent">
        <div className="relative pb-[56.25%] h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-netflix-red"></div>
            </div>
          )}
          <iframe
            src={`https://vidsrc.to/embed/movie/${movieId}`}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
