// data_extraction/config/embedder.js
import { pipeline } from '@xenova/transformers';

let embedder;

export async function initializeEmbedder() {
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

export async function getMovieEmbedding(moviePlot) {
  const output = await embedder(moviePlot, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);
  return embedding;
}