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
            error('Error reading the input file:', err);
            return;
        }

        // Split input file into lines
        const lines = data.split('\n');
        let xmlContent = `<AttrPopularPayMovies>\n  <ver>1</ver>\n  <type>1</type>\n`;
        let currentMovieInfo = '';
        let position = 1;

        lines.forEach(line => {
            if (line.startsWith('movieid:')) {
                // Append valid movie blocks to the XML
                if (currentMovieInfo && !isCorruptedBlock(currentMovieInfo)) {
                    xmlContent += `  <movieinfo>\n${currentMovieInfo}${generateFixedMovieInfo()}  </movieinfo>\n`;
                }

                // Start a new movie block
                currentMovieInfo = `    <rank>${position}</rank>\n`;
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;

                // Add title placeholder after movieid
                currentMovieInfo += `    <title>Unknown Title</title>\n`;
                position++;
            } else if (line.includes(':')) {
                // Add key-value pairs to the current movie block
                const [key, value] = line.split(':').map(item => item.trim());
                // Avoid adding duplicate keys like <title> or <rank>
                if (!currentMovieInfo.includes(`<${key}>`)) {
                    currentMovieInfo += `    <${key}>${value}</${key}>\n`;
                }
            }
        });

        // Add the final movie block if valid
        if (currentMovieInfo && !isCorruptedBlock(currentMovieInfo)) {
            xmlContent += `  <movieinfo>\n${currentMovieInfo}${generateFixedMovieInfo()}  </movieinfo>\n`;
        }

        // Close the root XML tag
        xmlContent += `</AttrPopularPayMovies>`;

        // Write the final XML content to the output file
        fs.writeFile(outputFile, xmlContent, (err) => {
            if (err) {
                error('Error writing the XML file:', err);
            }
        });
    });
}

// Function to check for corrupted blocks
function isCorruptedBlock(block) {
    // A corrupted block contains only <rank> with no other tags
    const lines = block.trim().split('\n');
    return lines.length === 1 && lines[0].includes('<rank>');
}

// Function to generate fixed XML tags for each movie
function generateFixedMovieInfo() {
    return `    <kana>12345678</kana>\n` +
           `    <refid>01234567890123456789012345678912</refid>\n` +
           `    <strdt>2025-03-15T10:27:31</strdt>\n` +
           `    <pop>1</pop>\n` +
           `    <released>2016-04-21</released>\n` +
           `    <term>1</term>\n` +
           `    <price>0</price>\n` +
           `    <genre>1</genre>\n` +
           `    <pop>0</pop>\n`;
}

// Loop to generate multiple XML files
const inputFilePath = path.join(__dirname, '../../files/v770/PopularPayMovies.txt');
for (let i = 1; i <= 14; i++) {
    const outputFilePath = path.join(__dirname, `../../v770/url3/pay/list/popular/${i.toString().padStart(2, '0')}.xml`);
    parseAndGenerateXML(inputFilePath, outputFilePath);
}
