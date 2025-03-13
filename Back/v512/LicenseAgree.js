const fs = require('fs');
const path = require('path');

// Ensure the directory exists
const directory = path.join(__dirname, '../../v512/url1/conf');
fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
        console.error('Error creating directories:', err);
        return;
    }

    // File paths
    const eulaPath = path.join(__dirname, '../../files/v512/eula.txt');
    const xmlOutputPath = path.join(directory, 'eula.xml');

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
  <upddt>2025-03-12T12:08:09.844Z</upddt>
</LicenseAgree>`;

        // Save the XML content to the specified location
        fs.writeFile(xmlOutputPath, xmlContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the XML file:', err);
                return;
            }

        });
    });
});
