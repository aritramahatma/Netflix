
import { Link } from "wouter";
import { Icon } from "./ui/icon";

const Footer = () => {
  return (
    <footer className="bg-netflix-black py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-netflix-red font-bold text-2xl">404</span>
              <span className="text-netflix-red mx-1 font-bold">|</span>
              <span className="text-white font-semibold text-xl">MOVIE</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for streaming movies and TV shows.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-netflix-red transition">Home</Link></li>
              <li><Link href="/genres" className="text-gray-400 hover:text-netflix-red transition">Genres</Link></li>
              <li><Link href="/premium" className="text-gray-400 hover:text-netflix-red transition">Premium</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-netflix-red transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-netflix-red transition">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://t.me/movies404update" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-netflix-red transition">
                <Icon name="info" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} 404 Movie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
