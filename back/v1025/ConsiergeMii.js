const fs = require('fs');

// Read the TXT file
fs.readFile('../files/v1025/ConciergeMii.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.split('\n').map(line => line.trim());
    let xmlContent = '';
    let miiid = null; // Variable for Mii ID
    let msgType = 1; // Counter for message types (1 to 7)
    const seq = 1; // Sequence is always 1

    // Process the TXT content
    lines.forEach((line, index) => {
        if (line.startsWith('// Mii Info')) {
            // Finish previous block and save to file
            if (xmlContent && miiid) {
                xmlContent += `</ConciergeMii>`;
                const outputPath = `../v1025/url1/mii/${miiid}.met`;
                if (!fs.existsSync(outputPath)) {
                    fs.writeFileSync(outputPath, xmlContent.trim());
                } else {
                }
            }

            // Start new block
            xmlContent = `<ConciergeMii>\n    <ver>1</ver>\n`;
            miiid = null;
            msgType = 1; // Reset type
        } else if (line.startsWith('Miiid:')) {
            miiid = line.split(':')[1].trim(); // Extract Mii ID for filename
            xmlContent += `    <miiid>${miiid}</miiid>\n`;
            xmlContent += `    <clothes>1</clothes>\n`;
        } else if (line.startsWith('color1:')) {
            const value = line.split(':')[1].trim();
            xmlContent += `    <color1>${value}</color1>\n`;
        } else if (line.startsWith('color2:')) {
            const value = line.split(':')[1].trim();
            xmlContent += `    <color2>${value}</color2>\n`;
            xmlContent += `    <action>1</action>\n`;
        } else if (line.startsWith('prof:')) {
            const value = line.split(':')[1].trim();
            xmlContent += `    <prof>${value}</prof>\n`;
        } else if (line.startsWith('name:')) {
            const value = line.split(':')[1].trim();
            xmlContent += `    <name>${value}</name>\n`;
        } else if (line.startsWith('msg:')) {
            const value = line.split(':')[1].trim();
            if (msgType <= 7) {
                xmlContent += `    <msginfo>\n`;
                xmlContent += `        <type>${msgType}</type>\n`;
                xmlContent += `        <msglist>\n`;
                xmlContent += `            <seq>${seq}</seq>\n`;
                xmlContent += `            <msg>${value}</msg>\n`;
                xmlContent += `            <face>1</face>\n`;
                xmlContent += `        </msglist>\n`;
                xmlContent += `    </msginfo>\n`;
                msgType++; // Increment type
            }
        } else if (line.startsWith('movieid:')) {
            const value = line.split(':')[1].trim();
            xmlContent += `    <movieid>${value}</movieid>\n`;
            xmlContent += `    <voice>0</voice>\n`;
        }

        // Handle the last entry
        if (index === lines.length - 1 && xmlContent && miiid) {
            xmlContent += `</ConciergeMii>`;
            const outputPath = `../v1025/url1/mii/${miiid}.met`;
            if (!fs.existsSync(outputPath)) {
                fs.writeFileSync(outputPath, xmlContent.trim());
            } else {
            }
        }
    });
});
