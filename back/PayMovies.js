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
  '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg',
  '37.jpg', '38.jpg', '39.jpg', '40.jpg', '41.jpg', '42.jpg',
  '43.jpg', '44.jpg', '45.jpg', '46.jpg', '47.jpg', '48.jpg',
  '49.jpg', '50.jpg', '51.jpg', '52.jpg', '53.jpg', '54.jpg',
  '55.jpg', '56.jpg', '57.jpg', '58.jpg', '59.jpg', '60.jpg',
  '61.jpg', '62.jpg', '63.jpg', '64.jpg', '65.jpg', '66.jpg',
  '67.jpg', '68.jpg', '69.jpg', '70.jpg', '71.jpg', '72.jpg'
];

// Output file paths
const outputFiles = [
  'c4/1/1.jpg',
  'c8/2/2.jpg',
  'ec/3/3.jpg',
  'a8/4/4.jpg',
  'e4/5/5.jpg',
  '16/6/6.jpg',
  '8f/7/7.jpg',
  'c9/8/8.jpg',
  '45/9/9.jpg',
  'd3/10/10.jpg',
  '65/11/11.jpg',
  'c2/12/12.jpg',
  'c5/13/13.jpg',
  'aa/14/14.jpg',
  '9b/15/15.jpg',
  'c7/16/16.jpg',
  '70/17/17.jpg',
  '6f/18/18.jpg',
  '1f/19/19.jpg',
  '98/20/20.jpg',
  '3c/21/21.jpg',
  'b6/22/22.jpg',
  '37/23/23.jpg',
  '1f/24/24.jpg',
  '8e/25/25.jpg',
  '4e/26/26.jpg',
  '02/27/27.jpg',
  '33/28/28.jpg',
  '6e/29/29.jpg',
  '34/30/30.jpg',
  'c1/31/31.jpg',
  '18/32/32.jpg',
  '63/32/32.jpg',
  '18/33/33.jpg',
  'e3/34/34.jpg',
  '1c/35/35.jpg',
  '1c/36/36.jpg',
  '19/36/36.jpg',
  'a5/37/37.jpg',
  'a5/38/38.jpg',
  'd6/39/39.jpg',
  'd6/40/40.jpg',
  '34/41/41.jpg',
  'a1/42/42.jpg',
  '17/43/43.jpg',
  'f7/44/44.jpg',
  '6c/45/45.jpg',
  'd9/46/46.jpg',
  '67/47/47.jpg',
  '64/48/48.jpg',
  'f4/49/49.jpg',
  'c0/50/50.jpg',
  '28/51/51.jpg',
  '9a/52/52.jpg',
  'd8/53/53.jpg',
  'a6/54/54.jpg',
  'b5/55/55.jpg',
  '9f/56/56.jpg',
  '72/57/57.jpg',
  '66/58/58.jpg',
  '09/59/59.jpg',
  '07/60/60.jpg',
  '7f/61/61.jpg',
  '44/62/62.jpg',
  '03/63/63.jpg',
  'ea/64/64.jpg',
  'fc/65/65.jpg',
  '32/66/66.jpg',
  '73/67/67.jpg',
  'a3/68/68.jpg',
  '14/69/69.jpg',
  '7c/70/70.jpg',
  'e2/71/71.jpg',
  '32/72/72.jpg',
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
  '37.mov': ['a5/37/S_37-H.smo','a5/37/S_37-L.smo'],
  '38.mov': ['a5/38/S_38-H.smo','a5/38/S_38-L.smo'],
  '39.mov': ['d6/39/S_39-H.smo','d6/39/S_39-L.smo'],
  '40.mov': ['d6/40/S_40-H.smo','d6/40/S_40-L.smo'],
  '41.mov': ['34/41/S_41-H.smo','34/41/S_41-L.smo'],
  '42.mov': ['a1/42/S_42-H.smo','a1/42/S_42-L.smo'],
  '43.mov': ['17/43/S_43-H.smo','17/43/S_43-L.smo'],
  '44.mov': ['f7/44/S_44-H.smo','f7/44/S_44-L.smo'],
  '45.mov': ['6c/45/S_45-H.smo','6c/45/S_45-L.smo'],
  '46.mov': ['d9/46/S_46-H.smo','d9/46/S_46-L.smo'],
  '47.mov': ['67/47/S_47-H.smo','67/47/S_47-L.smo'],
  '48.mov': ['64/48/S_48-H.smo','64/48/S_48-L.smo'],
  '49.mov': ['f4/49/S_49-H.smo','f4/49/S_49-L.smo'],
  '50.mov': ['c0/50/S_50-H.smo','c0/50/S_50-L.smo'],
  '51.mov': ['28/51/S_51-H.smo','28/51/S_51-L.smo'],
  '52.mov': ['9a/52/S_52-H.smo','9a/52/S_52-L.smo'],
  '53.mov': ['d8/53/S_53-H.smo','d8/53/S_53-L.smo'],
  '54.mov': ['a6/54/S_54-H.smo','a6/54/S_54-L.smo'],
  '55.mov': ['b5/55/S_55-H.smo','b5/55/S_55-L.smo'],
  '56.mov': ['9f/56/S_56-H.smo','9f/56/S_56-L.smo'],
  '57.mov': ['72/57/S_57-H.smo','72/57/S_57-L.smo'],
  '58.mov': ['66/58/S_58-H.smo','66/58/S_58-L.smo'],
  '59.mov': ['09/59/S_59-H.smo','09/59/S_59-L.smo'],
  '60.mov': ['07/60/S_60-H.smo','07/60/S_60-L.smo'],
  '61.mov': ['7f/61/S_61-H.smo','7f/61/S_61-L.smo'],
  '62.mov': ['44/62/S_62-H.smo','44/62/S_62-L.smo'],
  '63.mov': ['03/63/S_63-H.smo','03/63/S_63-L.smo'],
  '64.mov': ['ea/64/S_64-H.smo','ea/64/S_64-L.smo'],
  '65.mov': ['fc/65/S_65-H.smo','fc/65/S_65-L.smo'],
  '66.mov': ['32/66/S_66-H.smo','32/66/S_66-L.smo'],
  '67.mov': ['73/67/S_67-L.smo','73/67/S_67-L.smo'],
  '68.mov': ['a3/68/S_68-L.smo','a3/68/S_68-L.smo'],
  '69.mov': ['14/69/S_69-L.smo','14/69/S_69-L.smo'],
  '70.mov': ['7c/70/S_70-H.smo','7c/70/S_70-H.smo'],
  '71.mov': ['e2/71/S_71-H.smo','e2/71/S_71-H.smo'],
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
