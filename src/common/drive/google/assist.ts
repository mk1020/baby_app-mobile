export const getChunkSize = (fileSizeByte: number) => {
  const sizeMB = fileSizeByte / 1024 / 1024;
  const minChunk = 256 * 1024;
  let countChunks = 0;
  switch (true) {
  case sizeMB < 10: countChunks = 3; break;
  case sizeMB < 30: countChunks = 9; break;
  case sizeMB < 60: countChunks = 9; break;
  case sizeMB < 90: countChunks = 10; break;
  case sizeMB < 150: countChunks = 10; break;
  case sizeMB < 300: countChunks = 10; break;
  case sizeMB < 600: countChunks = 10; break;
  case sizeMB < 900: countChunks = 10; break;
  case sizeMB < 1200: countChunks = 10; break;
  case sizeMB < 1500: countChunks = 10; break;
  default: countChunks = 250;
  }
  const chunkSize = countChunks * minChunk;
  return chunkSize;
};
