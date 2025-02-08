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
    <newsinfo>
        <page>1</page>
        <news>${news}</news>
    </newsinfo>
    <adinfo>
        <pref>2</pref>
        <adid>1</adid>
        <pref>1</pref>
        <adid>1</adid>
    </adinfo>
</Event>`;
}

// Function to generate dynamic Event XML content for v1025
function getV1025EventXML(posterId, frameId, color, news) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];

    return `<Event>
    <ver>399</ver>
    <date>${date}</date>
    <frameid>${frameId}</frameid>
    <color>${color}</color>
    <postertime>5</postertime>
    <posterinfo>
        <seq>1</seq>
        <posterid>${posterId}</posterid>
    </posterinfo>
    <newsinfo>
        <page>1</page>
        <news>${news}</news>
    </newsinfo>
    <adinfo>
        <pref>2</pref>
        <adid>1</adid>
        <pref>1</pref>
        <adid>1</adid>
    </adinfo>
    <introinfo>
        <seq>1</seq>
        <cntid>1</cntid>
        <cnttype>1</cnttype>
        <random>0</random>
        <linktype>0</linktype>
        <dispsec>5</dispsec>
        <dimg>1</dimg>
    </introinfo>
</Event>`;
}

// Define the file paths for event.txt, today.xml for v770, and today.xml for v1025
const eventFilePath = path.join(__dirname, '../Files/event.txt');
const v770FilePath = path.join(__dirname, '../v770/url1/event/today.xml');
const v1025FilePath = path.join(__dirname, '../v1025/url1/event/today.xml');

// Function to write XML content to a file
function writeEventFile(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File written to: ${filePath}`);
}

// Function to read content from event.txt and generate XML for v770 and v1025
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
        // Generate the XML content for v1025
        const v1025EventXML = getV1025EventXML(posterId, frameId, color, news);

        // Write the XML content to v770 today.xml
        writeEventFile(v770FilePath, v770EventXML);
        // Write the XML content to v1025 today.xml
        writeEventFile(v1025FilePath, v1025EventXML);
    });
}

// Generate the event XML based on event.txt content for both v770 and v1025
generateEventXML();
