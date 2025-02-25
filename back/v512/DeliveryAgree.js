const fs = require('fs');
const path = require('path');
const builder = require('xmlbuilder');

// Define the path to the text file
const filePath = path.join(__dirname, '../files/v512/deliveryagree.txt');

// Read the text file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Extract the deliveryId from the text file
    const lines = data.split('\n');
    const deliveryIdLine = lines.find(line => line.startsWith('deliveryId:'));
    if (!deliveryIdLine) {
        console.error('Delivery ID not found in the text file');
        return;
    }

    const deliveryId = deliveryIdLine.split(':')[1].trim();

    // Remove the deliveryId line from the content
    const agreeContent = lines.filter(line => !line.startsWith('deliveryId:')).join(' ');

    // Create XML structure without the XML declaration
    const xml = builder.create('DeliveryAgree', { headless: true })
        .ele('ver', '1').up()
        .ele('agree', agreeContent).up()
        .ele('upddt', new Date().toISOString()).up()
        .end({ pretty: true });

    // Define the output XML file path based on deliveryId
    const outputDir = path.join(__dirname, `../v512/url1/delivery`);
    const outputFilePath = path.join(outputDir, `${deliveryId}.xml`);

    // Create the directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    // Write the XML to the output file
    fs.writeFile(outputFilePath, xml, (err) => {
        if (err) {
            console.error('Error writing XML file:', err);
            return;
        }
        console.log(`XML file has been saved to: ${outputFilePath}`);
    });
});
