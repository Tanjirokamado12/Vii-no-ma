const fs = require('fs');
const path = require('path');

// Define input and output file paths
const inputFilePath = path.join(__dirname, '../files/categorylist.txt');
const outputDirPath = path.join(__dirname, '../v770/url1/list/category');

// Ensure directories exist before writing the file
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Read the contents of the input file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  // Split the data into lines
  const lines = data.split('\n');

  // Initialize variables to store category information
  let categories = [];
  let currentCategory = {};
  let inCategoryInfo = false;

  // Parse lines to extract category information
  lines.forEach(line => {
    line = line.trim();
    if (line === '<categinfo_start>') {
      inCategoryInfo = true;
      currentCategory = {};
    } else if (line === '</categinfo_end>') {
      inCategoryInfo = false;
      categories.push(currentCategory);
    } else if (inCategoryInfo) {
      const [key, value] = line.split(':');
      currentCategory[key] = value;
    }
  });

  // Count the number of categories
  const categoryCount = categories.length;

  // Create XML structure
  let xml = '<CategoryList>\n';
  xml += '  <ver>1</ver>\n';
  xml += '  <type>3</type>\n';

  categories.forEach(category => {
    xml += '    <categinfo>\n';
    for (const key in category) {
      xml += `      <${key}>${category[key]}</${key}>\n`;
    }
    xml += '    </categinfo>\n';
  });

  xml += '</CategoryList>';

  // Ensure the output directory exists before writing the files
  ensureDirectoryExistence(outputDirPath);

  // Write the XML to the output files
  for (let i = 1; i <= 3; i++) {
    const outputFilePath = path.join(outputDirPath, `0${i}.xml`);
    fs.writeFile(outputFilePath, xml, err => {
      if (err) {
        console.error(`Error writing output file ${outputFilePath}:`, err);
        return;
      }
      console.log(`XML file ${outputFilePath} generated successfully!`);
    });
  }
});
