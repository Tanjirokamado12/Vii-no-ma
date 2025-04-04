const fs = require('fs-extra');
const path = require('path');

// Define the source directory
const sourceDir = path.join(__dirname, '../assets/movies');

// Consolidate all destination directories into one array
const destinationDirs = [
  '../v770/url1/movie',
  '../v512/url1/movie',
  '../v1025/url1/movie'
];

// File names to process
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

// Helper function to process file copying
async function copyFiles(sourceFile, destinationDir, subDir, file, suffix) {
  const destinationFile = path.join(__dirname, destinationDir, subDir, `${file}${suffix}`);
  await fs.ensureDir(path.dirname(destinationFile));
  await fs.copy(sourceFile, destinationFile);
}

async function copyAndRenameMovies() {
  try {
    for (const fileName of fileNames) {
      const [subDir, file] = fileName.split('/');
      const sourceFile = path.join(sourceDir, `${file}.mov`);
      const sourceJpgFile = path.join(sourceDir, `${file}.jpg`);

      // Process .mov files
      if (await fs.pathExists(sourceFile)) {
        for (const destinationDir of destinationDirs) {
          await copyFiles(sourceFile, destinationDir, subDir, file, '-L.mov');
          await copyFiles(sourceFile, destinationDir, subDir, file, '-H.mov');
        }
      }

      // Process .jpg files
      if (await fs.pathExists(sourceJpgFile)) {
        for (const destinationDir of destinationDirs) {
          await copyFiles(sourceJpgFile, destinationDir, subDir, file, '.jpg');
        }
      }
    }
  } catch (err) {
    console.error('Error copying and renaming movies and images:', err);
  }
}

copyAndRenameMovies();
