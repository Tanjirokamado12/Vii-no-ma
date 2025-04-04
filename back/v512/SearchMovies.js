const fs = require('fs');
const path = require('path');

// Define the XML content
const xmlContent = `
<SearchMovies>
  <ver>1</ver>
  <num>12344</num>
  <upddt>2009-04-23T16:30:00</upddt>
</SearchMovies>
`;

// Define the target directory and file path
const targetPath = path.join(__dirname, '../../v512/url2');
const targetFile = path.join(targetPath, 'Search.cgi');

// Function to create directories if they don't exist
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Function to write XML content to file
const writeXMLToFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf8');
};

// Create the target directory if it doesn't exist
createDirectoryIfNotExists(targetPath);

// Write the XML content to the target file
writeXMLToFile(targetFile, xmlContent);
