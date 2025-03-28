// data_extraction/skippedMoviesManager.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skippedMoviesFilePath = path.join(__dirname, 'skipped_movies.txt');

export class SkippedMoviesManager {
  constructor() {
    this.skippedMovies = new Set();
    this.loadSkippedMovies();
  }

  async loadSkippedMovies() {
    try {
      const data = await fs.readFile(skippedMoviesFilePath, 'utf-8');
      this.skippedMovies = new Set(data.split('\n').filter(line => line.trim() !== ''));
    } catch (error) {
      // If file doesn't exist, start with an empty set
      if (error.code === 'ENOENT') {
        this.skippedMovies = new Set();
      } else {
        console.error('Error loading skipped movies:', error);
        throw error; // Re-throw to handle it higher up
      }
    }
  }

  async addSkippedMovie(imdbId) {
    try {
      await fs.appendFile(skippedMoviesFilePath, `${imdbId}\n`);
      this.skippedMovies.add(imdbId);
    } catch (error) {
      console.error(`Error adding movie ${imdbId} to skipped movies file:`, error);
      throw error; // Re-throw to handle it higher up
    }
  }

  isMovieSkipped(imdbId) {
    return this.skippedMovies.has(imdbId);
  }
}