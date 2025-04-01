import { useState } from 'react';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import MovieGrid from './MovieGrid';
import LoadingSpinner from './LoadingSpinner';
import NoResults from './NoResults';
import ResultsCount from './ResultsCount';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

function MovieSearch({ user, onAuthRequired }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [error, setError] = useState(null);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [numResults, setNumResults] = useState(0);

  // State to maintain saved movies of 'user'
  const [savedMovies, setSavedMovies] = useState(new Set());

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setNumResults(0);
    setRecommendations([]);
    setShowFilters(false);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
        }),
      });

      // Parse the response as JSON
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
  
      if (!data || !Array.isArray(data.recommendations)) {
        throw new Error('Invalid response format');
      }

      // Valid response, set the recommendations and other attributes
      setRecommendations(data.recommendations);
      setNumResults(data.recommendations.length);
      setShowFilters(true);

      // Extract unique languages, types, and genres from the results
      const languages = new Set();
      const types = new Set();
      const genres = new Set();
      data.recommendations.forEach((movie) => {
        if (movie.languages)
          movie.languages.forEach((lang) => languages.add(lang));
        if (movie.type) types.add(movie.type);
        if (movie.genres) movie.genres.forEach((g) => genres.add(g));
      });
      setAvailableLanguages(['all', ...Array.from(languages)]);
      setAvailableTypes(['all', ...Array.from(types)]);
      setAvailableGenres(['all', ...Array.from(genres)]);

      // If user is logged in, fetch their saved movies
      if (user) {
        const { data: libraryData } = await supabase
          .from('user_library')
          .select('movie_id')
          .eq('user_id', user.id);
        
        if (libraryData) {
          setSavedMovies(new Set(libraryData.map(item => item.movie_id)));
        }
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLibrary = async (movie) => {
    if (!user) {
      onAuthRequired();
      return;
    }

    // Save movie to user's favorites
    try {
      const { error } = await supabase
        .from('user_library')
        .upsert({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster: movie.poster,
          year: movie.year,
          genres: movie.genres,
          added_at: new Date().toISOString()
        });

      if (error) throw error;

      setSavedMovies(prev => new Set([...prev, movie.id]));
      toast.success('Added to your library');
    } catch (error) {
      console.error('Error saving movie:', error);
      toast.error('Failed to add movie to library');
    }
  };

  const filteredRecommendations = recommendations.filter((movie) => {
    const languageMatch =
      selectedLanguage === 'all' ||
      (movie.languages && movie.languages.includes(selectedLanguage));
    const typeMatch = selectedType === 'all' || movie.type === selectedType;
    const genreMatch =
      selectedGenre === 'all' ||
      (movie.genres && movie.genres.includes(selectedGenre));
    return languageMatch && typeMatch && genreMatch;
  });

  return (
    <div className="space-y-8">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
        error={error}
      />

      {showFilters && recommendations.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <ResultsCount numResults={numResults} />
          <FilterBar
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            availableLanguages={availableLanguages}
            availableTypes={availableTypes}
            availableGenres={availableGenres}
          />
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && filteredRecommendations.length > 0 && (
        <MovieGrid
          movies={filteredRecommendations}
          savedMovies={savedMovies}
          handleSaveMovie={handleAddToLibrary}
        />
      )}

      {!loading && filteredRecommendations.length === 0 && showFilters && (
        <NoResults />
      )}
    </div>
  );
}

export default MovieSearch;