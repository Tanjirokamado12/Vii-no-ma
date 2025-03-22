const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Function to read data from a file
const readDataFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Split the data into sections based on <pageinfo> tags
        const pageinfoSections = data.split(/<\/?pageinfo>/g).filter((section, index) => index % 2 !== 0).map(section => section.trim());
        // Parse each section into an object
        const parsedData = pageinfoSections.map(section => {
          const obj = {};
          section.split('\n').forEach(line => {
            const [key, value] = line.split(':');
            if (key && value) {
              obj[key.trim().toLowerCase()] = value.trim();
            }
          });
          return obj;
        });
        resolve(parsedData);
      }
    });
  });
};

// Function to generate XML without declaration
const generateXML = (data) => {
  const builder = new xml2js.Builder({ headless: true });
  const currentDate = new Date().toISOString().replace(/\.\d{3}Z$/, '');

  // Add <valid> and <pref> elements to each company section
  data.forEach(company => {
    company.valid = '1';
    company.pref = '11111111111111111111111111111111111111111111111';
  });

  return builder.buildObject({
    SpPageList: {
      ver: 1,
      pageinfo: data,
      upddt: currentDate
    }
  });
};

// Function to save XML to a file
const saveXMLToFile = (filePath, xml) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        fs.writeFile(filePath, xml, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

// Main function
const main = async () => {
  try {
    const dataFilePath = path.resolve(__dirname, '../../files/v770/SpPageList.txt');
    const xmlFilePath = path.resolve(__dirname, '../../v770/url1/special/all.xml');

    // Read data from file
    const data = await readDataFromFile(dataFilePath);

    // Generate XML
    const xml = generateXML(data);

    // Save XML to file
    await saveXMLToFile(xmlFilePath, xml);

  } catch (err) {
    console.error('Error:', err);
  }
};

// Run the main function
main();
