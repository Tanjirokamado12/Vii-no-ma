const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// Define the input file path
const inputFile = path.join(__dirname, '..', 'files', 'sppageallbin.txt');

// Define the output file path
const outputFilePath1 = path.join(__dirname, '..', 'v770', 'url1', 'special', 'allbin.xml');

// Function to write content to the specified output files
const writeContentToFile = (content) => {
    fs.writeFile(outputFilePath1, content, (err) => {
        if (err) console.error('Error writing to', outputFilePath1, err);
    });
};

// Check if the input file exists
fs.access(inputFile, fs.constants.F_OK, (err) => {
    if (err) {
        // File does not exist, create default content
        const defaultContent = `<SpPageBin>
  <ver>1</ver>
</SpPageBin>`;

        // Write the default content to the output files
        writeContentToFile(defaultContent);
    } else {
        // File exists, read the content and generate the desired output
        fs.readFile(inputFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            // Split the file content into individual pageinfo entries
            const entries = data.split('</pageinfo>').map(entry => entry.trim()).filter(entry => entry);

            // Create XML content without the XML declaration
            const xmlContent = xmlbuilder.create('SpPageList', { headless: true })
                .ele('ver', '1').up();

            entries.forEach(entry => {
                const pageInfo = {};
                entry.replace('<pageinfo>', '').split('\n').forEach(line => {
                    const [key, value] = line.split(':').map(s => s && s.trim());
                    if (key && value) {
                        pageInfo[key] = value;
                    }
                });

                const pageInfoElem = xmlContent.ele('pageinfo');
                Object.entries(pageInfo).forEach(([key, value]) => {
                    pageInfoElem.ele(key, value).up();
                });
            });

            xmlContent.ele('upddt', '2025-02-07T20:41:15').up();
            const xmlString = xmlContent.end({ pretty: true });

            // Write the generated content to the output files
            writeContentToFile(xmlString);
        });
    }
});
