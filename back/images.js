const fs = require('fs');
const path = require('path');

// Helper function to ensure a directory exists
function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Recursive file copy function
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
      ensureDirExists(targetPath);
      copyFilesRecursively(sourcePath, targetPath, false);
    } else if (['.jpg', '.mov'].includes(path.extname(item))) {
      ensureDirExists(path.dirname(targetPath));
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Generic function to copy all files from source to targets
function copyFiles(sourceDir, targetDirs) {
  const files = fs.readdirSync(sourceDir);

  targetDirs.forEach(targetDir => {
    ensureDirExists(targetDir);

    files.forEach(file => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      fs.copyFileSync(sourceFile, targetFile);
    });
  });
}

// Configuration for all paths
const versions = {
  v512: {
    roomTargetDir: '../v512/url1/special',
    miiTargetDir: '../v512/url1/mii',
    deliveryTargetDir: '../v512/url1/delivery',
    wallTargetDirs: ['../v512/url1/wall'],
    couponTargetDir: '../v512/url1/coupon',
    pictureTargetDir: '../v512/url1/picture',
    linkTargetDir: '../v512/url1/urllink',
    categoryTargetDirs: ['../v512/url1/list/category/img'],
    payWallTargetDirs: ['../v512/url3/pay/wall'],
    introTargetDir: '../v512/url1/intro',
    payIntroTargetDir: '../v512/url3/pay/intro',
    payCategoryTargetDir: '../v512/url3/pay/list/category/img/',
  },
  v770: {
    roomTargetDir: '../v770/url1/special',
    miiTargetDir: '../v770/url1/mii',
    deliveryTargetDir: '../v770/url1/delivery',
    wallTargetDirs: ['../v770/url1/wall'],
    couponTargetDir: '../v770/url1/coupon',
    pictureTargetDir: '../v770/url1/picture',
    linkTargetDir: '../v770/url1/urllink',
    categoryTargetDirs: ['../v770/url1/list/category/img'],
    payWallTargetDirs: ['../v770/url3/pay/wall'],
    introTargetDir: '../v770/url1/intro',
    payIntroTargetDir: '../v770/url3/pay/intro',
    payCategoryTargetDir: '../v770/url3/pay/list/category/img/',
  },
  v1025: {
    roomTargetDir: '../v1025/url1/special',
    miiTargetDir: '../v1025/url1/mii',
    deliveryTargetDir: '../v1025/url1/delivery',
    wallTargetDirs: ['../v1025/url1/wall'],
    couponTargetDir: '../v1025/url1/coupon',
    pictureTargetDir: '../v1025/url1/picture',
    linkTargetDir: '../v1025/url1/urllink',
    categoryTargetDirs: ['../v1025/url1/list/category/img'],
    payWallTargetDirs: ['../v1025/url3/pay/wall'],
    introTargetDir: '../v1025/url1/intro',
    payIntroTargetDir: '../v1025/url3/pay/intro',
    payCategoryTargetDir: '../v1025/url3/pay/list/category/img/',
  },
};

// Common sources
const commonSources = {
  couponSourceDir: '../assets/coupon',
  wallSourceDir: '../assets/wall',
  payWallSourceDir: '../assets/pay/wall',
  categorySourceDir: '../assets/categories',
  roomSourceDir: '../assets/room',
  miiSourceDir: '../assets/mii',
  deliverySourceDir: '../assets/delivery',
  linkSourceDir: '../assets/urllink',
  pictureSourceDir: '../assets/picture',
  introSourceDir: '../assets/Intro',
  payIntroSourceDir: '../assets/Pay/Intro',
  payCategorySourceDir: '../assets/Pay/category',
};

// Function to execute copying for a version
function executeCopy(versionConfig) {
  const { roomTargetDir, wallTargetDirs, categoryTargetDirs, miiTargetDir, couponTargetDir, deliveryTargetDir, pictureTargetDir, linkTargetDir, introTargetDir, payIntroTargetDir, payWallTargetDirs, payCategoryTargetDir } = versionConfig;

  copyFiles(commonSources.wallSourceDir, wallTargetDirs);
  copyFiles(commonSources.payWallSourceDir, payWallTargetDirs);
  copyFiles(commonSources.categorySourceDir, categoryTargetDirs);
  copyFilesRecursively(commonSources.roomSourceDir, roomTargetDir);
  copyFiles(commonSources.miiSourceDir, [miiTargetDir]);
  copyFiles(commonSources.couponSourceDir, [couponTargetDir]);
  copyFiles(commonSources.deliverySourceDir, [deliveryTargetDir]);
  copyFiles(commonSources.pictureSourceDir, [pictureTargetDir]);
  copyFiles(commonSources.linkSourceDir, [linkTargetDir]);
  copyFiles(commonSources.introSourceDir, [introTargetDir]);
  copyFiles(commonSources.payIntroSourceDir, [payIntroTargetDir]);
  copyFiles(commonSources.payCategorySourceDir, [payCategoryTargetDir]);
}

// Execute for each version
Object.keys(versions).forEach(versionKey => {
  const versionConfig = versions[versionKey];
  executeCopy(versionConfig);
});
