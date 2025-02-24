const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../../Files/v512/PosterMeta.txt');
const outputDir2 = path.join(__dirname, '../../v512/url1/wall');

// Function to read PosterMeta.txt and parse the content
function readPosterMetaFile(filePath) {
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

// Read the content from PosterMeta.txt
const posterMetaList = readPosterMetaFile(inputFilePath);

// Create the output directories if they don't exist
fs.mkdirSync(outputDir2, { recursive: true });

// Write the XML content to the output files
posterMetaList.forEach(({ posterid, message, movieid, title }) => {
    const xmlContent = `<PosterMeta>
  <ver>1</ver>
  <posterid>${posterid}</posterid>
  <strdt>2015-02-24T15:08:20.315Z</strdt>
  <enddt>2035-02-24T15:08:20.315Z</enddt>
  <msg>${message}</msg>
  <movieid>${movieid}</movieid>
  <title>${title}</title>
  <upddt>2035-02-24T15:08:20.315Z</upddt>
</PosterMeta>`;
    const fileName = `${posterid}.met`;
    fs.writeFileSync(path.join(outputDir2, fileName), xmlContent.trim(), 'utf8');
});

console.log('XML files for v770 generated successfully!');
