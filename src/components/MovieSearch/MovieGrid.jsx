import MovieCard from './MovieCard';

function MovieGrid({ movies, savedMovies, handleSaveMovie }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} savedMovies = { savedMovies} handleSaveMovie={handleSaveMovie} />
      ))}
    </div>
  );
}

export default MovieGrid;