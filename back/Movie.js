const fs = require('fs').promises;
const path = require('path');

// Source directory
const srcDir = '../assets/movie';

// Destination directory
const destDir = '../v770/url1/Movie';

// List of destination paths
const files = [
  'c4/1.jpg',
  'c8/2.jpg',
  'ec/3.jpg',
  'a8/4.jpg',
  'e4/5.jpg',
  '16/6.jpg',
  '8f/7.jpg',
  'c9/8.jpg',
  '45/9.jpg',
  'd3/10.jpg',
  '65/11.jpg',
  'c2/12.jpg',
  'c5/13.jpg',
  'aa/14.jpg',
  '9b/15.jpg',
  'c7/16.jpg',
  '70/17.jpg',
  '6f/18.jpg',
  '1f/19.jpg',
  '98/20.jpg',
  '3c/21.jpg',
  'b6/22.jpg',
  '37/23.jpg',
  '1f/24.jpg',
  '8e/25.jpg',
  '4e/26.jpg',
  '02/27.jpg',
  '33/28.jpg',
  '6e/29.jpg',
  '34/30.jpg',
  'c1/31.jpg',
  '63/32.jpg',
  '18/33.jpg',
  'e3/34.jpg',
  '1c/35.jpg',
  '19/36.jpg',
];

async function copyFiles() {
  for (const file of files) {
    const destPath = path.join(destDir, file);
    const srcPath = path.join(srcDir, path.basename(file));

    // Create destination directory if it doesn't exist
    await fs.mkdir(path.dirname(destPath), { recursive: true });

    // Copy the file
    await fs.copyFile(srcPath, destPath);
  }
  console.log('Files copied successfully!');
}

copyFiles().catch(err => console.error(err));
