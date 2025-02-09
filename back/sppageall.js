const fs = require('fs');
const path = require('path');

// Define the input file path
const inputFile = path.join(__dirname, '..', 'files', 'sppageall.txt');

// Define the output file paths
const outputFilePath1 = path.join(__dirname, '..', 'v770', 'url1', 'special', 'all.xml');
const outputFilePath2 = path.join(__dirname, '..', 'v1025', 'url1', 'special', 'all.xml');

// Function to write content to the specified output files
const writeContentToFile = (content) => {
   fs.writeFile(outputFilePath1, content, (err) => {
      if (err) console.error('Error writing to', outputFilePath1, err);
   });

   fs.writeFile(outputFilePath2, content, (err) => {
      if (err) console.error('Error writing to', outputFilePath2, err);
   });
};

// Check if the input file exists
fs.access(inputFile, fs.constants.F_OK, (err) => {
   if (err) {
      // File does not exist, create default content
      const defaultContent = `<SpPageList>
  <ver>1</ver>
  <upddt>2025-02-07T20:41:15</upddt>
</SpPageList>`;

      // Write the default content to the output files
      writeContentToFile(defaultContent);
   } else {
      // File exists, read the content and generate the desired output
      fs.readFile(inputFile, 'utf8', (err, data) => {
         if (err) {
            console.error('Error reading the file:', err);
            return;
         }

         // Parse the file content and generate the desired output format
         const lines = data.split('\n');
         const content = {
            pageinfo: {
               sppageid: '',
               name: '',
               level: '',
               miiid: '',
               color1: '',
               logo1id: 'g1234',
               news: '',
               valid: '1', // Adding the valid field
               pref: '11111111111111111111111111111111111111111111111' // Adding the pref field
            }
         };

         lines.forEach((line) => {
            const [key, value] = line.split(':');
            if (content.pageinfo.hasOwnProperty(key.trim())) {
               content.pageinfo[key.trim()] = value.trim();
            }
         });

         // Convert the content to a string format (e.g., JSON or XML)
         const outputContent = JSON.stringify(content, null, 2);

         // Write the generated content to the output files
         writeContentToFile(outputContent);
      });
   }
});
