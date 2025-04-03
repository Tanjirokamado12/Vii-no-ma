const fs = require('fs-extra');
const path = require('path');

// Define the source directory
const sourceDir = path.join(__dirname, '../Assets/Pay/Movies');

// Define the destination directories
const destinations = ['../v1025/url3/pay/movie'];

// List of input files and their output paths
const inputFiles = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg',
  '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
  '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg',
  '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg',
  '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
  '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg'
];
const outputFiles = [
  'c4/1/1.jpg', 'c8/2/2.jpg', 'ec/3/3.jpg', 'a8/4/4.jpg', 'e4/5/5.jpg',
  '16/6/6.jpg', '8f/7/7.jpg', 'c9/8/8.jpg', '45/9/9.jpg', 'd3/10/10.jpg',
  '65/11/11.jpg', 'c2/12/12.jpg', 'c5/13/13.jpg', 'aa/14/14.jpg',
  '9b/15/15.jpg', 'c7/16/16.jpg', '70/17/17.jpg', '6f/18/18.jpg',
  '1f/19/19.jpg', '98/20/20.jpg', '3c/21/21.jpg', 'b6/22/22.jpg',
  '37/23/23.jpg', '1f/24/24.jpg', '8e/25/25.jpg', '4e/26/26.jpg',
  '02/27/27.jpg', '33/28/28.jpg', '6e/29/29.jpg', '34/30/30.jpg',
  'c1/31/31.jpg', '63/32/32.jpg', '18/33/33.jpg', 'e3/34/34.jpg',
  '1c/35/35.jpg', '19/36/36.jpg'
];

async function copyFiles() {
  try {
    // Iterate over each destination
    for (const destination of destinations) {
      for (let i = 0; i < inputFiles.length; i++) {
        const sourceFile = path.join(sourceDir, inputFiles[i]);
        const destinationFile = path.join(__dirname, destination, outputFiles[i]);

        // Debug logs for paths

        // Check if the source file exists
        if (!fs.existsSync(sourceFile)) {
          console.error(`Source file not found: ${sourceFile}`);
          continue; // Skip to next file if this one doesn't exist
        }

        // Ensure the destination directory exists
        await fs.ensureDir(path.dirname(destinationFile));

        // Copy the file
        await fs.copy(sourceFile, destinationFile);
      }
    }
  } catch (err) {
  }
}

// Execute the function
copyFiles();
