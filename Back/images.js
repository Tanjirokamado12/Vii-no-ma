const fs = require('fs');
const path = require('path');

// Helper function to copy files
function copyFiles(sourceDir, targetDirs) {
  targetDirs.forEach(targetDir => {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });

  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    const sourceFile = path.join(sourceDir, file);

    targetDirs.forEach(targetDir => {
      const targetFile = path.join(targetDir, file);
      fs.copyFileSync(sourceFile, targetFile);
    });
  });
}

// Helper function to copy files while preserving directory structure and creating img folder inside room ID
function copyFilesRecursively(sourceDir, targetDir, isRootLevel = true) {
  const items = fs.readdirSync(sourceDir);

  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, isRootLevel ? item : '', isRootLevel && /^\d+$/.test(item) ? 'img' : '', isRootLevel ? '' : item);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      copyFilesRecursively(sourcePath, targetPath, false);
    } else if (['.jpg', '.mov'].includes(path.extname(item))) {
      if (!fs.existsSync(path.dirname(targetPath))) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      }
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Define source and target directories
const couponSourceDir = path.join(__dirname, '../assets/coupon');
const wallSourceDir = path.join(__dirname, '../assets/wall');
const payWallSourceDir = path.join(__dirname, '../assets/pay/wall');
const categorySourceDir = path.join(__dirname, '../assets/categories');
const roomSourceDir = path.join(__dirname, '../assets/room');
const miiSourceDir = path.join(__dirname, '../assets/mii');
const deliverySourceDir = path.join(__dirname, '../assets/delivery');
const LinkSourceDir = path.join(__dirname, '../assets/urllink');
const PictureSourceDir = path.join(__dirname, '../assets/picture');

const roomTargetDir = path.join(__dirname, '../v770/url1/special');
const miiTargetDir = path.join(__dirname, '../v770/url1/mii');
const deliveryTargetDir = path.join(__dirname, '../v770/url1/delivery');
const wallTargetDirs = [path.join(__dirname, '../v770/url1/wall')];
const couponTargetDir = path.join(__dirname, '../v770/url1/coupon');
const PictureTargetDir = path.join(__dirname, '../v770/url1/picture');
const LinkTargetDir = path.join(__dirname, '../v770/url1/urllink');
const categoryTargetDirs = [path.join(__dirname, '../v770/url1/list/category/img')];
const payWallTargetDirs = [path.join(__dirname, '../v770/url3/pay/wall')];

// Copy files
copyFiles(wallSourceDir, wallTargetDirs);
copyFiles(payWallSourceDir, payWallTargetDirs);
copyFiles(categorySourceDir, categoryTargetDirs);
copyFilesRecursively(roomSourceDir, roomTargetDir);
copyFiles(miiSourceDir, [miiTargetDir]);
copyFiles(couponSourceDir, [couponTargetDir]);
copyFiles(deliverySourceDir, [deliveryTargetDir]);

copyFiles(PictureSourceDir, [PictureTargetDir]);
copyFiles(LinkSourceDir, [LinkTargetDir]);

console.log('Files copied successfully!');
