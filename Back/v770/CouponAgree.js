const fs = require('fs').promises;
const path = require('path');

async function processDeliveryEntries() {
    const sourceFilePath = path.join(__dirname, '../../files/v770/Couponagree.txt');
    
    try {
        // Load the content from the source file
        const sourceContent = await fs.readFile(sourceFilePath, 'utf8');

        // Extract delivery IDs and agreements from the content
        const deliveryEntries = sourceContent.match(/Deliveryid:\s*(\S+)\s*agree:\s*(.+)/g);
        if (!deliveryEntries) {
            console.error('No delivery entries found in the source file.');
            return;
        }

        for (const entry of deliveryEntries) {
            const [ , deliveryId, agreement ] = entry.match(/Deliveryid:\s*(\S+)\s*agree:\s*(.+)/);
            const updatedContent = `<DeliveryAgree><ver>1</ver><agree>${agreement}</agree></DeliveryAgree>`;
            const targetFilePath = path.join(__dirname, `../../v770/url1/Coupon/${deliveryId}.xml`);

            try {
                // Check if the file already exists
                await fs.access(targetFilePath).catch(() => {
                    return fs.writeFile(targetFilePath, updatedContent, 'utf8');
                });

            } catch {
            }
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

processDeliveryEntries();
