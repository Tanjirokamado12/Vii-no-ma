const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const builder = new xml2js.Builder({ headless: true }); // Removes the XML declaration

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function generateXMLFile(genre, movies, fileName) {
  ensureDirectoryExistence(fileName);

  const movieData = {
    GenreNewMovies: {
      ver: 1,
      genre: genre,
      movieinfo: movies.map(movie => ({
        rank: movie.rank,
        movieid: movie.movieid,
        title: movie.title,
        pay: 0
      })),
      upddt: new Date().toISOString()
    }
  };

  const xml = builder.buildObject(movieData);

  fs.writeFile(fileName, xml, (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
    } else {
      console.log(`File ${fileName} generated successfully.`);
    }
  });
}

function loadMovieData(callback) {
  fs.readFile('../Files/v512/New.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading movie.txt:', err);
      return;
    }
    const movieLines = data.trim().split('\n');
    const movieData = movieLines.map(line => {
      const [rank, movieid, title] = line.split(',');
      return { rank: parseInt(rank, 10), movieid: parseInt(movieid, 10), title: title.trim() };
    });
    callback(movieData);
  });
}

// Load movie data and generate XML files with different genres
loadMovieData((movies) => {
  for (let i = 0; i < 5; i++) {
    const genre = i + 1;
    const fileName = path.resolve(__dirname, `../../v512/url1/list/New/0${genre}.xml`);
    generateXMLFile(genre, movies, fileName);
  }
});
