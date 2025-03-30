// data_extraction/services/omdbService.js
import axios from 'axios';
import { omdbApiKey, omdbApiBaseUrl } from '../config/omdb.js';

export async function getMovieDetailsOmdb(imdbId) {
  const params = {
    apikey: omdbApiKey,
    i: imdbId,
    plot: 'full',
  };
  try {
    const response = await axios.get(omdbApiBaseUrl, { params });
    const data = response.data;

    if (data.Response === 'False' && data.Error === 'Request limit reached!') {
      console.error(`OMDb API rate limit reached. Stopping the program.`);
      process.exit(1); // Exit the process with a non-zero code to indicate an error
    }
    
    if (data.Response === 'True') {
      return data;
    } else {
      console.log(`Movie not found in OMDb: ${imdbId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching movie details for ${imdbId}:`, error);
    throw error;
  }
}