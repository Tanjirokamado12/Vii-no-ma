const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define the base directory where output files will be stored
const basePath = path.join(__dirname, '../../v512/url1/movie');

// Define the output file paths
const outputFilePaths = [
  "c4/1.met", "c8/2.met", "ec/3.met", "a8/4.met", "e4/5.met", "16/6.met",
  "8f/7.met", "c9/8.met", "45/9.met", "d3/10.met", "65/11.met", "c2/12.met",
  "c5/13.met", "aa/14.met", "9b/15.met", "c7/16.met", "70/17.met", "6f/18.met",
  "1f/19.met", "98/20.met", "3c/21.met", "b6/22.met", "37/23.met", "1f/24.met",
  "8e/25.met", "4e/26.met", "02/27.met", "33/28.met", "6e/29.met", "34/30.met",
  "c1/31.met", "63/32.met", "18/33.met", "e3/34.met", "1c/35.met", "19/36.met",
  "a5/37.met", "a5/38.met", "d6/39.met", "d6/40.met", "34/41.met", "a1/42.met",
  "17/43.met", "f7/44.met", "6c/45.met", "d9/46.met", "67/47.met", "64/48.met",
  "f4/49.met", "c0/50.met", "28/51.met", "9a/52.met", "d8/53.met", "a6/54.met",
  "b5/55.met", "9f/56.met", "72/57.met", "66/58.met", "09/59.met", "07/60.met",
  "7f/61.met", "44/62.met", "03/63.met", "ea/64.met", "fc/65.met", "32/66.met",
  "73/67.met", "a3/68.met", "14/69.met", "7c/70.met", "e2/71.met", "32/72.met"
];

// Read the input file
const fileStream = fs.createReadStream(path.join(__dirname, '../../files/v512/GenreNewMovies.txt'));
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

// Function to create movie metadata
const createMovieMeta = (movieid, title, genre, staff) => {
  return `
<MovieMeta>
  <ver>1</ver>
  <movieid>${movieid}</movieid>
  <title>${title}</title>
  <len>00:03:11</len>
  <aspect>1</aspect>
  <genre>${genre}</genre>
  <strdt>2009-04-23T16:30:00</strdt>
  <enddt>2039-04-23T16:30:00</enddt>
  <dsdist>0</dsdist>
  <staff>${staff}</staff>
  <payid>1</payid>
  <payprice>0</payprice>
  <upddt>2009-04-23T16:30:00</upddt>
</MovieMeta>`;
};

// Function to process the file
const processFile = async () => {
  let lineIndex = 0;
  const processedMovieIds = new Set();
  let currentType = '';
  let currentMovie = {};

  ("Processing file started...");

  for await (const line of rl) {
    const trimmedLine = line.trim();

    // Handle type
    if (trimmedLine.startsWith('type:')) {
      currentType = trimmedLine.split(':')[1].trim();
      (`Detected type: ${currentType}`);
      continue;
    }

    // Handle key-value pairs
    const [key, value] = line.split(':').map(item => item.trim());
    if (key && value) {
      currentMovie[key] = value;
      (`Processing movie attribute - ${key}: ${value}`);

      // Process when 'title' is encountered (indicating the end of the movie entry)
      if (key === 'title' && currentMovie['movieid']) {
        const { movieid, title } = currentMovie;

        if (movieid && title && !processedMovieIds.has(movieid)) {
          if (lineIndex < outputFilePaths.length) {
            const movieMeta = createMovieMeta(movieid, title, currentType, '0');
            const outputFilePath = path.join(basePath, outputFilePaths[lineIndex]);
            const outputDir = path.dirname(outputFilePath);

            // Ensure directory structure exists
            (`Creating directory: ${outputDir}`);
            fs.mkdirSync(outputDir, { recursive: true });

            // Write metadata to file
            (`Writing metadata for movie ${movieid} to ${outputFilePath}`);
            fs.writeFileSync(outputFilePath, movieMeta);

            processedMovieIds.add(movieid);
            lineIndex++;
          }
        }

        (`Finished processing movie: ${title} (${movieid})`);
        currentMovie = {}; // Reset for the next movie
      }
    }
  }

  ("Processing file completed.");
};

// Run the file processing function
processFile();
