const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Read the categoryMovies.txt file
const filePath = path.join(__dirname, '../../files/v1025/categoryMovies.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Create XML builder
const builder = new xml2js.Builder({
  rootName: 'RelatedMovies',
  renderOpts: { 'pretty': true, 'indent': '  ', 'newline': '\n' }
});

// Parse the file content
const categories = fileContent.split('\n\n').map((categoryBlock) => {
  const lines = categoryBlock.split('\n').filter(line => line.trim());
  const categid = lines.shift().split(':')[1].trim();

  const movies = lines.reduce((acc, line, index) => {
    const [key, value] = line.split(':');
    if (key.trim() === 'rank') {
      acc.push({});
    }
    acc[acc.length - 1][key.trim()] = value.trim();
    return acc;
  }, []);

  // Ensure there are at least 15 movies by duplicating if necessary
  while (movies.length < 15) {
    const duplicate = movies.slice(0, 15 - movies.length);
    duplicate.forEach(movie => {
      const newMovie = { ...movie, rank: movies.length + 1 };
      movies.push(newMovie);
    });
  }

  return { categid, movies };
});

// Create XML object
const xmlObj = {
  ver: 1,
  leftmovieinfo: categories.map(category => category.movies).flat(),
  rightmovieinfo: categories.map(category => category.movies).flat()
};

// Build XML
const xml = builder.buildObject(xmlObj).replace(/<\?xml .*\?>/, '');

// Save XML to file
const outputFilePath = path.join(__dirname, '../../v1025/url2/related.cgi');
fs.writeFileSync(outputFilePath, xml);

