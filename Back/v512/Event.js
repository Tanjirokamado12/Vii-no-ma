const fs = require('fs');
const path = require('path');
const builder = require('xmlbuilder');

// Function to get current date in the desired format
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

// Function to read values from the event.txt file and remove prefixes
function readValuesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8').split('\n');
    return {
        posterid: content[0].split(':')[1].trim(),
        frameid: content[1].split(':')[1].trim(),
        color: content[2].split(':')[1].trim(),
    };
}

// Read values from the event.txt file
const values = readValuesFromFile(path.join(__dirname, '../../files/v512/event.txt'));

// Create the XML structure
const root = builder.create('Event', { headless: true });
root.ele('ver', 1);
root.ele('date', getCurrentDate());
root.ele('posterid', values.posterid);
root.ele('frameid', values.frameid);
root.ele('color', values.color);
root.ele('upddt', '2009-04-23T16:30:00'); // Added quotes around the date string

// Convert the XML object to a string
const xmlString = root.end({ pretty: true });

// Define the output file path
const outputPath = path.join(__dirname, '../../v512/url1/event/today.xml');

// Ensure the directory exists and save the XML string to a file
ensureDirectoryExistence(outputPath);
fs.writeFileSync(outputPath, xmlString);
