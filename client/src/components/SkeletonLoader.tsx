import { Skeleton } from "./ui/skeleton"

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array(10).fill(0).map((_, i) => (
        <div key={i} className="movie-card rounded-lg overflow-hidden bg-netflix-dark relative">
          <Skeleton className="w-full h-[300px]" />
          <div className="p-2">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}