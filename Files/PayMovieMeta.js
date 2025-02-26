const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

function parseMovieInfo(data) {
  const movieInfos = [];
  const movieBlocks = data.split('<start_movieinfo>').slice(1);

  movieBlocks.forEach(block => {
    const info = {};
    const lines = block.split('\n').map(line => line.trim());

    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        info[key.trim()] = value.trim().replace('<end_movieinfo>', '');
      }
    });

    if (Object.keys(info).length > 0) {
      movieInfos.push(info);
    }
  });

  return movieInfos;
}

function generateMovieMeta(movieInfo) {
  const movieMeta = xmlbuilder.create('PayMovies');
  movieMeta.ele('ver', {}, '399');
  movieMeta.ele('movieid', {}, movieInfo.movieid);
  movieMeta.ele('title', {}, movieInfo.title);
  movieMeta.ele('kana', {}, movieInfo.kana);
  movieMeta.ele('refid', {}, movieInfo.refid);
  movieMeta.ele('released', {}, movieInfo.released);
  movieMeta.ele('term', {}, movieInfo.term);
  movieMeta.ele('price', {}, movieInfo.price);

  const xmlString = movieMeta.end({ pretty: true });
  return xmlString;
}

function saveMovieMetaToFile(movieInfo, outputDir = '.') {
  const xmlString = generateMovieMeta(movieInfo);
  const filename = path.join(outputDir, `${movieInfo.movieid}.met`);
  fs.writeFileSync(filename, xmlString);
}

// Read and parse the movie info file
fs.readFile('NewPayMovies.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const movieInfos = parseMovieInfo(data);
  movieInfos.forEach(movieInfo => {
    saveMovieMetaToFile(movieInfo);
  });

  console.log('Movie meta files generated successfully.');
});
