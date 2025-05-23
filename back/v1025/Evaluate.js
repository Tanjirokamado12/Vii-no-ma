const fs = require('fs');
const path = require('path');

// Define the XML content
const xmlContent = `
<Evaluate>
  <code>1</code>
  <msg>Thanks for Evaluating</msg>
</Evaluate>
`;

// Define the target directory and file path
const targetPath = path.join(__dirname, '../../v1025/url2');
const targetFile = path.join(targetPath, 'evaluate.cgi');

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
