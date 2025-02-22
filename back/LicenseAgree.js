const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../files/eula.txt');
const outputFilePath1 = path.join(__dirname, '../v1025/url1/conf/eula.xml');
const outputFilePath2 = path.join(__dirname, '../v770/url1/conf/eula.xml');

// Function to read eula.txt and parse the content
function readEulaFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.trim();
}

// Read the content from eula.txt
const eulaContent = readEulaFile(inputFilePath);

// Define the XML content
const xmlContent = `<LicenseAgree>
  <ver>1</ver>
  <agree>${eulaContent}</agree>
</LicenseAgree>`;

// Create the output directories if they don't exist
fs.mkdirSync(path.dirname(outputFilePath1), { recursive: true });
fs.mkdirSync(path.dirname(outputFilePath2), { recursive: true });

// Write the XML content to the output files
fs.writeFileSync(outputFilePath1, xmlContent.trim(), 'utf8');
fs.writeFileSync(outputFilePath2, xmlContent.trim(), 'utf8');

console.log('eula.xml files for v1025 and v770 generated successfully!');
