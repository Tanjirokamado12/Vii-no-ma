const fs = require('fs');
const path = require('path');

// Mapping of subdirectories and movie IDs
const targetMappings = {
  'c4/1': '1',
  'c8/2': '2',
  'ec/3': '3',
  'a8/4': '4',
  'e4/5': '5',
  '16/6': '6',
  '8f/7': '7',
  'c9/8': '8',
  '45/9': '9',
  'd3/10': '10',
  '65/11': '11',
  'c2/12': '12',
  'c5/13': '13',
  'aa/14': '14',
  '9b/15': '15',
  'c7/16': '16',
  '70/17': '17',
  '6f/18': '18',
  '1f/19': '19',
  '98/20': '20',
  '3c/21': '21',
  'b6/22': '22',
  '37/23': '23',
  '1f/24': '24',
  '8e/25': '25',
  '4e/26': '26',
  '02/27': '27',
  '33/28': '28',
  '6e/29': '29',
  '34/30': '30',
  'c1/31': '31',
  '18/32': '32',
  '1c/33': '33',
  'c1/34': '34',
  '18/35': '35',
  '1c/36': '36',
  '19/36': '36',
  'a5/37': '37',
  'a5/38': '38',
  'd6/39': '39',
  'd6/40': '40',
  '34/41': '41',
  'a1/42': '42',
  '17/43': '43',
  'f7/44': '44',
  '6c/45': '45',
  'd9/46': '46',
  '67/47': '47',
  '64/48': '48',
  'f4/49': '49',
  'c0/50': '50',
  '28/51': '51',
  '9a/52': '52',
  'd8/53': '53',
  'a6/54': '54',
  'b5/55': '55',
  '9f/56': '56',
  '72/57': '57',
  '66/58': '58',
  '09/59': '59',
  '07/60': '60',
  '7f/61': '61',
  '44/62': '62',
  '03/63': '63',
  'ea/64': '64',
  'fc/65': '65',
  '32/66': '66',
  '73/67': '67',
  'a3/68': '68',
  '14/69': '69',
  '7c/70': '70',
  'e2/71': '71',
  '32/72': '72'
};

// Source and base destination directories
const sourceDir = '../assets/pay/Logos';
const destDirs = ['../v1025/url3/pay/movie/', '../v770/url3/pay/movie/'];

// Ensure the target directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Copy files based on the mapping
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Error reading source directory:', err);
    return;
  }

  files.forEach(file => {
    // Match files that fit the pattern "D_(target)-*.jpg"
    const match = file.match(/^D_(\d+)-.*\.jpg$/);
    if (match) {
      const movieId = match[1]; // Extract just the movie ID

      // Find the corresponding target mapping
      for (const [subDir, id] of Object.entries(targetMappings)) {
        if (id === movieId) {
          const srcFile = path.join(sourceDir, file);

          destDirs.forEach(baseDestDir => {
            const destFile = path.join(baseDestDir, subDir, file);

            ensureDirectoryExistence(destFile);

            // Copy the file
            fs.copyFile(srcFile, destFile, copyErr => {
              if (copyErr) {
                console.error(`Error copying file ${file} to ${destFile}:`, copyErr);
              } else {
                (`Copied ${file} to ${destFile}`);
              }
            });
          });
          break;
        }
      }
    }
  });
});

