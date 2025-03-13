const fs = require('fs');
const path = require('path');

// File paths
const eulaPath = path.join(__dirname, '../../files/v770/eula.txt');
const xmlOutputPath = path.join(__dirname, '../../v770/url1/conf/eula.xml');

// Read the content of the EULA file
fs.readFile(eulaPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the EULA file:', err);
        return;
    }
    
    // Create the XML content
    const xmlContent = `<LicenseAgree>
  <ver>1</ver>
  <agree>
    ${data}
</agree>
</LicenseAgree>`;

    // Save the XML content to the specified location
    fs.writeFile(xmlOutputPath, xmlContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the XML file:', err);
            return;
        }
    });
});
