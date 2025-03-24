import { useState } from 'react';
import { supabase } from './lib/supabase';
import MovieSearch from './components/MovieSearch';
import AuthModal from './components/AuthModal';
import { Button } from './components/ui/button';
import { UserCircle } from 'lucide-react';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            MovieMind
          </h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{user.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Discover Your Next Favorite Movie
          </h2>
          <p className="text-lg text-slate-300">
            Enter a movie you love and let our AI find similar films you'll enjoy.
          </p>
        </div>

        <MovieSearch user={user} onAuthRequired={() => setIsAuthModalOpen(true)} />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(userData) => {
          setUser(userData);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;