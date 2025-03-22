const fs = require('fs');
const path = require('path');

// Function to parse the text file and extract SpPage objects
function parseSpPageFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const spPageEntries = fileContent.split('</SpPage>').filter(entry => entry.trim() !== '');

  return spPageEntries.map(entry => {
    const spPage = {};
    const lines = entry.split('\n').filter(line => line.trim() !== '').map(line => line.trim());
    let isInMenuSection = false;
    let menuContent = '';

    lines.forEach(line => {
      if (line.startsWith('<SpPage') || line.startsWith('</SpPage')) {
        return; // Skip the start and end tags
      }
      if (line.startsWith('<menu>')) {
        isInMenuSection = true;
        menuContent += line + '\n';
        return;
      }
      if (isInMenuSection) {
        menuContent += line + '\n';
        if (line.startsWith('</menu>')) {
          isInMenuSection = false;
        }
        return;
      }
      const [key, value] = line.split(':');
      if (key && value !== undefined) {
        spPage[key.trim()] = value.trim();
      } else if (key) {
        const [xmlKey, xmlValue] = line.split('>');
        const xmlValueCleaned = xmlValue ? xmlValue.replace('</' + xmlKey.split('<')[1], '').trim() : 'undefined';
        spPage[xmlKey.split('<')[1]] = xmlValueCleaned;
      }
    });

    if (menuContent) {
      spPage.menu = menuContent;
    }

    // Ensure strdt and enddt always have the full time format
    if (spPage.strdt && spPage.strdt.length === 13) {
      spPage.strdt += ':00:00';
    } else if (spPage.strdt && spPage.strdt.length === 16) {
      spPage.strdt += ':00';
    }
    if (spPage.enddt && spPage.enddt.length === 13) {
      spPage.enddt += ':00:00';
    } else if (spPage.enddt && spPage.enddt.length === 16) {
      spPage.enddt += ':00';
    }

    return spPage;
  });
}

function createDirectoryIfNotExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function generateXml(spPage) {
  let xmlContent = `
<SpPage>
  <ver>1</ver>
  <sppageid>${spPage.sppageid || 'undefined'}</sppageid>
  <strdt>${spPage.strdt || 'undefined'}</strdt>
  <enddt>${spPage.enddt || 'undefined'}</enddt>
  <name>${spPage.name || 'undefined'}</name>
  <stopflag>${spPage.stopflag || 'undefined'}</stopflag>
  <level>${spPage.level || 'undefined'}</level>
  <bgm>${spPage.bgm || 'undefined'}</bgm>
  <mascot>${spPage.mascot || 'undefined'}</mascot>
  <contact>${spPage.contact || 'undefined'}</contact>
`;

  if (spPage.inmsg) {
    xmlContent += `
  <intro>
    <inmsginfo>
      <inmsgseq>1</inmsgseq>
      <inmsg>${spPage.inmsg}</inmsg>
    </inmsginfo>
  </intro>`;
  }

  if (spPage.miiid) {
    xmlContent += `
  <miiinfo>
    <seq>1</seq>
    <miiid>${spPage.miiid}</miiid>
    <color1>${spPage.color1 || 'undefined'}</color1>
    <color2>${spPage.color2 || 'undefined'}</color2>
    <msginfo>
      <msgseq>1</msgseq>
      <msg>${spPage.msg || 'undefined'}</msg>
    </msginfo>
  </miiinfo>`;
  }

  if (spPage.menu) {
    xmlContent += `
  ${spPage.menu}`;
  }

  xmlContent += `
  <logo>
    <logo1id>g1234</logo1id>
    <logo2id>f1234</logo2id>
  </logo>
</SpPage>
`;

  return xmlContent;
}

const spPageFilePath = path.join(__dirname, '../../files/v1025/sppage.txt');
const spPages = parseSpPageFile(spPageFilePath);

const directoryPath = path.join(__dirname, '../../v1025/url1/special');

createDirectoryIfNotExists(directoryPath);

spPages.forEach(spPage => {
  const xmlContent = generateXml(spPage);
  const filePath = path.join(directoryPath, `${spPage.sppageid}/page.xml`);
  createDirectoryIfNotExists(path.dirname(filePath));
  fs.writeFileSync(filePath, xmlContent, 'utf8');
});
