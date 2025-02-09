const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../files/PayPosterMeta.txt');
const outputDir1 = path.join(__dirname, '../v1025/url3/pay/wall');
const outputDir2 = path.join(__dirname, '../v770/url3/pay/wall');

// Function to read PayPosterMeta.txt and parse the content
function readPayPosterMetaFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const posterMetaList = [];
    let posterMeta = {};

    lines.forEach(line => {
        const [key, value] = line.split(':');

        if (key && value) {
            if (key.trim().toLowerCase() === 'posterid') {
                if (posterMeta.posterid) {
                    posterMetaList.push(posterMeta);
                }
                posterMeta = { posterid: value.trim() };
            } else {
                posterMeta[key.trim().toLowerCase()] = value.trim();
            }
        }
    });

    if (posterMeta.posterid) {
        posterMetaList.push(posterMeta);
    }

    return posterMetaList;
}

// Read the content from PayPosterMeta.txt
const posterMetaList = readPayPosterMetaFile(inputFilePath);

// Create the output directories if they don't exist
fs.mkdirSync(outputDir1, { recursive: true });
fs.mkdirSync(outputDir2, { recursive: true });

// Write the XML content to the output files
posterMetaList.forEach(({ posterid, message, movieid }) => {
    const xmlContent = `<PosterMeta>
  <ver>1</ver>
  <posterid>${posterid}</posterid>
  <msg>${message}</msg>
  <movieid>${movieid}</movieid>
  <type>1</type>
  <aspect>1</aspect>
</PosterMeta>`;
    const fileName = `${posterid}.met`;
    fs.writeFileSync(path.join(outputDir1, fileName), xmlContent.trim(), 'utf8');
    fs.writeFileSync(path.join(outputDir2, fileName), xmlContent.trim(), 'utf8');
});

console.log('XML files for v1025 and v770 generated successfully!');
