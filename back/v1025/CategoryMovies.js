const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '../../files/v1025/categoryMovies.txt');
const outputDir = path.join(__dirname, '../../v1025/url1/list/category/search');
const outputFileListPath = path.join(outputDir, 'outputFileList.txt');

// Ensure output directory exists
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
    return true;
}

// Convert input data to XML
function convertToXML(data) {
    let lines = data.split('\n');
    let categid = '';
    let movieInfos = [];
    let currentMovieInfo = null;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('categid:')) {
            categid = lines[i].split(':')[1].trim();
            if (currentMovieInfo) {
                // End previous movie info block if it exists
                currentMovieInfo.movies.push('    </movieinfo>\n');
                movieInfos.push(currentMovieInfo);
            }
            currentMovieInfo = { categid: categid, movies: [] };
        } else if (lines[i].startsWith('rank:')) {
            if (currentMovieInfo.movies.length > 0) {
                // Close previous movieinfo block
                currentMovieInfo.movies.push('    </movieinfo>\n');
            }
            // Start a new movieinfo block
            currentMovieInfo.movies.push('    <movieinfo>\n');
            let [key, value] = lines[i].split(':');
            currentMovieInfo.movies.push(`        <${key.trim()}>${value.trim()}</${key.trim()}>\n`);
        } else if (lines[i].includes(':')) {
            let [key, value] = lines[i].split(':');
            currentMovieInfo.movies.push(`        <${key.trim()}>${value.trim()}</${key.trim()}>\n`);
            if (key.trim() === 'genre') {
                currentMovieInfo.movies.push(`        <strdt>2020-01-01T00:00:00</strdt>\n`);
            }
        }
    }
    if (currentMovieInfo) {
        // Close the last movieinfo block if it exists
        currentMovieInfo.movies.push('    </movieinfo>\n');
        movieInfos.push(currentMovieInfo);
    }

    return movieInfos.map(info => {
        let movieInfoContent = info.movies.join('');
        let xmlContent = `<SearchMovies>\n  <ver>1</ver>\n  <num>1</num>\n    <categid>${info.categid}</categid>\n    ${movieInfoContent}  </SearchMovies>`;
        return { xmlContent, categid: info.categid };
    });
}

// Read input file and process data
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        error('Error reading the input file:', err);
        return;
    }
    
    const xmlFiles = convertToXML(data);
    let outputFileContent = '';

    xmlFiles.forEach(file => {
        const outputFilePath = path.join(outputDir, `${file.categid}`);
        ensureDirectoryExistence(outputFilePath);
        fs.writeFile(outputFilePath, file.xmlContent, (err) => {
            if (err) {
                error(`Error writing XML file for categid ${file.categid}:`, err);
            } else {
            }
        });
        outputFileContent += `${file.categid}.xml\n`;
    });

    fs.writeFile(outputFileListPath, outputFileContent, (err) => {
        if (err) {
            error('Error writing output file list:', err);
        } else {
        }
    });
});
