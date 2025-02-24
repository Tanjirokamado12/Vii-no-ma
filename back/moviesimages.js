const fs = require('fs');
const path = require('path');

// Function to generate all possible 2-character combinations of letters and digits
function generateCombinations() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const combinations = [];

  for (const c1 of characters) {
    for (const c2 of characters) {
      combinations.push(c1 + c2);
    }
  }

  return combinations;
}

// Function to create folders based on combinations
function createFolders(basePath, combinations) {
  combinations.forEach((combo) => {
    const folderPath = path.join(basePath, combo);

    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder ${combo} created successfully!`);
      } else {
        console.log(`Folder ${combo} already exists.`);
      }
    } catch (err) {
      console.error(`Error creating folder ${combo}:`, err);
    }
  });
}

// Function to copy .jpg files to all directories based on combinations
function copyJpgFilesToAllFolders(sourcePath, basePath, combinations) {
  fs.readdir(sourcePath, (err, files) => {
    if (err) {
      return console.error('Error reading source directory:', err);
    }

    files.forEach((file) => {
      if (path.extname(file).toLowerCase() === '.jpg') {
        const fileNumber = parseInt(path.basename(file, path.extname(file)), 10);
        if (fileNumber >= 1 && fileNumber <= 150) {
          combinations.forEach((combo) => {
            const sourceFile = path.join(sourcePath, file);
            const destFile = path.join(basePath, combo, file);

            fs.copyFile(sourceFile, destFile, (err) => {
              if (err) {
                return console.error(`Error copying file ${file} to folder ${combo}:`, err);
              }
              console.log(`File ${file} copied to ${combo} folder successfully!`);
            });
          });
        }
      }
    });
  });
}

// Define the base path where folders will be created and source path for .jpg files
const basePath = path.join(__dirname, '../v512/url1/movies');
const sourcePath = path.join(__dirname, '../assets/movies');

// Generate combinations and create folders
const combinations = generateCombinations();
createFolders(basePath, combinations);

// Copy .jpg files to all folders
copyJpgFilesToAllFolders(sourcePath, basePath, combinations);
