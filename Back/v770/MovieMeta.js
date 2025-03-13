const fs = require('fs');
const readline = require('readline');

// Define the output file paths
const outputFilePaths = [
  'c4/1.met', 'c8/2.met', 'ec/3.met', 'a8/4.met', 'e4/5.met', '16/6.met',
  '8f/7.met', 'c9/8.met', '45/9.met', 'd3/10.met', '65/11.met', 'c2/12.met',
  'c5/13.met', 'aa/14.met', '9b/15.met', 'c7/16.met', '70/17.met', '6f/18.met',
  '1f/19.met', '98/20.met', '3c/21.met', 'b6/22.met', '37/23.met', '1f/24.met',
  '8e/25.met', '4e/26.met', '02/27.met', '33/28.met', '6e/29.met', '34/30.met',
  'c1/31.met', '63/32.met', '18/33.met', 'e3/34.met', '1c/35.met', '19/36.met'
];

const basePath = '../v770/url1/movie/';

const fileStream = fs.createReadStream('../files/v770/categorymovies.txt');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

const createMovieMeta = (movieid, title, genre) => {
  return `
<MovieMeta>
  <ver>1</ver>
  <movieid>${movieid}</movieid>
  <title>${title}</title>
  <len>00:03:11</len>
  <aspect>1</aspect>
  <genre>${genre}</genre>
  <sppageid>0</sppageid>
  <dsdist>0</dsdist>
  <staff>0</staff>
</MovieMeta>`;
};

const processFile = async () => {
  let lineIndex = 0;
  const processedMovieIds = new Set();
  let currentMovie = {};

  for await (const line of rl) {
    const [key, value] = line.split(':').map(item => item.trim());

    if (key && value) {
      currentMovie[key] = value;

      if (key === 'pop' && currentMovie['movieid']) {
        const { movieid, title, genre } = currentMovie;

        if (movieid && title && genre && !processedMovieIds.has(movieid)) {
          if (lineIndex < outputFilePaths.length) {
            const movieMeta = createMovieMeta(movieid, title, genre);
            const outputFilePath = basePath + outputFilePaths[lineIndex];
            const outputDir = outputFilePath.split('/').slice(0, -1).join('/');

            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(outputFilePath, movieMeta);

            processedMovieIds.add(movieid);
            lineIndex++;
          }
        }

        currentMovie = {};
      }
    }
  }

};

processFile().catch(console.error);
