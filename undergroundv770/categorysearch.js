const readlineSync = require('readline-sync');
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

// Function to get user input
const getInput = (prompt) => {
  return readlineSync.question(prompt);
};

// Function to create XML content
const createXMLContent = (moviesData) => {
  const root = xmlbuilder.create('SearchMovies', { headless: true }); // Set headless to true
  root.ele('ver', '1');
  root.ele('num', moviesData.length.toString());
  root.ele('categid', moviesData[0].categid);

  moviesData.forEach((movieData) => {
    const movieinfo = root.ele('movieinfo');
    movieinfo.ele('rank', movieData.rank);
    movieinfo.ele('movieid', movieData.movieid);
    movieinfo.ele('title', movieData.title);
    movieinfo.ele('genre', '0');
    movieinfo.ele('strdt', movieData.strdt);
    movieinfo.ele('pop', '0');
  });

  return root.end({ pretty: true });
};

// Main function to generate XML file
const generateXMLFile = () => {
  const categid = getInput('Enter category ID: ');
  const numMovies = parseInt(getInput('Enter the number of movies: '), 10);
  const moviesData = [];

  for (let i = 0; i < numMovies; i++) {
    console.log(`\nEnter details for movie ${i + 1}:`);
    const movieData = {
      categid: categid,
      rank: getInput('Enter movie rank: '),
      movieid: getInput('Enter movie ID: '),
      title: getInput('Enter movie title: '),
      strdt: getInput('Enter start date (YYYY-MM-DDTHH:mm:ss): ')
    };
    moviesData.push(movieData);
  }

  const xmlContent = createXMLContent(moviesData);
  const outputPath = getInput('Enter output file path: ');

  fs.writeFileSync(outputPath, xmlContent);
  console.log(`XML file generated successfully at ${outputPath}`);
};

// Run the script
generateXMLFile();
