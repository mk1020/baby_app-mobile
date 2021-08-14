export const getChunkSize = (fileSizeByte: number) => {
  const sizeMB = fileSizeByte / 1024 / 1024;
  const minChunk = 256 * 1024;
  let countChunks = 0;
  switch (true) {
  case sizeMB < 10: countChunks = 0; break;
  case sizeMB < 30: countChunks = 3; break;
  case sizeMB < 60: countChunks = 4; break;
  case sizeMB < 90: countChunks = 6; break;
  case sizeMB < 150: countChunks = 16; break;
  case sizeMB < 300: countChunks = 20; break;
  case sizeMB < 600: countChunks = 40; break;
  case sizeMB < 900: countChunks = 60; break;
  case sizeMB < 1200: countChunks = 80; break;
  case sizeMB < 1500: countChunks = 100; break;
  default: countChunks = 250;
  }
  const chunkSize = countChunks * minChunk;
  return chunkSize;
};
