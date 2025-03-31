import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Initialize the embedding pipeline
let embedder;
async function initializeEmbedder() {
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}
initializeEmbedder();

app.post('/api/recommendations', async (req, res) => {
  try {
    const { query } = req.body;

    if (!embedder) {
      throw new Error('Embedder not initialized');
    }

    // Generate embeddings
    const output = await embedder(query, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    const { data: movies, error } = await supabase.rpc('match_movies', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
    });

    if (error) throw error;

    res.json({ recommendations: movies });
  } catch (error) {
    console.error('Error in recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});