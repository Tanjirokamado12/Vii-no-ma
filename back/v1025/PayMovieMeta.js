const fs = require("fs").promises;
const path = require("path");
const { Builder } = require("xml2js");

// Define specific file paths for each movie ID
const filePaths = {
  1: "c4/1/1.met",
  2: "c8/2/2.met",
  3: "ec/3/3.met",
  4: "a8/4/4.met",
  5: "e4/5/5.met",
  6: "16/6/6.met",
  7: "8f/7/7.met",
  8: "c9/8/8.met",
  9: "45/9/9.met",
  10: "d3/10/10.met",
  11: "65/11/11.met",
  12: "c2/12/12.met",
  13: "c5/13/13.met",
  14: "aa/14/14.met",
  15: "9b/15/15.met",
  16: "c7/16/16.met",
  17: "70/17/17.met",
  18: "6f/18/18.met",
  19: "1f/19/19.met",
  20: "98/20/20.met",
  21: "3c/21/21.met",
  22: "b6/22/22.met",
  23: "37/23/23.met",
  24: "1f/24/24.met",
  25: "8e/25/25.met",
  26: "4e/26/26.met",
  27: "02/27/27.met",
  28: "33/28/28.met",
  29: "6e/29/29.met",
  30: "34/30/30.met",
  31: "c1/31/31.met",
  32: "63/32/32.met",
  33: "18/33/33.met",
  34: "e3/34/34.met",
  35: "1c/35/35.met",
  36: "19/36/36.met",
};

// Base directory for output
const baseDir = path.resolve(__dirname, "../../v1025/url3/pay/movie/");

// Function to generate XML for a movie
function generateXML(movie) {
  const builder = new Builder({ headless: true });
  const metadata = {
    PayMovieMeta: {
      ver: 1,
      movieid: movie.movieid,
      title: movie.title || "No title",
      kana: "02345678",
      len: "00:00:00",
      aspect: "1",
      payenddt: "2035-09-22T00:00:00",
      dsdist: "0",
      staff: "0",
      note: movie.Note || "No note",
      dimg: movie.dimg || "0",
      eval: "0",
      refid: "00234567890023456789002345678902",
      pricecd: "1000000",
      term: "1",
      price: "0",
      sample: "1",
      smpap: "0",
      released: "2011-01-01",
    },
  };
  return builder.buildObject(metadata);
}

// Function to read and parse the input file
async function parseInputFile(inputFilePath) {
  try {
    const data = await fs.readFile(inputFilePath, "utf8");
    const lines = data.split("\n");
    let currentCategory = null;
    const movies = [];

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("categid:")) {
        currentCategory = line.split(":")[1];
      } else if (line.startsWith("rank:")) {
        const movie = { category: currentCategory };
        movie.rank = line.split(":")[1];
        movies.push(movie);
      } else if (line.includes(":")) {
        const [key, value] = line.split(":");
        const lastMovie = movies[movies.length - 1];
        if (lastMovie) lastMovie[key.trim()] = value.trim();
      }
    });

    return movies;
  } catch (err) {
    console.error("Error reading or parsing the input file:", err);
    throw err;
  }
}


// Function to save the generated XML to a file
async function saveXMLFile(movie) {
  try {
    const filePath = filePaths[movie.movieid]
      ? path.join(baseDir, filePaths[movie.movieid])
      : null;

    if (!filePath) {
      error(`No file path found for movie ID: ${movie.movieid}`);
      return;
    }

    const xmlContent = generateXML(movie);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write the XML content to the file
    await fs.writeFile(filePath, xmlContent, "utf8");
  } catch (err) {
    error(`Error saving XML file for movie ID ${movie.movieid}:`, err);
  }
}

// Main function to handle the entire process
async function processMovies() {
  try {
    const inputFilePath = path.resolve(__dirname, "../../files/v1025/PayCategoryMovies.txt");
    const movies = await parseInputFile(inputFilePath);

    for (const movie of movies) {
      await saveXMLFile(movie);
    }

  } catch (err) {
    error("Error during movie processing:", err);
  }
}

// Execute the main function
processMovies();
