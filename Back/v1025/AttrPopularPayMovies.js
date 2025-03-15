const fs = require('fs');
const path = require('path');

// Ensure the parent directories exist before creating a file
function ensureDirectoryExistence(filePath) {
    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
}

// Function to parse and generate XML from input file
function parseAndGenerateXML(inputFile, outputFile) {
    ensureDirectoryExistence(outputFile); // Ensure the directory exists

    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the input file:', err);
            return;
        }

        // Split input file into lines
        const lines = data.split('\n');
        let xmlContent = `<AttrPopularPayMovies>\n  <ver>1</ver>\n  <type>1</type>\n`;
        let currentMovieInfo = '';
        let position = 1;

        lines.forEach(line => {
            if (line.startsWith('movieid:')) {
                if (currentMovieInfo) {
                    currentMovieInfo += generateFixedMovieInfo();
                    xmlContent += `  <movieinfo>\n${currentMovieInfo}  </movieinfo>\n`;
                }

                currentMovieInfo = `    <rank>${position}</rank>\n`;
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;
                position++;
            } else if (line.includes(':')) {
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;
            }
        });

        // Add the last movie block if it exists
        if (currentMovieInfo) {
            currentMovieInfo += generateFixedMovieInfo();
            xmlContent += `  <movieinfo>\n${currentMovieInfo}  </movieinfo>\n`;
        }

        xmlContent += `</AttrPopularPayMovies>`;

        fs.writeFile(outputFile, xmlContent, (err) => {
            if (err) {
                console.error('Error writing the XML file:', err);
            } else {
                console.log(`XML file successfully created at ${outputFile}`);
            }
        });
    });
}

// Function to generate fixed XML tags for each movie
function generateFixedMovieInfo() {
    return `    <strdt>2025-03-15T10:27:31</strdt>\n` +
           `    <pop>1</pop>\n` +
           `    <kana>12345678</kana>\n` +
           `    <refid>01234567890123456789012345678912</refid>\n` +
           `    <released>2016-04-21</released>\n` +
           `    <term>1</term>\n` +
           `    <price>0</price>\n` +
           `    <genre>1</genre>\n` +
           `    <pop>0</pop>\n`;
}

// Loop to generate multiple XML files
const inputFilePath = path.join(__dirname, '../../files/v1025/PopularPayMovies.txt');
for (let i = 1; i <= 14; i++) {
    const outputFilePath = path.join(__dirname, `../../v1025/url3/pay/list/popular/${i.toString().padStart(2, '0')}.xml`);
    parseAndGenerateXML(inputFilePath, outputFilePath);
}
