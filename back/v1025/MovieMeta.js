const fs = require("fs");
const path = require("path");

// Paths and configurations
const inputFilePath = "../files/v1025/categorymovies.txt";
const baseOutputDir = "../v1025/url1/movie";
const outputLocations = [
  "c4/1.met", "c8/2.met", "ec/3.met", "a8/4.met", "e4/5.met", "16/6.met",
  "8f/7.met", "c9/8.met", "45/9.met", "d3/10.met", "65/11.met", "c2/12.met",
  "c5/13.met", "aa/14.met", "9b/15.met", "c7/16.met", "70/17.met", "6f/18.met",
  "1f/19.met", "98/20.met", "3c/21.met", "b6/22.met", "37/23.met", "1f/24.met",
  "8e/25.met", "4e/26.met", "02/27.met", "33/28.met", "6e/29.met", "34/30.met",
  "c1/31.met", "63/32.met", "18/33.met", "e3/34.met", "1c/35.met", "19/36.met",
  "a5/37.met",
"a5/38.met",
"d6/39.met",
"d6/40.met",
"34/41.met",
"a1/42.met",
"17/43.met",
"f7/44.met",
"6c/45.met",
"d9/46.met",
"67/47.met",
"64/48.met",
"f4/49.met",
"c0/50.met",
"28/51.met",
"9a/52.met",
"d8/53.met",
"a6/54.met",
"b5/55.met",
"9f/56.met",
"72/57.met",
"66/58.met",
"09/59.met",
"07/60.met",
"7f/61.met",
"44/62.met",
"03/63.met",
"ea/64.met",
"fc/65.met",
"32/66.met",
"73/67.met",
"a3/68.met",
"14/69.met",
"7c/70.met",
"e2/71.met",
"32/72.met"
];

// Function to parse the file without editing it
function parseMovies(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8").split("\n");
  const movies = [];
  let currentCategory = null;
  let movie = null;

  fileContent.forEach((line, idx) => {
    line = line.trim();
    if (!line) return; // Skip empty lines

    if (line.startsWith("categid:")) {
      currentCategory = line.split(":")[1]?.trim();
    } else if (line.startsWith("rank:")) {
      if (movie) movies.push(movie); // Save the previous movie object
      movie = { categid: currentCategory }; // Start a new movie object
      movie.rank = line.split(":")[1]?.trim() || "0"; // Default rank is 0
    } else if (movie) {
      const [key, value] = line.split(":").map(item => item?.trim());
      if (key && value) movie[key] = value;
    }
  });

  if (movie) movies.push(movie); // Save the last movie object
  return movies;
}

// Function to generate XML content
function generateMovieMeta(movie) {
  return `<MovieMeta>
  <ver>1</ver>
  <movieid>${movie.movieid}</movieid>
  <title>${movie.title}</title>
  <len>00:03:11</len>
  <aspect>1</aspect>
  <genre>${movie.genre}</genre>
  <dsdist>0</dsdist>
  <staff>${movie.staff}</staff>
</MovieMeta>`;
}

// Write `.met` files
function saveMovieMetaFiles(movies) {
  const movieMap = new Map(); // Create a map to store movies by their `movieid`

  // Populate the map with movies
  movies.forEach((movie) => {
    if (movie.movieid) {
      movieMap.set(Number(movie.movieid), movie);
    }
  });

  // Loop through output locations
  outputLocations.forEach((outputPath, index) => {
    const expectedMovieId = index + 1; // Expected `movieid` in sequence (1, 2, 3, ...)
    const movie = movieMap.get(expectedMovieId);

    // Check if the movie exists for the expected `movieid`
if (!movie) {
  console.warn(`Skipping movieid ${expectedMovieId}: Missing movie data.`);
  return; // Skip this iteration if `movieid` is missing
}


    const filePath = path.join(baseOutputDir, outputPath);
    const movieMeta = generateMovieMeta(movie);

    // Ensure directories exist
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write file
    fs.writeFileSync(filePath, movieMeta, "utf8");
  });
}



// Main process
const movies = parseMovies(inputFilePath);
saveMovieMetaFiles(movies);
