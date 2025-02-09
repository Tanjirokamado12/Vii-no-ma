const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../files/MovieLink.txt');
const outputFilePath1 = path.join(__dirname, '../v1025/url1/conf2/paylink.xml');
const outputFilePath2 = path.join(__dirname, '../v770/url1/conf2/paylink.xml');

// Function to read MovieLink.txt and parse the content
function readMovieLinkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    let movieid = '';
    let paymovid = '';

    lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key.trim().toLowerCase() === 'movieid') {
            movieid = value.trim();
        } else if (key.trim().toLowerCase() === 'paymovid') {
            paymovid = value.trim();
        }
    });

    return { movieid, paymovid };
}

// Read the content from MovieLink.txt
const { movieid, paymovid } = readMovieLinkFile(inputFilePath);

// Define the XML content
const xmlContent = `<MovieLink>
  <ver>1</ver>
  <linkinfo>
    <movieid>${movieid}</movieid>
    <paymovid>${paymovid}</paymovid>
  </linkinfo>
</MovieLink>`;

// Create the output directories if they don't exist
fs.mkdirSync(path.dirname(outputFilePath1), { recursive: true });
fs.mkdirSync(path.dirname(outputFilePath2), { recursive: true });

// Write the XML content to the output files
fs.writeFileSync(outputFilePath1, xmlContent.trim(), 'utf8');
fs.writeFileSync(outputFilePath2, xmlContent.trim(), 'utf8');

console.log('XML files for v1025 and v770 generated successfully!');
