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

// Function to create the XML structure
function createXML() {
    const root = builder.create('RegionInfo', { headless: true });
    root.ele('ver', 1);
    root.ele('sdt', getCurrentDateTime());
    root.ele('cdt', getCurrentDateTime());
    root.ele('limited', 0);

    return root.end({ pretty: true });
}

// Define the output file path
const outputPath = path.join(__dirname, '../../v1025/url2/reginfo.cgi');

// Ensure the directory exists
ensureDirectoryExistence(outputPath);

// Update the XML file every second
setInterval(() => {
    const xmlString = createXML();
    fs.writeFileSync(outputPath, xmlString);
}, 1000); // Update interval in milliseconds (1000 ms = 1 second)
