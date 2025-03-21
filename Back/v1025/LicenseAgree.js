const fs = require('fs');
const path = require('path');

// File paths
const eulaPath = path.join(__dirname, '../../files/v1025/eula.txt');
const xmlOutputPath = path.join(__dirname, '../../v1025/url1/conf/eula.xml');

// Ensure the directories exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

// Read the content of the EULA file
fs.readFile(eulaPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the EULA file:', err);
        return;
    }

    // Create the XML content
    const xmlContent = `<LicenseAgree>
  <ver>1</ver>
  <agree>${data}</agree>
</LicenseAgree>`;

    // Ensure the directories exist before saving the file
    ensureDirectoryExistence(xmlOutputPath);

    // Save the XML content to the specified location
    fs.writeFile(xmlOutputPath, xmlContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the XML file:', err);
            return;
        }
    });
});
