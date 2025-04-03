const fs = require('fs');
const path = require('path');
const xmlBuilder = require('xmlbuilder');

// Define the XML content with the XML declaration temporarily
let xmlContent = xmlBuilder.create('SpPageBin')
  .dec('1.0', 'UTF-8') // Add the XML declaration temporarily
  .ele('ver', '1')
  .end({ pretty: true });

// Remove the XML declaration from the generated XML string
xmlContent = xmlContent.replace(/^<\?xml.*?\?>\n/, '');

// Define the target file path
const targetFilePath = path.join(__dirname, '../../v770/url1/special/allbin.xml');

// Ensure the target directory exists
const targetDir = path.dirname(targetFilePath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Write the XML content to the file
fs.writeFileSync(targetFilePath, xmlContent, 'utf-8');


