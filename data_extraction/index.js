// data_extraction/index.js
import { initializeSupabase, authenticateDataInserter } from './config/supabase.js';
import { initializeEmbedder } from './config/embedder.js';
import { parseImdbDataset } from './parsers/imdbParser.js';
import { getMovieDetailsOmdb } from './services/omdbService.js';
import { insertMovie, isMovieProcessed, markMovieAsProcessed } from './services/movieService.js';
import { getMovieEmbedding } from './config/embedder.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { SkippedMoviesManager } from './SkippedMoviesManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Initialize Supabase
  await initializeSupabase();
  await authenticateDataInserter();

  // Initialize the embedding pipeline
  await initializeEmbedder();

  // Initialize the skipped movies manager
  const skippedMoviesManager = new SkippedMoviesManager();
  await skippedMoviesManager.loadSkippedMovies(); // Ensure skipped movies are loaded

  const imdbDatasetFilepath = 'title.basics.tsv.gz';
  try {
    const movieImdbIds = await parseImdbDataset(imdbDatasetFilepath);

    for (const imdbId of movieImdbIds) {
      // Check if the movie has already been processed
      if (isMovieProcessed(imdbId)) {
        console.log(`Movie already processed: ${imdbId}`);
        continue;
      }

      // Check if the movie has been skipped
      if (skippedMoviesManager.isMovieSkipped(imdbId)) {
        console.log(`Movie already skipped: ${imdbId}`);
        continue;
      }

      try {
        const movieDetails = await getMovieDetailsOmdb(imdbId);

        const id = movieDetails.imdbID;
        const title = movieDetails.Title;
        const year = movieDetails.Year.match(/^\d+$/) ? parseInt(movieDetails.Year) : null;
        const poster = movieDetails.Poster !== 'N/A' ? movieDetails.Poster : null;
        const languages = movieDetails.Language !== 'N/A' ? movieDetails.Language.split(', ') : null;
        const rating = movieDetails.imdbRating !== 'N/A' ? parseFloat(movieDetails.imdbRating) : null;
        const genres = movieDetails.Genre !== 'N/A' ? movieDetails.Genre.split(', ') : [];
        const plot = movieDetails.Plot;

        // Skip the current movie if any of the following conditions are met:
        if (plot === 'N/A' || rating === null || languages === null || poster === null || year === null || year !== 2024) {
          console.log(`Skipping Movie: ${title}`);
          await skippedMoviesManager.addSkippedMovie(imdbId); // Add the skipped movie to 'skipped_movies.txt'
          continue;
        }

        const embedding = await getMovieEmbedding(plot);
        const type = movieDetails.Type;

        const movieData = {
          id,
          title,
          year,
          poster,
          rating,
          embedding,
          type,
          languages,
          genres,
        };

        await insertMovie(movieData);

        // Mark the movie as processed after successful insertion
        markMovieAsProcessed(imdbId);
      } catch (error) {
        console.error(`An unexpected error occurred for ${imdbId}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();