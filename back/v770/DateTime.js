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
    if (!fs.existsSync(dirname)) {
        try {
            fs.mkdirSync(dirname, { recursive: true });
        } catch (err) {
            error(`Error creating directory ${dirname}:`, err);
        }
    } else {
    }
}

// Function to create the XML structure
function createXML() {
    const root = builder.create('Datetime', { headless: true });
    root.ele('upddt', getCurrentDateTime());
    return root.end({ pretty: true });
}

// Define the output file path
const outputPath = path.join(__dirname, '../../v770/url1/conf/datetime.xml'); // Adjusted for root/v770 structure

// Ensure the directory for the output file exists
ensureDirectoryExistence(outputPath);

// Ensure the file exists, or create it if it doesn't exist
if (!fs.existsSync(outputPath)) {
    try {
        const initialXML = createXML();
        fs.writeFileSync(outputPath, initialXML);
    } catch (err) {
        error(`Error creating file ${outputPath}:`, err);
    }
} else {
}

// Update the XML file every second
setInterval(() => {
    const xmlString = createXML();
    try {
        fs.writeFileSync(outputPath, xmlString);
   } catch (err) {
        error('Error writing XML file:', err);
    }
}, 1000); // Update interval in milliseconds (1000 ms = 1 second)
