const fs = require('fs');
const path = require('path');

// Define the XML content
const xmlContent = `
<PayEvaluate>
  <code>1</code>
  <msg>Thanks for Evaluating</msg>
</PayEvaluate>
`;

// Define the target directory and file path
const targetPath = path.join(__dirname, '../../v1025/url2/pay');
const targetFile = path.join(targetPath, 'Pevaluate.cgi');

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
