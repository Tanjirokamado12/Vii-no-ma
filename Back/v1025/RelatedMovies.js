const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// File paths
const inputFilePath = path.join(__dirname, '../../files/v1025/categoryMovies.txt');
const outputFilePath = path.join(__dirname, '../../v1025/url2/related.cgi');

// Create an XML builder and ensure the XML declaration is disabled
const builder = new xml2js.Builder({
  rootName: 'RelatedMovies',
  renderOpts: { pretty: true, indent: '  ', newline: '\n' },
  xmldec: false // Completely remove the XML declaration
});

// Helper function to generate a random movieid between 1 and 36
const generateRandomMovieId = () => Math.floor(Math.random() * 36) + 1;

// Read and parse the content of categoryMovies.txt
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
const categories = fileContent.split('\n\n').map(categoryBlock => {
  const lines = categoryBlock.split('\n').filter(line => line.trim());
  const categid = lines.shift().split(':')[1].trim(); // Extract category ID

  const movies = lines.map((line, index) => {
    const [key, value] = line.split(':');
    if (key.trim().toLowerCase() === 'title') {
      return {
        rank: (index % 15 + 1).toString(), // Reset rank to loop between 1 to 15
        movieid: generateRandomMovieId().toString(), // Random movie ID
        title: value.trim() || 'tile' // Extract title or use 'tile' as default
      };
    }
  }).filter(movie => movie); // Filter out undefined entries

  // Add random placeholder movies to ensure a minimum of 15 movies
  while (movies.length < 15) {
    movies.push({
      rank: (movies.length % 15 + 1).toString(),
      movieid: generateRandomMovieId().toString(),
      title: 'tile' // Placeholder title
    });
  }

  return { categid, movies };
});

// Prepare the XML structure
const xmlObj = {
  ver: 399, // Version as in your example
  leftmovieinfo: categories.flatMap(category => 
    category.movies.slice(0, 15).map((movie, index) => ({
      rank: (index + 1).toString(),
      movieid: movie.movieid,
      title: movie.title
    }))
  ),
  rightmovieinfo: categories.flatMap(category => 
    category.movies.slice(0, 15).map((movie, index) => ({
      rank: (index + 1).toString(),
      movieid: movie.movieid,
      title: movie.title
    }))
  )
};

// Build the XML
let xml = builder.buildObject(xmlObj);

// Verify and manually remove the XML declaration (fallback, if needed)
if (xml.startsWith('<?xml')) {
  xml = xml.replace(/^<\?xml.*\?>\n?/, ''); // Remove any XML declaration
}

// Save the XML to the output file
fs.writeFileSync(outputFilePath, xml);
