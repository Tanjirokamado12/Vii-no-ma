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
    fs.mkdirSync(dirname, { recursive: true }); // Updated to use recursive option
}

// Function to read values from the event.txt file and remove prefixes
function readValuesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8').split('\n');
    return {
        posterids: content.filter(line => line.startsWith('posterid')).map(line => line.split(':')[1].trim()),
        miiids: content.filter(line => line.startsWith('miiid')).map(line => line.split(':')[1].trim()),
        frameid: content.find(line => line.startsWith('frameid')).split(':')[1].trim(),
        color: content.find(line => line.startsWith('color')).split(':')[1].trim(),
    };
}

// Read values from the event.txt file
const values = readValuesFromFile(path.join(__dirname, '../../files/v512/event.txt'));

// Create the XML structure
const root = builder.create('Event', { headless: true });
root.ele('ver', 1);
root.ele('date', getCurrentDate());
root.ele('posterid', values.posterids.join(',')); // Concatenate poster IDs if needed
root.ele('frameid', values.frameid);
root.ele('color', values.color);

// Add miiinfo elements
values.miiids.forEach((miiid, index) => {
    const miiInfo = root.ele('miiinfo');
    miiInfo.ele('seq', index + 1);
    miiInfo.ele('miiid', miiid);
});

root.ele('upddt', '2009-04-23T16:30:00');

// Convert the XML object to a string
const xmlString = root.end({ pretty: true });

// Define the output file path
const outputPath = path.join(__dirname, '../../v512/url1/event/today.xml');

// Ensure the directory exists and save the XML string to a file
ensureDirectoryExistence(outputPath);
fs.writeFileSync(outputPath, xmlString);
