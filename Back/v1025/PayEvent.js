const fs = require('fs');
const path = require('path');
const { create } = require('xmlbuilder2');

// Define paths
const inputPath = path.join(__dirname, '../../files/v1025/PayEvent.txt');
const outputPath = path.join(__dirname, '../../v1025/url3/pay/event/today.xml');

// Read data from PayEvent.txt
const data = fs.readFileSync(inputPath, 'utf8').split(/\r?\n/);
const dataMap = {};

// Parse each line separately
data.forEach(line => {
  const [key, value] = line.split(':').map(item => item.trim());
  dataMap[key.toLowerCase()] = value;
});

const posterid1 = dataMap['posterid1'];
const posterid2 = dataMap['posterid2'];
const intromovid = dataMap['intromovieid'];

// Validate that intromovid is 16 numbers
if (!/^\d{16}$/.test(intromovid)) {
  console.error('Invalid intromovid: should be 16 numbers');
  process.exit(1);
}

// Create XML structure without declaration
const xml = create()
  .ele('Event')
    .ele('ver').txt(1).up()
    .ele('date').txt('2025-01-30').up()
    .ele('postertime').txt('5').up()
    .ele('posterinfo')
      .ele('seq').txt(1).up()
      .ele('posterid').txt(posterid1).up()
      .ele('geofilter').txt(0).up()
    .up()
    .ele('posterinfo')
      .ele('seq').txt(2).up()
      .ele('posterid').txt(posterid2).up()
      .ele('geofilter').txt(0).up()
    .up()
    .ele('introinfo')
      .ele('seq').txt(1).up()
      .ele('cntid').txt(1).up()
      .ele('cnttype').txt(1).up()
      .ele('dispsec').txt(5).up()
      .ele('dimg').txt(1).up()
      .ele('random').txt(0).up()
      .ele('linktype').txt(0).up()
    .up()
  .end({ prettyPrint: true, headless: true });

// Ensure the output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the XML to a file
fs.writeFileSync(outputPath, xml);
