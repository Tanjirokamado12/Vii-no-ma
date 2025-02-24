const fs = require('fs');
const path = require('path');

// Define the source and destination directories
const sourceWallDir = path.join(__dirname, '../assets/wall');
const destWallDir1 = path.join(__dirname, '../v512/url1/wall');
const destWallDir2 = path.join(__dirname, '../v770/url1/wall');

const sourceCategoryDir = path.join(__dirname, '../assets/category');
const categoryDir = path.join(__dirname, '../v770/url1/list/category/img');

const sourcePayIntroDir = path.join(__dirname, '../assets/pay/intro');

const sourcePayWallDir = path.join(__dirname, '../assets/pay/wall');
const destPayWallDir2 = path.join(__dirname, '../v770/url3/pay/wall');

const sourceMiiDir = path.join(__dirname, '../assets/mii');
const destMiiDir1 = path.join(__dirname, '../v770/url1/mii');
const destMiiDir2 = path.join(__dirname, '../v512/url1/mii');

const sourceRoomDir = path.join(__dirname, '../assets/room');
const destRoomDir1 = path.join(__dirname, '../v770/url1/special');
const destRoomDir2 = path.join(__dirname, '../v512/url1/special');

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

// Function to copy .mii files from source to destination
function copyMiiFiles(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    fs.readdir(source, (err, files) => {
        if (err) {
            console.error('Error reading source directory:', err);
            return;
        }

        files.forEach(file => {
            if (path.extname(file).toLowerCase() === '.mii') {
                const sourceFile = path.join(source, file);
                const destFile = path.join(destination, file);

                fs.copyFileSync(sourceFile, destFile);
            }
        });
    });
}

// Function to copy directories preserving the ID of room structure
function copyRoomFiles(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    fs.readdir(source, (err, files) => {
        if (err) {
            console.error('Error reading source directory:', err);
            return;
        }

        files.forEach(file => {
            const sourceFile = path.join(source, file);
            const destDir = path.join(destination, file, 'img');
            
            if (fs.statSync(sourceFile).isDirectory()) {
                fs.mkdirSync(destDir, { recursive: true });

                fs.readdir(sourceFile, (err, subFiles) => {
                    if (err) {
                        console.error('Error reading sub-directory:', err);
                        return;
                    }

                    subFiles.forEach(subFile => {
                        const sourceSubFile = path.join(sourceFile, subFile);
                        const destSubFile = path.join(destDir, subFile);

                        fs.copyFileSync(sourceSubFile, destSubFile);
                    });
                });
            }
        });
    });
}

// Copy .jpg files to both destination directories for wall
copyJpgFiles(sourceCategoryDir, categoryDir);
copyJpgFiles(sourceWallDir, destWallDir1);
copyJpgFiles(sourceWallDir, destWallDir2);

// Copy .jpg files to destination directories for pay wall
copyJpgFiles(sourcePayWallDir, destPayWallDir2);

// Copy .mii files to destination directories for pay wall
copyMiiFiles(sourceMiiDir, destMiiDir1);
copyMiiFiles(sourceMiiDir, destMiiDir2);

// Copy room files to both destination directories preserving the ID of room structure and appending 'img'
copyRoomFiles(sourceRoomDir, destRoomDir1);
copyRoomFiles(sourceRoomDir, destRoomDir2);
