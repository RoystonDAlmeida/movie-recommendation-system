import { Film, Star, Check, Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

function MovieCard({ movie, savedMovies, handleSaveMovie }) {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden group flex relative">
      <div className="w-1/3 aspect-[2/3] relative bg-slate-900">
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
      <div className="p-4 w-2/3">
        <h3 className="font-bold text-white text-lg truncate">{movie.title}</h3>
        <p className="text-sm text-slate-400">{movie.year}</p>
        {movie.rating && (
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm text-slate-400">{movie.rating}</span>
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {movie.genres &&
            movie.genres.map((g) => (
              <span
                key={g}
                className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs"
              >
                {g}
              </span>
            ))}
        </div>
      </div>

      {/* Add/Remove Button at Bottom Right */}
      <div className="absolute bottom-0 right-0 p-2">
        <Button
          onClick={() => handleSaveMovie(movie)}
          title={savedMovies.has(movie.id) ? "Remove from Library" : "Add to Library"} // Tooltip message
          className="h-8 w-8 p-0"
          variant={savedMovies.has(movie.id) ? "secondary" : "default"}
        >
          {savedMovies.has(movie.id) ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}

export default MovieCard;