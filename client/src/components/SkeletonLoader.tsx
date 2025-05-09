
import { Skeleton } from "@/components/ui/skeleton";

export const MovieCardSkeleton = () => {
  return (
    <div className="movie-card rounded-lg overflow-hidden bg-netflix-dark relative">
      <Skeleton className="w-full h-[300px]" />
      <div className="p-2">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};

export const MovieGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array(10).fill(0).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const MovieDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Skeleton className="w-full h-[400px]" />
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    </div>
  );
};
