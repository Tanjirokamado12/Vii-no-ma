const fs = require('fs');
const path = require('path');

// Define the function to generate dynamic DateTime XML content
function getDateTimeXML() {
    const now = new Date();
    const upddt = now.toISOString().replace(/\.\d{3}Z$/, '');

    return `<DateTime>
    <upddt>${upddt}</upddt>
</DateTime>`;
}

// Define the function to generate dynamic RegionInfo XML content
function getRegInfoXML() {
    const now = new Date();
    const sdt = new Date(now.getTime() - 3600000).toISOString().replace(/\.\d{3}Z$/, ''); // 1 hour earlier
    const cdt = now.toISOString().replace(/\.\d{3}Z$/, '');

    return `<RegionInfo>
    <ver>399</ver>
    <sdt>${sdt}</sdt>
    <cdt>${cdt}</cdt>
    <limited>0</limited>
</RegionInfo>`;
}

// Define the file paths
const regInfoPath = path.join(__dirname, '../v1025/url2/reginfo.cgi');
const dateTimePath = path.join(__dirname, '../v770/url1/conf/datetime.xml');

// Function to write XML content to a file
function writeXML(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File written to: ${filePath}`);
}

// Function to update the XML files every second
function updateXMLFiles() {
    writeXML(regInfoPath, getRegInfoXML());
    writeXML(dateTimePath, getDateTimeXML());
}

// Update the XML files immediately and then every second
updateXMLFiles();
setInterval(updateXMLFiles, 1000);
