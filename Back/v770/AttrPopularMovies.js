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

// Main function to process the input file and generate multiple XML files
function processInputToMultipleXMLs(inputFile, outputDir, fileCount) {
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    const lines = fileContent.trim().split('\n');

    for (let fileIndex = 1; fileIndex <= fileCount; fileIndex++) {
        const root = create({ version: '1.0' }).ele('AttrPopularMovies');
        root.ele('ver').txt('1');
        root.ele('type').txt('1');

        let currentCategId = null;
        let rank = 1;

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (trimmedLine === '') return; // Skip empty lines

            if (trimmedLine.startsWith('categid:')) {
                currentCategId = trimmedLine.split(':')[1];
                rank = 1; // Reset rank for each category
            } else if (trimmedLine.startsWith('movieid:')) {
                const movieid = trimmedLine.split(':')[1];
                const title = lines[index + 1].split(':')[1].trim();
                const genre = lines[index + 2].split(':')[1].trim();

                const movieinfo = root.ele('movieinfo');
                movieinfo.ele('rank').txt(rank);
                movieinfo.ele('movieid').txt(movieid);
                movieinfo.ele('title').txt(title);
                movieinfo.ele('genre').txt(genre);
                movieinfo.ele('strdt').txt('2000-01-01T00:00:00'); // Default date
                movieinfo.ele('pop').txt(0); // Default popularity

                rank++;
            }
        });

        // Generate the output filename dynamically
        const outputFile = path.join(outputDir, `${String(fileIndex).padStart(2, '0')}.xml`);

        // Ensure the output directory exists
        ensureDirectoryExists(outputFile);

        // Generate and write the XML to file
        const xmlOutput = root.end({ prettyPrint: true, headless: true });
        fs.writeFileSync(outputFile, xmlOutput, 'utf-8');

    }
}

// Example usage
const inputFile = '../files/v770/Categorymovies.txt'; // Input file path
const outputDir = '../v770/url1/list/popular/'; // Directory for output files
const fileCount = 14; // Number of XML files to generate
processInputToMultipleXMLs(inputFile, outputDir, fileCount);
