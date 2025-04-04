const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Function to read and parse data from a text file
const readDataFromTextFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const lines = data.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('//'));
        const obj = {};
        lines.forEach(line => {
          const [key, value] = line.split(':');
          if (key) {
            obj[key.trim().toLowerCase()] = value ? value.trim() : '';
          }
        });
        resolve(obj);
      }
    });
  });
};

// Function to generate XML with a root element, version, and upddt
const generateXML = (data) => {
  const builder = new xml2js.Builder({ headless: true });

  const currentDateTime = new Date().toISOString().replace(/\.\d{3}Z$/, ''); // Format current date and time

  const xmlObject = {
    SpPageList: {
      ver: 1, // Add <ver> with value 1
      pageinfo: [
        {
          sppageid: data.sppageid || '$sppageid',
          name: data.name || '$name',
          level: data.level || '$level',
          miiid: data.miiid || '$miiid',
          color1: data.color1 || '$color1',
          color2: data.color2 || '$color2',
          logo1id: 'g1234',
          strdt: data.strdt || '2009-04-23T16:30:00',
          enddt: data.enddt || '2039-04-23T16:30:00'
        }
      ],
      upddt: currentDateTime // Add <upddt> dynamically
    }
  };

  return builder.buildObject(xmlObject);
};

// Function to save generated XML to a file
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
    const inputFilePath = path.resolve(__dirname, '../../files/v512/SpPageList.txt'); // Updated input file path
    const outputFilePath = path.resolve(__dirname, '../../v512/url1/special/all.xml'); // Updated output file path

    // Read data from the text file
    const data = await readDataFromTextFile(inputFilePath);

    // Generate XML with the root element, version, and upddt
    const xml = generateXML(data);

    // Save the generated XML to the specified output file
    await saveXMLToFile(outputFilePath, xml);

    ('XML file successfully generated with updated paths!');
  } catch (err) {
    console.error('Error:', err);
  }
};

// Run the main function
main();
