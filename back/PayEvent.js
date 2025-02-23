const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../files/PayEvent.txt');
const filePath2 = path.join(__dirname, '../v770/url3/pay/event/today.xml');

// Function to read PayEvent.txt and parse the content
function readPayEventFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const posterData = [];

    for (let i = 0; i < lines.length; i += 2) { // Fix the syntax error here
        const posterid = lines[i].split(':')[1].trim();
        const geofilter = lines[i + 1].split(':')[1].trim();
        posterData.push({ posterid, geofilter });
    }

    return posterData.slice(0, 2);
}

// Read the content from PayEvent.txt
const posterData = readPayEventFile(inputFilePath);

// Get today's date in the desired format (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0];

// Define the XML content for v1025
const xmlContent1 = `<PayEvent>
  <ver>1</ver>
  <date>${today}</date>
  <postertime>5</postertime>
${posterData.map(({ posterid, geofilter }, index) => `
  <posterinfo>
    <seq>${index + 1}</seq>
    <posterid>${posterid}</posterid>
    <geofilter>${geofilter}</geofilter>
  </posterinfo>`).join('')}
  <introinfo>
    <seq>1</seq>
    <cntid>1</cntid>
    <cnttype>1</cnttype>
    <random>0</random>
    <linktype>0</linktype>
    <dispsec>5</dispsec>
    <dimg>1</dimg>
  </introinfo>
</PayEvent>`;

// Define the XML content for v770 with posterid1 and posterid2
const xmlContent2 = `<Event>
  <ver>1</ver>
  <date>${today}</date>
  <posterid1>${posterData[0] ? posterData[0].posterid : ''}</posterid1>
  <posterid2>${posterData[1] ? posterData[1].posterid : ''}</posterid2>
</Event>`;

// Create directories if they don't exist
fs.mkdirSync(path.dirname(filePath2), { recursive: true });

// Write the XML content to the files
fs.writeFileSync(filePath2, xmlContent2.trim(), 'utf8');

console.log('XML files for  v770 generated successfully!');
