const fs = require('fs');
const xml2js = require('xml2js');
const { performance } = require('perf_hooks');
const path = require('path');

// Function to log time
const logTime = (label, startTime) => {
  const endTime = performance.now();
  console.log(`${label} took ${Math.round(endTime - startTime)} milliseconds`);
};

// Ensure the search directory exists
const searchDir = path.join(__dirname, '../v770/url1/list/category/search');
fs.mkdir(searchDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating search directory:', err);
    return;
  }

  console.log('Search directory is ready.');

  // Read the text file
  fs.readFile(path.join(__dirname, '../files/CategoryMovies.txt'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the text file:', err);
      return;
    }

    const startTime = performance.now();

    // Split the content by category
    const categories = data.trim().split('\ncategoryid:').filter(cat => cat.trim() !== '').map(cat => 'categoryid:' + cat);
    logTime('Reading and splitting file content', startTime);

    // Create and save XML structure for each category
    categories.forEach(category => {
      const categoryStartTime = performance.now();

      const lines = category.trim().split('\n');
      const movieData = { categoryid: lines.shift().split(':')[1].trim(), movieinfo: [] };

      let currentMovie = {};
      lines.forEach(line => {
        if (line.includes('<movieinfo>')) {
          currentMovie = {};
        } else if (line.includes('</movieinfo>')) {
          movieData.movieinfo.push(currentMovie);
        } else {
          const [key, value] = line.split(':').map(str => str.trim());
          if (key === 'strdt') {
            // Correct the strdt format
            currentMovie[key] = value.padEnd(19, ':00');
          } else {
            currentMovie[key] = value || '';
          }
        }
      });
      logTime('Processing category', categoryStartTime);

      const newStructure = {
        SearchMovies: {
          ver: '1',
          num: movieData.movieinfo.length.toString(),
          categid: movieData.categoryid,
          movieinfo: movieData.movieinfo
        }
      };

      const buildStartTime = performance.now();
      const builder = new xml2js.Builder({ headless: true }); // Ensure XML declaration is removed
      let newXml = builder.buildObject(newStructure);
      logTime('Building XML', buildStartTime);

      // Remove XML declaration manually if still present
      newXml = newXml.replace(/^<\?xml.*\?>\n/, '');

      // Write the new XML to a file named after the category ID
      const writeStartTime = performance.now();
      fs.writeFile(path.join(searchDir, `${movieData.categoryid}`), newXml, writeErr => {
        if (writeErr) {
          console.error(`Error writing XML file for category ${movieData.categoryid}:`, writeErr);
          return;
        }
        logTime(`Writing XML file ../v770/url1/list/category/search/${movieData.categoryid}`, writeStartTime);
        console.log(`New XML file ../v770/url1/list/category/search/${movieData.categoryid} has been created!`);
      });
    });
  });
});
