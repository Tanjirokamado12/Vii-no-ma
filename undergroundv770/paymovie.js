const readlineSync = require('readline-sync');
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

// Function to get user input
const getInput = (prompt) => {
  return readlineSync.question(prompt);
};

// Function to create XML content for a single pay movie
const createSinglePayMovieXML = (movieData) => {
  const payMovie = xmlbuilder.create('PayMovies', { headless: true }); // Set headless to true
  payMovie.ele('ver', '1');
  payMovie.ele('movieid', movieData.movieid);
  payMovie.ele('title', movieData.title);
  payMovie.ele('kana', movieData.kana);
  payMovie.ele('len', movieData.len);
  payMovie.ele('aspect', movieData.aspect);
  payMovie.ele('payenddt', movieData.payenddt);
  payMovie.ele('dsdist', movieData.dsdist);
  
  if (movieData.dsdist === '1') {
    payMovie.ele('dsmovid', movieData.dsmovid); // Use user-specified dsmovid
  }
  
  payMovie.ele('staff', movieData.staff);
  payMovie.ele('note', movieData.note);
  payMovie.ele('dimg', movieData.dimg);
  payMovie.ele('eval', '0');
  payMovie.ele('refid', '01234567890123456789012345678912');
  payMovie.ele('pricecd', '1234567');
  payMovie.ele('term', '30');
  payMovie.ele('price', movieData.price);
  payMovie.ele('sample', '1');
  payMovie.ele('smpap', '1');
  payMovie.ele('released', '2011-07-15');
  payMovie.ele('encrypt', '1');
  payMovie.ele('geofilter', '1');

  return payMovie.end({ pretty: true });
};

// Main function to generate XML file
const generateXMLFiles = () => {
  const numMovies = parseInt(getInput('Enter the number of pay movies: '), 10);

  for (let i = 0; i < numMovies; i++) {
    console.log(`\nEnter details for pay movie ${i + 1}:`);
    const movieData = {
      movieid: getInput('Enter movie ID: '),
      title: getInput('Enter movie title: '),
      kana: getInput('Enter kana: '),
      len: getInput('Enter movie length: '),
      aspect: getInput('Enter aspect ratio: '),
      payenddt: getInput('Enter pay end date: '),
      dsdist: getInput('Enter distribution info: '),
      dsmovid: '', // Initialize dsmovid
      staff: getInput('Enter staff details: '),
      note: getInput('Enter note: '),
      dimg: getInput('Enter image choice: '),
      price: getInput('Enter price: ')
    };

    if (movieData.dsdist === '1') {
      movieData.dsmovid = getInput('Enter DSMovie ID: '); // Prompt user for dsmovid if dsdist is 1
    }

    const xmlContent = createSinglePayMovieXML(movieData);
    const outputPath = getInput('Enter output file path for pay movie ' + (i + 1) + ': ');

    fs.writeFileSync(outputPath, xmlContent);
    console.log(`XML file generated successfully at ${outputPath}`);
  }
};

// Run the script
generateXMLFiles();
