import { useState } from 'react';
import { Search, Film } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

function MovieSearch({ user, onAuthRequired }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          language: language === 'all' ? null : language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setShowFilters(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovie = async (movie) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    // Save movie to user's favorites
  };

  return (
    <div className="space-y-8">
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
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>

      {showFilters && recommendations.length > 0 && (
        <div className="flex justify-end">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="ko">Korean</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((movie) => (
            <Card key={movie.id} className="bg-slate-800 border-slate-700 overflow-hidden group">
              <div className="aspect-[2/3] relative bg-slate-900">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Film className="h-12 w-12 text-slate-700" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
                <p className="text-sm text-slate-400">
                  {movie.year} • {movie.language.toUpperCase()}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;