const fs = require('fs');
const xmlbuilder = require('xmlbuilder');

// Function to read the content of the text file and convert it to XML
function convertTextToXml(inputFile, outputFile) {
    // Read the content of the text file
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Create the XML structure
        const xml = xmlbuilder.create('LicenseAgree')
            .ele('ver', 1).up()
            .ele('agree', data).end({ pretty: true });

        // Write the XML content to the output file
        fs.writeFile(outputFile, xml, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('XML file created successfully!');
        });
    });
}

// Define input and output file paths
const inputFile = 'eula.txt'; // Replace with your input text file path
const outputFile = 'eula.xml'; // Replace with your desired output XML file path

// Convert text to XML
convertTextToXml(inputFile, outputFile);
