const fs = require('fs');
const path = require('path');
const builder = require('xmlbuilder');

// Function to get current date and time in the desired format
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Function to ensure the directory exists
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// Create the XML structure
const root = builder.create('DateTime', { headless: true });
root.ele('upddt', getCurrentDateTime());

// Convert the XML object to a string
const xmlString = root.end({ pretty: true });

// Define the output file path
const outputPath = path.join(__dirname, '../../v770/url1/conf/datetime.xml');

// Ensure the directory exists and save the XML string to a file
ensureDirectoryExistence(outputPath);
fs.writeFileSync(outputPath, xmlString);

