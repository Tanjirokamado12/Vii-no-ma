const builder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

// Create the XML structure without the XML declaration
const xml = builder.create('MovieLink', { headless: true })
  .ele('ver', '1').up()
  .ele('linkinfo')
    .ele('movieid', '200').up()
    .ele('paymovid', '1').up()
  .end({ pretty: true });

// Define the file path
const filePath = path.join(__dirname, '../../v770/url1/conf2/paylink.xml');

// Ensure the directories exist or create them
const dirPath = path.dirname(filePath);

fs.mkdir(dirPath, { recursive: true }, (err) => {
  if (err) {
    return error('Error creating directories:', err);
  }

  // Write the XML to the file
  fs.writeFile(filePath, xml, (err) => {
    if (err) {
      return error('Error writing XML to file:', err);
    }
  });
});
