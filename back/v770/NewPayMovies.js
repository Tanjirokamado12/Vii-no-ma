const fs = require('fs');
const path = require('path');

// Define input and output file paths
const inputFilePath = path.join(__dirname, '../../files/v770/NewPayMovies.txt'); // Path to input text file
const outputFilePath = path.join(__dirname, '../../v770/url3/pay/list/New/all.xml'); // Path to output XML file

// Ensure the directory for the output file exists
fs.mkdir(path.dirname(outputFilePath), { recursive: true }, (err) => {
    if (err) {
        error('Error creating directories:', err);
        return;
    }
    // Call the function to parse and generate the XML
    parseAndGenerateXML(inputFilePath, outputFilePath);
});

// Function to parse the input text file and generate XML
function parseAndGenerateXML(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            error('Error reading the input file:', err);
            return;
        }

        // Split the file content into lines
        const lines = data.split('\n');
        let xmlContent = `<NewPayMovies>\n  <ver>1</ver>\n`;
        let currentMovieInfo = ''; // Holds the content of the current <movieinfo>
        let hasMovieInfo = false; // Tracks if a <movieinfo> block is open
        let position = 1; // Initialize position counter for rank

        lines.forEach(line => {
            if (line.startsWith('movieid:')) {
                // Check if the current block is valid before closing it
                if (currentMovieInfo && !currentMovieInfo.includes('<movieid>')) {
                } else if (currentMovieInfo) {
                    // Add static fields to the valid block
                    currentMovieInfo += `    <strdt>2025-03-15T10:27:31</strdt>\n`;
                    currentMovieInfo += `    <pop>1</pop>\n`;
                    currentMovieInfo += `    <kana>12345678</kana>\n`;
                    currentMovieInfo += `    <refid>01234567890123456789012345678912</refid>\n`;
                    currentMovieInfo += `    <released>2016-04-21</released>\n`;
                    currentMovieInfo += `    <term>1</term>\n`;
                    currentMovieInfo += `    <price>0</price>\n`;
                    currentMovieInfo += `    <genre>1</genre>\n`;
                    currentMovieInfo += `    <pop>0</pop>\n`;

                    xmlContent += `  <movieinfo>\n${currentMovieInfo}  </movieinfo>\n`;
                }
                hasMovieInfo = true;

                // Start a new <movieinfo> block, adding <rank> before <movieid>
                currentMovieInfo = `    <rank>${position}</rank>\n`;
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;
                position++;
            } else if (line.includes(':')) {
                // Add other key-value pairs to the current <movieinfo> block
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;
            }
        });

        // Add the last <movieinfo> block if it's valid
        if (hasMovieInfo && currentMovieInfo && currentMovieInfo.includes('<movieid>')) {
            currentMovieInfo += `    <strdt>2025-03-15T10:27:31</strdt>\n`;
            currentMovieInfo += `    <pop>1</pop>\n`;
            currentMovieInfo += `    <kana>12345678</kana>\n`;
            currentMovieInfo += `    <refid>01234567890123456789012345678912</refid>\n`;
            currentMovieInfo += `    <released>2016-04-21</released>\n`;
            currentMovieInfo += `    <term>1</term>\n`;
            currentMovieInfo += `    <price>0</price>\n`;
            currentMovieInfo += `    <genre>1</genre>\n`;
            currentMovieInfo += `    <pop>0</pop>\n`;

            xmlContent += `  <movieinfo>\n${currentMovieInfo}  </movieinfo>\n`;
        }

        // Close the root node
        xmlContent += `</NewPayMovies>`;

        // Write the generated XML to the output file
        fs.writeFile(outputFile, xmlContent, (err) => {
            if (err) {
                error('Error writing the XML file:', err);
            } else {
            }
        });
    });
}

// Call the function to parse and generate the XML
parseAndGenerateXML(inputFilePath, outputFilePath);
