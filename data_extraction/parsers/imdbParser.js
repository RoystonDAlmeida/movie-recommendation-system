// data_extraction/parsers/imdbParser.js
import fs from 'fs';
import zlib from 'zlib';

export async function parseImdbDataset(filepath) {
  console.log('parseImdbDataset: Starting');
  const imdbIds = [];

  // Check if the file exists and is not empty
  try {
    const stats = fs.statSync(filepath);
    if (stats.size === 0) {
      console.error('parseImdbDataset: Error: File is empty');
      return imdbIds; // Return an empty array if the file is empty
    }
  } catch (err) {
    console.error('parseImdbDataset: Error: File not found or inaccessible:', err);
    return imdbIds; // Return an empty array if the file is not found or inaccessible
  }

  const fileStream = fs.createReadStream(filepath);
  const gunzip = zlib.createGunzip();
  const decoder = new TextDecoder();

  let data = '';
  let lineCount = 0; // Add a line counter

  try {
    const stream = fileStream.pipe(gunzip);

    for await (const chunk of stream) {
      data += decoder.decode(chunk);
      const lines = data.split('\n');
      data = lines.pop() || ''; // Keep the last (potentially incomplete) line

      for (const line of lines) {
        lineCount++; // Increment line counter
        if (lineCount === 1) continue; // Skip the header row

        const parts = line.trim().split('\t');
        if (parts.length >= 6) { // Check if the line has enough parts
          try {
            if (parts[5] !== '\\N') {
              const startYear = parts[5];
              if (parseInt(startYear) === 2024 && parts[4] !== '1') {
                console.log(`Movie: ${parts[3]}`);
                imdbIds.push(parts[0]);

                if (imdbIds.length === 1000) {
                  console.log('parseImdbDataset: Returning early with 1000 IDs');
                  return imdbIds;
                }
              }
            }
          } catch (error) {
            console.error(`Error processing line ${lineCount}: ${line}`, error);
          }
        } else {
          console.warn(`Skipping malformed line ${lineCount}: ${line}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
  console.log('parseImdbDataset: Returning imdbIds');
  return imdbIds;
}