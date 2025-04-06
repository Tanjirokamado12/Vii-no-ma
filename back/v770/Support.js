const fs = require('fs');
const path = require('path');

// Define the XML content
const xmlContent = `
<Support>
  <code>1</code>
  <supportid>1</supportid>
  <msg>kasane Teto</msg>
</Support>
`;

// Define the target directory and file path
const targetPath = path.join(__dirname, '../../v770/url2/Pay');
const targetFile = path.join(targetPath, 'support.cgi');

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
