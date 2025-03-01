const fs = require('fs');
const path = require('path');

// Initial XML content
let xmlContent = `<PayCategoryHeader>
  <ver>1</ver>`;

// Function to ensure directory exists
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// Save initial XML content to file
const savePath = path.resolve(__dirname, '../../v770/url3/pay/list/category/header.xml');
ensureDirectoryExistence(savePath);
fs.writeFileSync(savePath, xmlContent, 'utf8', (err) => {
  if (err) {
    console.error('Error saving initial XML file:', err);
  } else {
 }
});

// Load list info from file
const loadPath = path.resolve(__dirname, '../../files/v770/PayCategoryHeader.txt');
ensureDirectoryExistence(loadPath);
fs.readFile(loadPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading list info file:', err);
  } else {

    // Extract all occurrences of <listinfo>...</listinfo>
    const regex = /<listinfo>[\s\S]*?<\/listinfo>/g;
    const listInfoMatches = data.match(regex) || [];

    // Construct the final XML content
    let finalXmlContent = xmlContent;
    listInfoMatches.forEach((listInfo) => {
      finalXmlContent += '\n' + listInfo;
    });
    finalXmlContent += '\n</PayCategoryHeader>';

    // Save the final XML content to a new file
    const finalSavePath = path.resolve(__dirname, '../../v770/url3/pay/list/category/header.xml');
    ensureDirectoryExistence(finalSavePath);
    fs.writeFileSync(finalSavePath, finalXmlContent, 'utf8', (err) => {
      if (err) {
        console.error('Error saving final XML file:', err);
      } else {
      }
    });

    // Print all occurrences of listinfo
    listInfoMatches.forEach((listInfo, index) => {
    });
  }
});
