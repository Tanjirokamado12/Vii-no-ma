const fs = require('fs');
const path = require('path');
const inputPath = path.resolve(__dirname, '../../files/v770/NewPayMovies.txt');
const outputDir = path.resolve(__dirname, '../../v770/url3/pay/list/new');
const outputPath = path.join(outputDir, 'all.xml');

// Function to generate NewPayMovies XML
function generateNewPayMovies() {
    fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading input file:', err);
            return;
        }

        const xmlContent = `<NewPayMovies>\n  <ver>1</ver>\n  ${data.trim()}\n</NewPayMovies>`;
        fs.mkdir(outputDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating output directory:', err);
                return;
            }
            fs.writeFile(outputPath, xmlContent, (err) => {
                if (err) {
                    console.error('Error writing output file:', err);
                    return;
                }
            });
        });
    });
}

// Watch the input file for changes
function watchInputFile() {
    fs.watchFile(inputPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            // File has been updated, regenerate NewPayMovies XML
            generateNewPayMovies();
        }
    });
}

// Check if the input file exists
fs.access(inputPath, fs.constants.F_OK, (err) => {
    if (err) {
        // Input file does not exist
        console.error('Input file does not exist:', inputPath);
    } else {
        generateNewPayMovies();
        watchInputFile(); // Start watching for changes
    }
});

// Call the functions to initiate processes
generateNewPayMovies();
watchInputFile();
