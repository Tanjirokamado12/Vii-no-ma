const fs = require('fs');
const path = require('path');

// Specify the input file name
const inputFileName = '../Files/v770/SpContact.txt'; // Replace with your source file name

// Read the input file
fs.readFile(inputFileName, 'utf8', (err, data) => {
    if (err) {
        error('Error reading the file:', err);
        return;
    }

    // Split the content into lines
    const lines = data.split('\n');

    let currentSpPageid = null;
    let currentContact = null;

    // Iterate through the lines to extract pairs and create files
    lines.forEach(line => {
        if (line.startsWith('SpPageid')) {
            // Save the current SpPageid
            currentSpPageid = line.split(':')[1]?.trim() || 'default';
        } else if (line.startsWith('Contact')) {
            // Save the current Contact
            currentContact = line.split(':')[1]?.trim() || 'N/A';

            if (currentSpPageid) {
                // Define the XML structure
                const xmlContent = `<SpContact>
  <ver>1</ver>
  <contact>${currentContact}</contact>
</SpContact>`;

                // Define the output file path
                const outputFilePath = path.join(__dirname, `../../v770/url1/special/${currentSpPageid}/contact.xml`);

                // Ensure the directory exists
                fs.mkdir(path.dirname(outputFilePath), { recursive: true }, (err) => {
                    if (err) {
                        error('Error creating directories:', err);
                        return;
                    }

                    // Write the XML structure to the file
                    fs.writeFile(outputFilePath, xmlContent, (err) => {
                        if (err) {
                            error('Error writing to file:', err);
                        } else {
                        }
                    });
                });

                // Reset currentContact for the next pair
                currentContact = null;
            }
        }
    });
});
