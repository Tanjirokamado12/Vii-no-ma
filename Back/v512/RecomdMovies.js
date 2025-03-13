const fs = require('fs');
const path = require('path');

// Function to parse the input file
function parseTextFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
    const data = {};
    let currentType = null;
    let currentMovie = null;

    lines.forEach(line => {
        if (line.startsWith('type:')) {
            currentType = `type${line.split(':')[1].trim()}`;
            if (!data[currentType]) {
                data[currentType] = [];
            }
        } else if (currentType) {
            const [key, value] = line.split(':').map(str => str.trim());

            if (key === 'movieid' || key === 'title') {
                if (!currentMovie) {
                    currentMovie = {};
                }
                currentMovie[key] = value || ''; // Assign value or an empty string

                // If both `movieid` and `title` are present, push the movie to the current type
                if (currentMovie.movieid && currentMovie.title) {
                    data[currentType].push(currentMovie);
                    currentMovie = null; // Reset for the next movie
                }
            }
        }
    });

    return data;
}


// Function to generate XML content
function generateXml(genre, movies) {
    let xmlContent = `<RecomdMovies>\n`;
    xmlContent += `  <ver>1</ver>\n`;
    movies.forEach((movie, index) => {
        xmlContent += `  <movieinfo>\n`;
        xmlContent += `    <rank>${index + 1}</rank>\n`; // Sequential rank
        xmlContent += `    <movieid>${movie.movieid || ''}</movieid>\n`;
        xmlContent += `    <title>${movie.title || ''}</title>\n`;
        xmlContent += `    <strdt>2009-04-23T16:30:00</strdt>\n`;
        xmlContent += `    <enddt>2035-04-23T16:30:00</enddt>\n`;
        xmlContent += `    <pay>0</pay>\n`;
        xmlContent += `  </movieinfo>\n`;
    });
    xmlContent += `  <upddt>${new Date().toISOString()}</upddt>\n`; // Use current timestamp
    xmlContent += `</RecomdMovies>`;
    return xmlContent;
}

// Function to ensure directories exist
function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

// Function to save XML files
function saveXmlFiles(movieData) {
    Object.keys(movieData).forEach(typeKey => {
        const movies = movieData[typeKey];
        const genreNumber = typeKey.match(/\d+/)[0]; // Extract numerical genre
        const outputDir = path.join(__dirname, '../../v512/url1/list/recomd/'); // Output directory
        ensureDirectoryExists(outputDir); // Ensure the output directory exists
        const fileName = `all.xml`; // Create file name
        const filePath = path.join(outputDir, fileName);
        const xmlContent = generateXml(genreNumber, movies);

        fs.writeFileSync(filePath, xmlContent, 'utf8'); // Write XML to file

    });
}

// Main execution
const inputFile = path.join(__dirname, '../../files/v512/RecomdMovies.txt');
if (fs.existsSync(inputFile)) {
    const movieData = parseTextFile(inputFile);
    saveXmlFiles(movieData);
} else {
    console.error(`Input file not found: ${inputFile}`);
}
