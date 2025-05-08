const fs = require('fs');
const path = require('path');

// Define the XML content
const xmlContent = `
<Verify>
  <code>1</code>
  <url>http://127.0.0.1/v1025/url3</url>
  <channelid>1</channelid>
  <key>5ab362aa57dbb1dc16849e3e2d1cf2ff</key>
  <msg>Vote recorded.</msg>
</Verify>
`;

// Define the target directory and file path
const targetPath = path.join(__dirname, '../../v1025/url2/Pay');
const targetFile = path.join(targetPath, 'Verify.cgi');

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
