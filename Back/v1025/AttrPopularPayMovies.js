const fs = require('fs');
const path = require('path');

// Define the input file path
const inputFilePath = path.join(__dirname, '../../files/v1025/PopularPayMovies.txt');

// Function to parse and generate XML
function parseAndGenerateXML(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the input file:', err);
            return;
        }

        // Split the file content into lines
        const lines = data.split('\n');
        let xmlContent = `<AttrPopularPayMovies>\n  <ver>1</ver>\n <type>1</type>\n`;
        let currentMovieInfo = '';
        let hasMovieInfo = false;
        let position = 1;

        lines.forEach(line => {
            if (line.startsWith('movieid:')) {
                if (currentMovieInfo && !currentMovieInfo.includes('<movieid>')) {
                    console.warn('Skipping corrupted <movieinfo> block');
                } else if (currentMovieInfo) {
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

                currentMovieInfo = `    <rank>${position}</rank>\n`;
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;
                position++;
            } else if (line.includes(':')) {
                const [key, value] = line.split(':').map(item => item.trim());
                currentMovieInfo += `    <${key}>${value}</${key}>\n`;
            }
        });

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

        xmlContent += `</AttrPopularPayMovies>`;

        fs.writeFile(outputFile, xmlContent, (err) => {
            if (err) {
                console.error('Error writing the XML file:', err);
            } else {
                console.log(`XML file has been successfully created at ${outputFile}`);
            }
        });
    });
}

// Loop to generate files 01.xml to 14.xml
for (let i = 1; i <= 14; i++) {
    const outputFilePath = path.join(__dirname, `../../v1025/url3/pay/list/popular/${i.toString().padStart(2, '0')}.xml`);
    parseAndGenerateXML(inputFilePath, outputFilePath);
}
