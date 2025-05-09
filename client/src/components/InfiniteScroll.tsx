import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import MovieGrid from './MovieGrid';
import SkeletonLoader from './SkeletonLoader';

interface InfiniteScrollProps {
  queryKey: string[];
  fetchFn: (page: number) => Promise<any>;
  title?: string;
}

const InfiniteScroll = ({ queryKey, fetchFn, title }: InfiniteScrollProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || !data) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <div className="bg-netflix-dark p-8 rounded-lg text-center">
        <i className="fas fa-exclamation-triangle text-netflix-red text-4xl mb-4"></i>
        <p className="text-white text-lg">Failed to load movies.</p>
        <p className="text-gray-400 mt-2">Please try again later.</p>
      </div>
    );
  }

  const movies = data?.pages.flatMap(page => page.results) || [];

  return (
    <>
      {title && <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>}
      <MovieGrid movies={movies} />
      <div ref={loadMoreRef} className="h-20">
        {isFetchingNextPage && <SkeletonLoader />}
      </div>
    </>
  );
};

export default InfiniteScroll;