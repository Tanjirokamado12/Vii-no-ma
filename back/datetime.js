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

// Define the file paths
const dateTimePath = path.join(__dirname, '../v770/url1/conf/datetime.xml');

// Function to write XML content to a file
function writeXML(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
}

// Function to update the XML files every second
function updateXMLFiles() {
    writeXML(dateTimePath, getDateTimeXML());
}

// Update the XML files immediately and then every second
updateXMLFiles();
setInterval(updateXMLFiles, 1000);
