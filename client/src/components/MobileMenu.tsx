import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '@/lib/api';

const MobileMenu = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu when location changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Add event listener for the toggle-mobile-menu event
  useEffect(() => {
    const handleToggleMenu = () => toggleMenu();
    document.addEventListener('toggle-mobile-menu', handleToggleMenu);
    
    return () => {
      document.removeEventListener('toggle-mobile-menu', handleToggleMenu);
    };
  }, []);

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 w-64 h-full bg-netflix-dark z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out shadow-lg`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <span className="text-netflix-red font-bold text-xl">404</span>
            <span className="text-netflix-red mx-1 font-bold">|</span>
            <span className="text-white font-semibold">MOVIE</span>
          </div>
          <button onClick={closeMenu} className="text-white focus:outline-none">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <nav className="space-y-5">
          <Link href="/" className="block text-white hover:text-netflix-red transition-colors">
            Home
          </Link>
          <Link href="/?section=trending" className="block text-white hover:text-netflix-red transition-colors">
            Trending
          </Link>
          <Link href="/?section=genres" className="block text-white hover:text-netflix-red transition-colors">
            Genres
          </Link>
          <hr className="border-netflix-gray my-4" />
          <div className="space-y-3">
            <p className="text-gray-400 uppercase text-sm font-medium">Genres</p>
            {genres?.map((genre) => (
              <Link 
                key={genre.id} 
                href={`/genre/${genre.id}`} 
                className="block text-white hover:text-netflix-red transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
