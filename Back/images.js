const fs = require('fs');
const path = require('path');

// Helper function to copy files
function copyFiles(sourceDir, targetDirs) {
  targetDirs.forEach(targetDir => {
    if (typeof targetDir === 'string' && !fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });

  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    const sourceFile = path.join(sourceDir, file);

    targetDirs.forEach(targetDir => {
      if (typeof targetDir === 'string') {
        const targetFile = path.join(targetDir, file);
        fs.copyFileSync(sourceFile, targetFile);
      }
    });
  });
}

// Helper function to copy files while preserving directory structure and creating img folder inside room ID
function copyFilesRecursively(sourceDir, targetDir, isRootLevel = true) {
  const items = fs.readdirSync(sourceDir);

  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(
      targetDir,
      isRootLevel ? item : '',
      isRootLevel && /^\d+$/.test(item) ? 'img' : '',
      isRootLevel ? '' : item
    );

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

// Define source directories
const couponSourceDir = path.join(__dirname, '../assets/coupon');
const wallSourceDir = path.join(__dirname, '../assets/wall');
const payWallSourceDir = path.join(__dirname, '../assets/pay/wall');
const categorySourceDir = path.join(__dirname, '../assets/categories');
const roomSourceDir = path.join(__dirname, '../assets/room');
const miiSourceDir = path.join(__dirname, '../assets/mii');
const deliverySourceDir = path.join(__dirname, '../assets/delivery');
const linkSourceDir = path.join(__dirname, '../assets/urllink');
const pictureSourceDir = path.join(__dirname, '../assets/picture');
const introSourceDir = path.join(__dirname, '../assets/intro');
const payIntroSourceDir = path.join(__dirname, '../assets/pay/intro');
const payCategorySourceDir = path.join(__dirname, '../assets/pay/category');

// Define target directories for v1025
const v1025Targets = {
  roomTargetDir: path.join(__dirname, '../v1025/url1/special'),
  miiTargetDir: path.join(__dirname, '../v1025/url1/mii'),
  deliveryTargetDir: path.join(__dirname, '../v1025/url1/delivery'),
  wallTargetDirs: [path.join(__dirname, '../v1025/url1/wall')],
  couponTargetDir: path.join(__dirname, '../v1025/url1/coupon'),
  pictureTargetDir: path.join(__dirname, '../v1025/url1/picture'),
  linkTargetDir: path.join(__dirname, '../v1025/url1/urllink'),
  categoryTargetDirs: [path.join(__dirname, '../v1025/url1/list/category/img')],
  payWallTargetDirs: [path.join(__dirname, '../v1025/url3/pay/wall')],
  introTargetDirs: [path.join(__dirname, '../v1025/url1/intro')],
  payIntroTargetDirs: [path.join(__dirname, '../v1025/url3/pay/intro')],
  payCategoryTargetDir: path.join(__dirname, '../v1025/url3/pay/list/category/img'),
};

// Copy files for v1025
copyFiles(wallSourceDir, v1025Targets.wallTargetDirs);
copyFiles(payWallSourceDir, v1025Targets.payWallTargetDirs);
copyFiles(categorySourceDir, v1025Targets.categoryTargetDirs);
copyFilesRecursively(roomSourceDir, v1025Targets.roomTargetDir);
copyFiles(miiSourceDir, [v1025Targets.miiTargetDir]);
copyFiles(couponSourceDir, [v1025Targets.couponTargetDir]);
copyFiles(deliverySourceDir, [v1025Targets.deliveryTargetDir]);
copyFiles(pictureSourceDir, [v1025Targets.pictureTargetDir]);
copyFiles(linkSourceDir, [v1025Targets.linkTargetDir]);
copyFiles(introSourceDir, v1025Targets.introTargetDirs);
copyFiles(payIntroSourceDir, v1025Targets.payIntroTargetDirs);
copyFiles(payCategorySourceDir, [v1025Targets.payCategoryTargetDir]);
