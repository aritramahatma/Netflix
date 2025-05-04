import { useLocation } from 'wouter';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import BackToTop from '@/components/BackToTop';

export default function Premium() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      <MobileMenu />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-white text-4xl font-bold mb-6">
            <i className="fas fa-crown text-yellow-500 mr-3"></i>
            Premium Membership
          </h1>
          
          <div className="bg-netflix-dark p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-netflix-red text-2xl font-bold mb-4">Unlock Premium Benefits</h2>
            <p className="text-gray-300 mb-6">
              Enhance your movie-watching experience with our Premium subscription.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-netflix-gray rounded-lg p-6 text-left">
                <div className="text-netflix-red text-xl mb-3">
                  <i className="fas fa-ad mr-2"></i> Ad-Free Experience
                </div>
                <p className="text-gray-300">Enjoy all movies without interruptions or advertisements.</p>
              </div>
              
              <div className="bg-netflix-gray rounded-lg p-6 text-left">
                <div className="text-netflix-red text-xl mb-3">
                  <i className="fas fa-download mr-2"></i> Offline Download
                </div>
                <p className="text-gray-300">Download movies to watch when you're offline.</p>
              </div>
              
              <div className="bg-netflix-gray rounded-lg p-6 text-left">
                <div className="text-netflix-red text-xl mb-3">
                  <i className="fas fa-film mr-2"></i> Exclusive Content
                </div>
                <p className="text-gray-300">Access to premium-only movies and series.</p>
              </div>
              
              <div className="bg-netflix-gray rounded-lg p-6 text-left">
                <div className="text-netflix-red text-xl mb-3">
                  <i className="fas fa-headphones mr-2"></i> Premium Audio
                </div>
                <p className="text-gray-300">Enhanced audio quality for an immersive experience.</p>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-white mb-3">
                $9.99<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Cancel anytime</p>
            </div>
            
            <a 
              href="https://t.me/your_movie_bot?start=premium" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-netflix-red hover:bg-red-700 transition text-white font-bold py-3 px-8 rounded-lg"
            >
              <i className="fab fa-telegram-plane mr-2"></i> Subscribe via Telegram
            </a>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="bg-netflix-gray hover:bg-gray-700 transition text-white py-2 px-6 rounded"
          >
            Back to Home
          </button>
        </div>
      </main>
      
      <BackToTop />
    </div>
  );
}