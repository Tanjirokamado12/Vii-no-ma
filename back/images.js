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

// Rooms

const sourceRoomDir = path.join(__dirname, '../assets/room');
const destRoomDir1 = path.join(__dirname, '../v770/url1/special');
const destRoomDir2 = path.join(__dirname, '../v512/url1/special');

const sourceDeliveryDir = path.join(__dirname, '../assets/Delivery');
const destDeliveryDir1 = path.join(__dirname, '../v770/url1/Delivery');
const destDeliveryDir2 = path.join(__dirname, '../v512/url1/Delivery');

// Function to copy files with specific extensions from source to destination
function copyFiles(source, destination, extensions) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    fs.readdir(source, (err, files) => {
        if (err) {
            console.error(`Error reading source directory: ${err}`);
            return;
        }

        files.forEach(file => {
            if (extensions.includes(path.extname(file).toLowerCase())) {
                const sourceFile = path.join(source, file);
                const destFile = path.join(destination, file);

                try {
                    fs.copyFileSync(sourceFile, destFile);
                } catch (err) {
                    console.error(`Error copying file ${file}: ${err}`);
                }
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
            console.error(`Error reading source directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const sourceFile = path.join(source, file);
            const destDir = path.join(destination, file, 'img');

            if (fs.statSync(sourceFile).isDirectory()) {
                fs.mkdirSync(destDir, { recursive: true });

                fs.readdir(sourceFile, (err, subFiles) => {
                    if (err) {
                        console.error(`Error reading sub-directory: ${err}`);
                        return;
                    }

                    subFiles.forEach(subFile => {
                        const sourceSubFile = path.join(sourceFile, subFile);
                        const destSubFile = path.join(destDir, subFile);

                        try {
                            fs.copyFileSync(sourceSubFile, destSubFile);
                        } catch (err) {
                            console.error(`Error copying sub-file ${subFile}: ${err}`);
                        }
                    });
                });
            }
        });
    });
}

// Combine .jpg and .mii file copy tasks using the improved function
const jpgExtensions = ['.jpg'];
const miiExtensions = ['.mii'];

copyFiles(sourceCategoryDir, categoryDir, jpgExtensions);
copyFiles(sourceWallDir, destWallDir1, jpgExtensions);
copyFiles(sourceWallDir, destWallDir2, jpgExtensions);
copyFiles(sourcePayWallDir, destPayWallDir2, jpgExtensions);
copyFiles(sourceMiiDir, destMiiDir1, miiExtensions);
copyFiles(sourceMiiDir, destMiiDir2, miiExtensions);

// Copy room files
copyRoomFiles(sourceRoomDir, destRoomDir1);
copyRoomFiles(sourceRoomDir, destRoomDir2);

// Copy delivery images
copyFiles(sourceDeliveryDir, destDeliveryDir1, jpgExtensions);
copyFiles(sourceDeliveryDir, destDeliveryDir2, jpgExtensions);
