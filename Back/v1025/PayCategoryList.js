const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// Function to parse text file and extract data
function parseCategoryFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const imgMatch = fileContent.match(/img:(\d+)/); // Extract the "img" value
  const imgValue = imgMatch ? imgMatch[1] : '0';

  const categinfoMatches = [...fileContent.matchAll(/<categinfo>[\s\S]*?<\/categinfo>/g)];
  const categinfos = categinfoMatches.map((match) => {
    const placeMatch = match[0].match(/<place>(\d+)<\/place>/);
    const categidMatch = match[0].match(/<categid>(\d+)<\/categid>/);
    const nameMatch = match[0].match(/<name>(.*?)<\/name>/);

    return {
      place: placeMatch ? placeMatch[1] : '',
      categid: categidMatch ? categidMatch[1] : '',
      name: nameMatch ? nameMatch[1] : ''
    };
  });

  return { imgValue, categinfos };
}

// Function to generate multiple XML files
function generateXML() {
  const inputFilePath = path.join(__dirname, '../../files/v1025/paycategorylist.txt');

  let imgValue;
  let categinfos;
  try {
    const parsedData = parseCategoryFile(inputFilePath);
    imgValue = parsedData.imgValue;
    categinfos = parsedData.categinfos;
  } catch (err) {
    console.error('Error parsing category file:', err);
    return;
  }

  for (let i = 1; i <= 99; i++) {
    // Create the XML structure for each file
    const xml = xmlbuilder.create('PayCategoryList', { headless: true })
      .ele('ver', '1')
      .up()
      .ele('type', '3')
      .up()
      .ele('img', imgValue)
      .up();

    categinfos.forEach((info) => {
      xml.ele('categinfo')
        .ele('place', info.place).up()
        .ele('categid', info.categid).up()
        .ele('name', info.name).up()
        .up();
    });

    const xmlString = xml.end({ pretty: true });

    // Define output directory and dynamic file path
    const outputDir = path.join(__dirname, '../../v1025/url3/pay/list/category');
    const fileName = i.toString().padStart(2, '0') + '.xml'; // Generate file names like 01.xml
    const outputFilePath = path.join(outputDir, fileName);

    // Ensure directory exists and write the XML file
    fs.mkdir(outputDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return;
      }
      fs.writeFile(outputFilePath, xmlString, (err) => {
        if (err) {
          console.error(`Error writing file ${fileName}:`, err);
        } else {

        }
      });
    });
  }
}

generateXML();
