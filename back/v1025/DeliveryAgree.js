const fs = require('fs').promises;
const path = require('path');

async function processDeliveryEntries() {
    const sourceFilePath = path.join(__dirname, '../../files/v1025/deliveryagree.txt');
    const targetDirectory = path.join(__dirname, '../../v1025/url1/delivery');

    try {
        // Read the content of the source file
        const sourceContent = await fs.readFile(sourceFilePath, 'utf8');

        // Split entries by double newlines
        const deliveryEntries = sourceContent.split('\n\n').filter(entry => entry.trim().length > 0);

        if (deliveryEntries.length === 0) {
            console.error('No valid delivery entries found in the source file.');
            return;
        }

        // Ensure the target directory exists
        await fs.mkdir(targetDirectory, { recursive: true });

        // Process each entry
        for (const entry of deliveryEntries) {
            const lines = entry.split('\n');
            const deliveryIdLine = lines.find(line => line.startsWith('DeliveryID:'));
            const agreeLine = lines.find(line => line.startsWith('Agree:'));

            if (!deliveryIdLine || !agreeLine) {
                continue;
            }

            // Extract DeliveryID and Agree
            const deliveryId = deliveryIdLine.split(':')[1].trim();
            const agreement = agreeLine.split(':')[1].trim();

            // Create the XML content
            const updatedContent = `<DeliveryAgree><ver>1</ver><agree>${agreement}</agree></DeliveryAgree>`;
            const targetFilePath = path.join(targetDirectory, `${deliveryId}.xml`);

            try {
                // Write the XML file
                await fs.writeFile(targetFilePath, updatedContent, 'utf8');
            } catch (writeError) {
                console.error(`Error writing file for DeliveryID ${deliveryId}: ${writeError.message}`);
            }
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

processDeliveryEntries();
