const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../../Files/v512/eula.txt');
const outputFilePath2 = path.join(__dirname, '../../v512/url1/conf/eula.xml');

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
  <upddt>2035-02-24T15:08:20.315Z</upddt>
</LicenseAgree>`;

fs.mkdirSync(path.dirname(outputFilePath2), { recursive: true });

fs.writeFileSync(outputFilePath2, xmlContent.trim(), 'utf8');

console.log('eula.xml files for v770 generated successfully!');
