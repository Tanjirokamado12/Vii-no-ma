const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Function to generate dynamic Event XML content for v770
function getV770EventXML(posterId, frameId, color, news) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];

    return `<Event>
    <ver>1</ver>
    <date>${date}</date>
    <posterid>${posterId}</posterid>
    <frameid>${frameId}</frameid>
    <color>${color}</color>
<upddt>2009-04-23T16:30:00</upddt>
</Event>`;
}

// Define the file paths for event.txt, today.xml for v770
const eventFilePath = path.join(__dirname, '../../Files/v512/event.txt');
const v770FilePath = path.join(__dirname, '../../v512/url1/event/today.xml');

// Function to write XML content to a file
function writeEventFile(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
}

// Function to read content from event.txt and generate XML for v770
function generateEventXML() {
    const rl = readline.createInterface({
        input: fs.createReadStream(eventFilePath),
        output: process.stdout,
        terminal: false
    });

    const lines = [];
    rl.on('line', (line) => {
        lines.push(line);
    });

    rl.on('close', () => {
        const posterId = lines[0].split(':')[1].trim();
        const frameId = lines[1].split(':')[1].trim();
        const color = lines[2].split(':')[1].trim();
        const news = lines[4].split(':')[1].trim();

        // Generate the XML content for v770
        const v770EventXML = getV770EventXML(posterId, frameId, color, news);

        // Write the XML content to v770 today.xml
        writeEventFile(v770FilePath, v770EventXML);
    });
}
generateEventXML();
