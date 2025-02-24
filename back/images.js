const fs = require('fs');
const path = require('path');

// Define the source and destination directories
const sourceWallDir = path.join(__dirname, '../assets/wall');
const destWallDir1 = path.join(__dirname, '../v512/url1/wall');
const destWallDir2 = path.join(__dirname, '../v770/url1/wall');

const SourceCategorydir = path.join(__dirname, '../assets/category');
const CategoryDir = path.join(__dirname, '../v770/url1/list/category/img');

const sourcePayIntroDir = path.join(__dirname, '../assets/pay/intro');

const sourcePayWallDir = path.join(__dirname, '../assets/pay/wall');
const destPayWallDir2 = path.join(__dirname, '../v770/url3/pay/wall');

// Function to copy .jpg files from source to destination
function copyJpgFiles(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    fs.readdir(source, (err, files) => {
        if (err) {
            console.error('Error reading source directory:', err);
            return;
        }

        files.forEach(file => {
            if (path.extname(file).toLowerCase() === '.jpg') {
                const sourceFile = path.join(source, file);
                const destFile = path.join(destination, file);

                fs.copyFileSync(sourceFile, destFile);
            }
        });
    });
}

// Copy .jpg files to both destination directories for wall
copyJpgFiles(SourceCategorydir, CategoryDir);
copyJpgFiles(sourceWallDir, destWallDir1);
copyJpgFiles(sourceWallDir, destWallDir2);

// Copy .jpg files to destination directories for pay wall
copyJpgFiles(sourcePayWallDir, destPayWallDir2);
