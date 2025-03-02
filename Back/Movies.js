const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../assets/movies');
const destinationDirs = [
  '../v770/url1/movie',
];

const fileNames = [
  'c4/1',
  'c8/2',
  'ec/3',
  'a8/4',
  'e4/5',
  '16/6',
  '8f/7',
  'c9/8',
  '45/9',
  'd3/10',
  '65/11',
  'c2/12',
  'c5/13',
  'aa/14',
  '9b/15',
  'c7/16',
  '70/17',
  '6f/18',
  '1f/19',
  '98/20',
  '3c/21',
  'b6/22',
  '37/23',
  '1f/24',
  '8e/25',
  '4e/26',
  '02/27',
  '33/28',
  '6e/29',
  '34/30',
  'c1/31',
  '63/32',
  '18/33',
  'e3/34',
  '1c/35',
  '19/36'
];

async function copyAndRenameMovies() {
  try {
    for (const fileName of fileNames) {
      const [subDir, file] = fileName.split('/');
      const sourceFile = path.join(sourceDir, `${file}.mov`);
      const sourceJpgFile = path.join(sourceDir, `${file}.jpg`);

      // Check if the .mov file exists before copying
      if (await fs.pathExists(sourceFile)) {
        // Copy and rename .mov files
        for (const destinationDir of destinationDirs) {
          const lowDestinationFile = path.join(__dirname, destinationDir, subDir, `${file}-L.mov`);
          const highDestinationFile = path.join(__dirname, destinationDir, subDir, `${file}-H.mov`);
          
          await fs.ensureDir(path.dirname(lowDestinationFile));
          await fs.ensureDir(path.dirname(highDestinationFile));
          await fs.copy(sourceFile, lowDestinationFile);
          await fs.copy(sourceFile, highDestinationFile);
        }
      }

      // Check if the .jpg file exists before copying
      if (await fs.pathExists(sourceJpgFile)) {
        // Copy .jpg files without renaming
        for (const destinationDir of destinationDirs) {
          const jpgDestinationFile = path.join(__dirname, destinationDir, subDir, `${file}.jpg`);
          
          await fs.ensureDir(path.dirname(jpgDestinationFile));
          await fs.copy(sourceJpgFile, jpgDestinationFile);
        }
      }
    }
    console.log('Movies and images copied successfully!');
  } catch (err) {
    console.error('Error copying and renaming movies and images:', err);
  }
}

copyAndRenameMovies();
