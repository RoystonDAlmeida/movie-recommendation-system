// data_extraction/utils/fileUtils.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File to store processed movie IDs
const processedMoviesFile = path.join(__dirname, '..', 'processed_movies.txt');

export function isMovieProcessed(movieId) {
  try {
    const processedMovies = fs.readFileSync(processedMoviesFile, 'utf-8').split('\n').filter(Boolean);
    return processedMovies.includes(movieId);
  } catch (error) {
    // If the file doesn't exist, it means no movies have been processed yet
    if (error.code === 'ENOENT') {
      return false;
    }
    console.error('Error reading processed movies file:', error);
    return false;
  }
}

export function markMovieAsProcessed(movieId) {
  try {
    fs.appendFileSync(processedMoviesFile, movieId + '\n');
  } catch (error) {
    console.error('Error writing to processed movies file:', error);
  }
}