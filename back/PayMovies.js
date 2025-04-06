const fs = require('fs-extra');
const path = require('path');

// Define the source directory
const sourceDir = path.join(__dirname, '../Assets/Pay/movies');

// Combine all destination directories
const destinations = [
  '../v1025/url3/pay/movie',
  '../v770/url3/pay/movie'
];

// Input file names
const inputFiles = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg',
  '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
  '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg',
  '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg',
  '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg', '30.jpg',
  '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg'
];

// Output file paths
const outputFiles = [
  'c4/1/1.jpg', 'c8/2/2.jpg', 'ec/3/3.jpg', 'a8/4/4.jpg', 'e4/5/5.jpg',
  '16/6/6.jpg', '8f/7/7.jpg', 'c9/8/8.jpg', '45/9/9.jpg', 'd3/10/10.jpg',
  '65/11/11.jpg', 'c2/12/12.jpg', 'c5/13/13.jpg', 'aa/14/14.jpg',
  '9b/15/15.jpg', 'c7/16/16.jpg', '70/17/17.jpg', '6f/18/18.jpg',
  '1f/19/19.jpg', '98/20/20.jpg', '3c/21/21.jpg', 'b6/22/22.jpg',
  '37/23/23.jpg', '1f/24/24.jpg', '8e/25/25.jpg', '4e/26/26.jpg',
  '02/27/27.jpg', '33/28/28.jpg', '6e/29/29.jpg', '34/30/30.jpg',
  'c1/31/31.jpg', '63/32/32.jpg', '18/33/33.jpg', 'e3/34/34.jpg',
  '1c/35/35.jpg', '19/36/36.jpg', 'c4//S_1-H.smo', 'c4//S_1-L.smo',
  'c8//S_2-H.smo', 'c8//S_2-L.smo', 'ec//S_3-H.smo', 'ec//S_3-L.smo',
  'a8//S_4-H.smo', 'a8//S_4-L.smo', 'e4//S_5-H.smo', 'e4//S_5-L.smo',
  '16//S_6-H.smo', '16//S_6-L.smo', '8f//S_7-H.smo', '8f//S_7-L.smo',
  'c9//S_8-H.smo', 'c9//S_8-L.smo', '45//S_9-H.smo', '45//S_9-L.smo',
  'd3//S_10-H.smo', 'd3//S_10-L.smo', '65//S_11-H.smo', '65//S_11-L.smo',
  'c2//S_12-H.smo', 'c2//S_12-L.smo', 'c5//S_13-H.smo', 'c5//S_13-L.smo',
  'aa//S_14-H.smo', 'aa//S_14-L.smo', '9b//S_15-H.smo', '9b//S_15-L.smo',
  'c7//S_16-H.smo', 'c7//S_16-L.smo', '70//S_17-H.smo', '70//S_17-L.smo',
  '6f//S_18-H.smo', '6f//S_18-L.smo', '1f//S_19-H.smo', '1f//S_19-L.smo',
  '98//S_20-H.smo', '98//S_20-L.smo', '3c//S_21-H.smo', '3c//S_21-L.smo',
  'b6//S_22-H.smo', 'b6//S_22-L.smo', '37//S_23-H.smo', '37//S_23-L.smo',
  '1f//S_24-H.smo', '1f//S_24-L.smo', '8e//S_25-H.smo', '8e//S_25-L.smo',
  '4e//S_26-H.smo', '4e//S_26-L.smo', '02//S_27-H.smo', '02//S_27-L.smo',
  '33//S_28-H.smo', '33//S_28-L.smo', '6e//S_29-H.smo', '6e//S_29-L.smo',
  '34//S_30-H.smo', '34//S_30-L.smo', 'c1//S_31-L.smo', '63//S_32-L.smo',
  '18//S_33-L.smo', 'e3//S_34-L.smo', '1c//S_35-L.smo', '19//S_36-L.smo',
  'c1//S_31-H.smo', '63//S_32-H.smo', '18//S_33-H.smo', 'e3//S_34-H.smo',
  '1c//S_35-H.smo', '19//S_36-H.smo'
];

