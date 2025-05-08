const fs = require('fs');
const path = require('path');
const { create } = require('xmlbuilder2');

// Function to ensure the directory exists
function ensureDirectoryExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Main function to process the input file and generate the XML
function processInputToXML(inputFile, outputFile) {
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = fileContent.trim().split('\n');

    const root = create({ version: '1.0' }).ele('AllPopularMovies');
    root.ele('ver').txt('1');

    let currentCategId = null;
    let rank = 1;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine === '') return; // Skip empty lines

        if (trimmedLine.startsWith('categid:')) {
            // New category starts, reset rank and update categid
            currentCategId = trimmedLine.split(':')[1];
            rank = 1; // Reset rank for the new category
        } else if (trimmedLine.startsWith('movieid:')) {
            // Parse movie details
            const movieid = trimmedLine.split(':')[1];
            const title = lines[index + 1].split(':')[1].trim();
            const genre = lines[index + 2].split(':')[1].trim();

            // Create a new movieinfo block
            const movieinfo = root.ele('movieinfo');
            movieinfo.ele('rank').txt(rank); // Assign the current rank
            movieinfo.ele('movieid').txt(movieid);
            movieinfo.ele('title').txt(title);
            movieinfo.ele('genre').txt(genre);
            movieinfo.ele('strdt').txt('2000-01-01T00:00:00'); // Default date
            movieinfo.ele('pop').txt(0); // Default popularity

            rank++; // Increment rank after each movie
        }
    });

    // Ensure the output directory exists
    ensureDirectoryExists(outputFile);

    // Generate and write the XML to file without `<?xml version="1.0?>`
    const xmlOutput = root.end({ prettyPrint: true, headless: true });
    fs.writeFileSync(outputFile, xmlOutput, 'utf-8');

}

// Example usage
const inputFile = '../files/v1025/Categorymovies.txt'; // Input file path
const outputFile = '../v1025/url1/list/popular/all.xml'; // Output file path
processInputToXML(inputFile, outputFile);
