const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

const xmlFilePath = '../v512/url1/special/all.xml';
const txtFilePath = path.resolve('../Files/v512/sppagelist.txt');

// Function to create the default XML content
function createDefaultXMLContent() {
  const xml = xmlbuilder.create('SpPageList', { headless: true })
    .ele('ver', 1).up()
    .ele('upddt', new Date().toISOString()).end({ pretty: true });

  return xml;
}

// Function to create XML content from the text file
function createXMLContentFromFile(content) {
  const lines = content.split('\n');
  const spPageList = xmlbuilder.create('SpPageList', { headless: true })
    .ele('ver', 1).up();
  
  let pageInfo;
  
  lines.forEach(line => {
    if (line.trim() === '</pageinfo>') {
      // Close the current pageinfo tag and add strdt and enddt
      pageInfo.ele('strdt', new Date().toISOString());
      pageInfo.ele('enddt', new Date().toISOString());
      pageInfo = null;
    } else if (line.trim().startsWith('<pageinfo>')) {
      // Create a new pageinfo tag
      pageInfo = spPageList.ele('pageinfo');
    } else if (pageInfo) {
      const [key, value] = line.split(':');
      if (key && value) {
        pageInfo.ele(key, value.trim());
      }
    }
  });

  spPageList.ele('upddt', new Date().toISOString());
  return spPageList.end({ pretty: true });
}

// Function to read the file or create it if it doesn't exist
function loadOrCreateFile() {
  if (fs.existsSync(txtFilePath)) {
    fs.readFile(txtFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading text file:', err);
        return;
      }
      const xmlContent = createXMLContentFromFile(data);
      fs.writeFile(xmlFilePath, xmlContent, 'utf8', (err) => {
        if (err) {
          console.error('Error creating XML file:', err);
          return;
        }
        console.log('Created and saved XML content from text file:', xmlContent);
      });
    });
  } else if (fs.existsSync(xmlFilePath)) {
    fs.readFile(xmlFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading XML file:', err);
        return;
      }
      console.log('Loaded XML content:', data);
    });
  } else {
    const defaultXMLContent = createDefaultXMLContent();
    fs.writeFile(xmlFilePath, defaultXMLContent, 'utf8', (err) => {
      if (err) {
        console.error('Error creating default XML file:', err);
        return;
      }
      console.log('Created and saved default XML content:', defaultXMLContent);
    });
  }
}

// Execute the function
loadOrCreateFile();
