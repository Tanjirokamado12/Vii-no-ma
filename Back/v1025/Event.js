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
    const introinfoIndexes = content
        .map((line, index) => (line.includes('<introinfo>') ? index : -1))
        .filter(index => index !== -1);
    const introinfoContents = introinfoIndexes.map((startIndex, i) => {
        const endIndex = introinfoIndexes[i + 1] || content.length;
        return content.slice(startIndex, endIndex).join('\n').trim();
    });
    return {
        posterids: content.filter(line => line.startsWith('posterid')).map(line => line.split(':')[1].trim()),
        frameid: content.find(line => line.startsWith('frameid')).split(':')[1].trim(),
        color: content.find(line => line.startsWith('color')).split(':')[1].trim(),
        news: content.find(line => line.startsWith('news')).split(':')[1].trim(),
        introinfos: introinfoContents // Read introinfo sections
    };
}

// Function to parse the introinfo content and build XML elements
function addIntroInfo(xmlRoot, introinfoContent) {
    const parser = require('xml2js').parseString;
    parser(introinfoContent, (err, result) => {
        if (err) {
            throw new Error('Failed to parse introinfo content');
        }
        const introinfoElement = xmlRoot.ele('introinfo');
        Object.entries(result.introinfo).forEach(([key, value]) => {
            introinfoElement.ele(key, value[0]);
        });
    });
}

// Read values from the event.txt file
const values = readValuesFromFile(path.join(__dirname, '../../files/v1025/event.txt'));

// Create the XML structure
const root = builder.create('Event', { headless: true });
root.ele('ver', 1);
root.ele('date', getCurrentDate());
root.ele('frameid', values.frameid);
root.ele('color', values.color);
root.ele('postertime', 5); // Add postertime with value 5

// Add posterinfo elements
values.posterids.forEach((posterid, index) => {
    const posterInfo = root.ele('posterinfo');
    posterInfo.ele('seq', index + 1); // Sequence number
    posterInfo.ele('posterid', posterid);
});

// Add introinfo elements directly from the text file content
values.introinfos.forEach(introinfoContent => {
    addIntroInfo(root, introinfoContent);
});

const newsinfo = root.ele('newsinfo');
newsinfo.ele('page', 1);
newsinfo.ele('news', values.news);

const adinfo = root.ele('adinfo');
adinfo.ele('pref', 2);
adinfo.ele('adid', 1);
adinfo.ele('pref', 1);
adinfo.ele('adid', 1);

// Convert the XML object to a string
const xmlString = root.end({ pretty: true });

// Define the output file path
const outputPath = path.join(__dirname, '../../v1025/url1/event/today.xml');

// Ensure the directory exists and save the XML string to a file
ensureDirectoryExistence(outputPath);
fs.writeFileSync(outputPath, xmlString);

