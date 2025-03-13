const fs = require('fs');
const path = require('path');

// Load the content from the source file
const sourceFilePath = path.join(__dirname, '../../files/v770/Couponagree.txt');
const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');


// Extract delivery IDs and agreements from the content
const deliveryEntries = sourceContent.match(/Deliveryid:\s*(\S+)\s*agree:\s*(.+)/g);
if (!deliveryEntries) {
    console.error('No delivery entries found in the source file.');
    process.exit(1);
}


deliveryEntries.forEach(entry => {
    const [ , deliveryId, agreement ] = entry.match(/Deliveryid:\s*(\S+)\s*agree:\s*(.+)/);
    const updatedContent = `<CouponAgree><ver>1</ver><agree>${agreement}</agree></CouponAgree>`;
    const targetFilePath = path.join(__dirname, `../../v770/url1/Coupon/${deliveryId}.xml`);
    fs.writeFileSync(targetFilePath, updatedContent, 'utf8');
});
