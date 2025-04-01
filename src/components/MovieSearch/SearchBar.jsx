import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

function SearchBar({ searchQuery, setSearchQuery, handleSearch, loading, error }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <Input
          placeholder="Enter a movie title (e.g., The Matrix, Inception)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 text-lg bg-slate-800 border-slate-700 focus:ring-purple-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default SearchBar;