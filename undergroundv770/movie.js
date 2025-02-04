const readlineSync = require('readline-sync');
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

// Function to get user input
const getInput = (prompt) => {
  return readlineSync.question(prompt);
};

// Function to create XML content for a single movie
const createSingleMovieXML = (movieData) => {
  const movieMeta = xmlbuilder.create('MovieMeta', { headless: true }); // Set headless to true
  movieMeta.ele('ver', '1');
  movieMeta.ele('movieid', movieData.movieid);
  movieMeta.ele('title', movieData.title);
  movieMeta.ele('len', movieData.len);
  movieMeta.ele('aspect', movieData.aspect);
  movieMeta.ele('genre', movieData.genre);

  if (movieData.includeSppageid === 'yes') {
    movieMeta.ele('sppageid', movieData.sppageid);
  }

  movieMeta.ele('dsdist', movieData.dsdist);
  
  if (movieData.dsdist === '1') {
    movieMeta.ele('dsmovid', movieData.dsmovid); // Use user-specified dsmovid
  }
  
  movieMeta.ele('staff', movieData.staff);

  return movieMeta.end({ pretty: true });
};

// Main function to generate XML file
const generateXMLFiles = () => {
  const numMovies = parseInt(getInput('Enter the number of movies: '), 10);

  for (let i = 0; i < numMovies; i++) {
    console.log(`\nEnter details for movie ${i + 1}:`);
    const movieData = {
      movieid: getInput('Enter movie ID: '),
      title: getInput('Enter movie title: '),
      len: getInput('Enter movie length: '),
      aspect: getInput('Enter aspect ratio: '),
      genre: getInput('Enter genre: '),
      includeSppageid: getInput('Include special page ID? (yes/no): '),
      sppageid: '',
      dsdist: getInput('Enter distribution info: '),
      dsmovid: '', // Initialize dsmovid
      staff: getInput('Enter staff details: ')
    };

    if (movieData.includeSppageid === 'yes') {
      movieData.sppageid = getInput('Enter special page ID: ');
    }

    if (movieData.dsdist === '1') {
      movieData.dsmovid = getInput('Enter DSMovie ID: '); // Prompt user for dsmovid if dsdist is 1
    }

    const xmlContent = createSingleMovieXML(movieData);
    const outputPath = getInput('Enter output file path for movie ' + (i + 1) + ': ');

    fs.writeFileSync(outputPath, xmlContent);
    console.log(`XML file generated successfully at ${outputPath}`);
  }
};

// Run the script
generateXMLFiles();