// Mapping of .mov files to .smo files
const movMapping = {
  '1.mov': ['c4/1/S_1-H.smo','c4/1/S_1-L.smo'],
  '2.mov': ['c8/2/S_2-H.smo','c8/2/S_2-L.smo'],
  '3.mov': ['ec/3/S_3-H.smo','ec/3/S_3-L.smo'],
  '4.mov': ['a8/4/S_4-H.smo','a8/4/S_4-L.smo'],
  '5.mov': ['e4/5/S_5-H.smo','e4/5/S_5-L.smo'],
  '6.mov': ['16/6/S_6-H.smo','16/6/S_6-L.smo'],
  '7.mov': ['8f/7/S_7-H.smo','8f/7/S_7-L.smo'],
  '8.mov': ['c9/8/S_8-H.smo','c9/8/S_8-L.smo'],
  '9.mov': ['45/9/S_9-H.smo','45/9/S_9-L.smo'],
  '10.mov': ['d3/10/S_10-H.smo','d3/10/S_10-L.smo'],
  '11.mov': ['65/11/S_11-H.smo','65/11/S_11-L.smo'],
  '12.mov': ['c2/12/S_12-H.smo','c2/12/S_12-L.smo'],
  '13.mov': ['c5/13/S_13-H.smo','c5/13/S_13-L.smo'],
  '14.mov': ['aa/14/S_14-H.smo','aa/14/S_14-L.smo'],
  '15.mov': ['9b/15/S_15-H.smo','9b/15/S_15-L.smo'],
  '16.mov': ['c7/16/S_16-H.smo','c7/16/S_16-L.smo'],
  '17.mov': ['70/17/S_17-H.smo','70/17/S_17-L.smo'],
  '18.mov': ['6f/18/S_18-H.smo','6f/18/S_18-L.smo'],
  '19.mov': ['1f/19/S_19-H.smo','1f/19/S_19-L.smo'],
  '20.mov': ['98/20/S_20-H.smo','98/20/S_20-L.smo'],
  '21.mov': ['3c/21/S_21-H.smo','3c/21/S_21-L.smo'],
  '22.mov': ['b6/22/S_22-H.smo','b6/22/S_22-L.smo'],
  '23.mov': ['37/23/S_23-H.smo','37/23/S_23-L.smo'],
  '24.mov': ['1f/24/S_24-H.smo','1f/24/S_24-L.smo'],
  '25.mov': ['8e/25/S_25-H.smo','8e/25/S_25-L.smo'],
  '26.mov': ['4e/26/S_26-H.smo','4e/26/S_26-L.smo'],
  '27.mov': ['02/27/S_27-H.smo','02/27/S_27-L.smo'],
  '28.mov': ['33/28/S_28-H.smo','33/28/S_28-L.smo'],
  '29.mov': ['6e/29/S_29-H.smo','6e/29/S_29-L.smo'],
  '30.mov': ['34/30/S_30-H.smo','34/30/S_30-L.smo'],
  '31.mov': ['c1/31/S_31-L.smo','63/31/S_32-L.smo'],
  '32.mov': ['18/32/S_33-L.smo','e3/32/S_34-L.smo'],
  '33.mov': ['1c/33/S_35-L.smo','19/33/S_36-L.smo'],
  '34.mov': ['c1/34/S_31-H.smo','63/34/S_32-H.smo'],
  '35.mov': ['18/35/S_33-H.smo','e3/35/S_34-H.smo'],
  '36.mov': ['1c/36/S_35-H.smo','19/36/S_36-H.smo'],
};

async function copyFiles() {
  try {
    // Iterate over each destination
    for (const destination of destinations) {
      // Copy regular files (like .jpg)
      for (let i = 0; i < inputFiles.length; i++) {
        const sourceFile = path.join(sourceDir, inputFiles[i]);
        const destinationFile = path.join(__dirname, destination, outputFiles[i]);

        (`Copying from ${sourceFile} to ${destinationFile}`);
        if (!fs.existsSync(sourceFile)) {
          console.error(`Source file not found: ${sourceFile}`);
          continue;
        }
        await fs.ensureDir(path.dirname(destinationFile));
        await fs.copy(sourceFile, destinationFile);
      }

      // Copy and map .mov files to .smo
      const movSourceDir = path.join(__dirname, '../assets/pay/movies');
      const movFiles = fs.readdirSync(movSourceDir).filter(file => file.endsWith('.mov'));

      for (const movFile of movFiles) {
        if (movMapping[movFile]) {
          for (const mappedFile of movMapping[movFile]) {
            const movSourceFile = path.join(movSourceDir, movFile);
            const movDestinationFile = path.join(__dirname, destination, mappedFile);

            (`Mapping ${movFile} to ${mappedFile}`);
            if (!fs.existsSync(movSourceFile)) {
              console.error(`Source .mov file not found: ${movSourceFile}`);
              continue;
            }
            await fs.ensureDir(path.dirname(movDestinationFile));
            await fs.copy(movSourceFile, movDestinationFile);
          }
        } else {
          console.warn(`No mapping found for ${movFile}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error during file copy: ${err.message}`);
  }
}

// Execute the function
copyFiles();
