const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '../files/paycategoryheader.txt');
const outputFilePath = path.join(__dirname, '../v770/url3/pay/list/category/header.xml');

function parsePayCategoryHeader(fileContent) {
    const sections = fileContent.match(/<Categorystart>([\s\S]*?)<Categoryend>/g);
    let parsedSections = '';

    if (sections) {
        sections.forEach(section => {
            const lines = section.match(/<Categorystart>([\s\S]*?)<Categoryend>/)[1].split('\n');
            let place = '';
            let type = '';
            let text = '';
            
            lines.forEach(line => {
                if (line.startsWith('place:')) {
                    place = line.split(':')[1].trim();
                } else if (line.startsWith('type:')) {
                    type = line.split(':')[1].trim();
                } else if (line.startsWith('text:')) {
                    text = line.split(':')[1].trim();
                }
            });
            
            parsedSections += `
<listinfo>
  <place>${place}</place>
  <type>${type}</type>
  <text>${text}</text>
</listinfo>`;
        });
    }

    const payCategoryHeader = `
<PayCategoryHeader>
  <ver>1</ver>${parsedSections}
</PayCategoryHeader>`;
    
    return payCategoryHeader;
}

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    
    const parsedData = parsePayCategoryHeader(data);
    
    fs.mkdir(path.dirname(outputFilePath), { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directories:', err);
            return;
        }

        fs.writeFile(outputFilePath, parsedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }

            console.log('File saved successfully.');
        });
    });
});
