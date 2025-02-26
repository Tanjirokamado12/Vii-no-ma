const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// Path to the input file
const inputFilePath = path.join(__dirname, '../files/AllPopularMovies.txt');

// Path to the output directory and file
const outputDir = path.join(__dirname, '../v770/url1/list/popular');
const outputFilePath = path.join(outputDir, 'all.xml');

// Read the contents of the input file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the input data
  const entries = data.split('<start_movieinfo>').filter(entry => entry.trim() !== '');
  const movies = entries.map((entry) => {
    const lines = entry.split('\n');
    const movieInfo = {};
    lines.forEach((line) => {
      if (line.includes('<end_movieinfo>')) return;
      const [key, value] = line.split(':');
      if (key && value) {
        let trimmedKey = key.trim();
        let trimmedValue = value.trim();
        // Ensure the strdt field is in the correct format
        if (trimmedKey === 'strdt' && !trimmedValue.match(/:\d{2}$/)) {
          trimmedValue = trimmedValue + ':00:00';
        }
        movieInfo[trimmedKey] = trimmedValue;
      }
    });
    return movieInfo;
  });

  // Create an XML object with the given structure
  const xml = xmlbuilder.create('AllNewMovies', { headless: true })
    .ele('ver', 1).up();

  // Add each movie as a separate <movieinfo> element
  movies.forEach((movieInfo) => {
    const movieElem = xml.ele('movieinfo');
    Object.keys(movieInfo).forEach((key) => {
      movieElem.ele(key, movieInfo[key]).up();
    });
  });

  const xmlString = xml.end({ pretty: true });

  // Create the output directory if it doesn't exist
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating the directory:', err);
      return;
    }

    // Write the XML data to the output file
    fs.writeFile(outputFilePath, xmlString, (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('XML file generated successfully');
    });
  });
});
