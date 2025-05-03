const fs = require('fs-extra');
const path = require('path');

// Define the source directory
const sourceDir = path.join(__dirname, '../assets/movies');

// Consolidate all destination directories into one array
const destinationDirs = [
  '../v770/url1/movie',
  '../v512/url1/movie',
  '../v1025/url1/movie'
].map(dir => path.join(__dirname, dir)); // Convert relative paths to absolute

// File names to process (subDir / file structure)
const fileNames = [
  'c4/1', 'c8/2', 'ec/3', 'a8/4', 'e4/5', '16/6', '8f/7',
  'c9/8', '45/9', 'd3/10', '65/11', 'c2/12', 'c5/13', 'aa/14',
  '9b/15', 'c7/16', '70/17', '6f/18', '1f/19', '98/20', '3c/21',
  'b6/22', '37/23', '1f/24', '8e/25', '4e/26', '02/27', '33/28',
  '6e/29', '34/30', 'c1/31', '63/32', '18/33', 'e3/34', '1c/35',
  '19/36', 'a5/37', 'a5/38', 'd6/39', 'd6/40', '34/41', 'a1/42',
  '17/43', 'f7/44', '6c/45', 'd9/46', '67/47', '64/48', 'f4/49',
  'c0/50', '28/51', '9a/52', 'd8/53', 'a6/54', 'b5/55', '9f/56',
  '72/57', '66/58', '09/59', '07/60', '7f/61', '44/62', '03/63',
  'ea/64', 'fc/65', '32/66', '73/67', 'a3/68', '14/69', '7c/70',
  'e2/71', '32/72'
];

// Helper function to copy files
async function copyFiles(sourceFile, destinationDir, subDir, file, suffix) {
  try {
    const destinationFile = path.join(destinationDir, subDir, `${file}${suffix}`);
    await fs.ensureDir(path.dirname(destinationFile));
    await fs.copy(sourceFile, destinationFile);
  } catch (err) {
  }
}

// Main function to process movie files
async function copyAndRenameMovies() {
  try {
    for (const fileName of fileNames) {
      const [subDir, file] = fileName.split('/');

      const sourceFile = path.join(sourceDir, `${file}.mov`);
      const mosourceFile = path.join(sourceDir, `${file}.mo`);
      const sourceJpgFile = path.join(sourceDir, `${file}.jpg`);

      // Check if any movie file exists before proceeding
      const movieExists = await fs.pathExists(sourceFile) || await fs.pathExists(mosourceFile);
      if (!movieExists) {
        continue;
      }

      // Copy .mov and .mo files
      await Promise.all(destinationDirs.map(async destinationDir => {
        if (await fs.pathExists(sourceFile)) {
          await copyFiles(sourceFile, destinationDir, subDir, file, '-L.mov');
          await copyFiles(sourceFile, destinationDir, subDir, file, '-H.mov');
        }
        if (await fs.pathExists(mosourceFile)) {
          await copyFiles(mosourceFile, destinationDir, subDir, file, '-L.mov');
          await copyFiles(mosourceFile, destinationDir, subDir, file, '-H.mov');
        }
      }));

      // Copy .jpg file if present
      if (await fs.pathExists(sourceJpgFile)) {
        await Promise.all(destinationDirs.map(destinationDir =>
          copyFiles(sourceJpgFile, destinationDir, subDir, file, '.jpg')
        ));
      }
    }
  } catch (err) {
  }
}

// Start the process
copyAndRenameMovies();
