const fs = require('fs');
const path = require('path');

// Function to copy files recursively
function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath); // Recursive copy for directories
    } else {
      fs.copyFileSync(sourcePath, destinationPath); // Copy files
    }
  }
}

// Function to handle .mov files and append "-L.mov" and "-H.mov" to their filenames
function handleMovFiles(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name);

    if (entry.isDirectory()) {
      handleMovFiles(sourcePath, path.join(destination, entry.name));
    } else if (entry.name.endsWith('.mov')) {
      const baseName = entry.name.slice(0, -4); // Remove .mov extension
      const lowQualityPath = path.join(destination, `${baseName}-L.mov`);
      const highQualityPath = path.join(destination, `${baseName}-H.mov`);

      fs.copyFileSync(sourcePath, lowQualityPath); // Copy as -L.mov
      fs.copyFileSync(sourcePath, highQualityPath); // Copy as -H.mov
    }
  }
}

// Function to handle the special case for ../assets/room/*/ to ../v770/url1/special/*/img
function copyRoomToSpecial(sourceBase, destinationBase) {
  const rooms = fs.readdirSync(sourceBase, { withFileTypes: true });

  for (let room of rooms) {
    if (room.isDirectory()) {
      const sourceRoomPath = path.join(sourceBase, room.name);
      const destinationRoomPath = path.join(destinationBase, room.name, 'img');

      // Copy the room directory to the special destination
      copyDirectory(sourceRoomPath, destinationRoomPath);

      // Handle .mov files in the special directories
      handleMovFiles(sourceRoomPath, destinationRoomPath);
    }
  }
}

// Define source and destination paths
const sourceWall = '../assets/wall';
const destinationWall = '../v770/url1/wall';

const sourcePayWall = '../assets/pay/wall';
const destinationPayWall = '../v770/url3/pay/wall';

const sourceMii = '../assets/mii';
const destinationMii = '../v770/url1/mii';

const sourceRoom = '../assets/room';
const destinationSpecial = '../v770/url1/special';

// Additional source and destination paths
const sourceCoupon = '../assets/coupon';
const destinationCoupon = '../v770/url1/coupon';

const sourceDelivery = '../assets/Delivery';
const destinationDelivery = '../v770/url1/Delivery';

const sourcePicture = '../assets/picture';
const destinationPicture = '../v770/url1/picture';

const sourceUrllink = '../assets/urllink';
const destinationUrllink = '../v770/url1/urllink';

// Perform the copy operations
try {
  copyDirectory(sourceWall, destinationWall);
  handleMovFiles(sourceWall, destinationWall);

  copyDirectory(sourcePayWall, destinationPayWall);
  handleMovFiles(sourcePayWall, destinationPayWall);

  copyDirectory(sourceMii, destinationMii);
  handleMovFiles(sourceMii, destinationMii);

  // Perform the special room-to-special copy operation
  copyRoomToSpecial(sourceRoom, destinationSpecial);

  // Perform the additional copy operations
  copyDirectory(sourceCoupon, destinationCoupon);
  handleMovFiles(sourceCoupon, destinationCoupon);

  copyDirectory(sourceDelivery, destinationDelivery);
  handleMovFiles(sourceDelivery, destinationDelivery);

  copyDirectory(sourcePicture, destinationPicture);
  handleMovFiles(sourcePicture, destinationPicture);

  copyDirectory(sourceUrllink, destinationUrllink);
  handleMovFiles(sourceUrllink, destinationUrllink);
} catch (error) {
  console.error('Error during copy:', error);
}
