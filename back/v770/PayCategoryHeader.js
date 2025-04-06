const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// Function to decode HTML entities
function decodeHTMLEntities(text) {
  return text.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#xD;/g, '\r');
}

// Function to generate XML with provided values
function generateXML(filePath) {
  // Read the content of the specified file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      error('Error reading file:', err);
      return;
    }

    // Parse the content to get the image value and listinfo elements
    const imgValue = data.match(/img:(\d+)/)[1].trim();
    const listinfoData = data.split(/img:\d+/)[1].trim();

    // Decode HTML entities in listinfo data
    const decodedListinfoData = decodeHTMLEntities(listinfoData);
    const listinfos = decodedListinfoData.split('</listinfo>');

    // Create the XML object
    const xml = xmlbuilder.create('PayCategoryHeader', { headless: true })
      .ele('ver', '1').up()
      .ele('img', imgValue).up();

    // Add listinfo elements to the XML object
    listinfos.forEach((info) => {
      if (info.trim()) {
        const [place, type, text] = info.match(/<place>(\d+)<\/place>\s*<type>(\d+)<\/type>\s*<text>(\d+)<\/text>/).slice(1);
        xml.ele('listinfo')
          .ele('place', place).up()
          .ele('type', type).up()
          .ele('text', text).up()
          .up();
      }
    });

    // Convert XML object to string
    const xmlString = xml.end({ pretty: true });

    // Define the output directory and file path
    const outputDir = path.join(__dirname, '../../v770/url3/pay/list/category');
    const outputFilePath = path.join(outputDir, 'header.xml');

    // Create the directory if it doesn't exist
    fs.mkdir(outputDir, { recursive: true }, (err) => {
      if (err) {
        error('Error creating directory:', err);
        return;
      }

      // Write the XML string to a file
      fs.writeFile(outputFilePath, xmlString, (err) => {
        if (err) {
          error('Error writing XML file:', err);
        } else {
        }
      });
    });
  });
}

// Path to the file to be loaded
const filePath = path.join(__dirname, '../../files/v770/PayCategoryHeader.txt');

// Generate XML with file content
generateXML(filePath);
