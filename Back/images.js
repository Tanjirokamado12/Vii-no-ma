const fs = require('fs');
const path = require('path');

// Helper function to copy files
function copyFiles(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);

    fs.copyFileSync(sourceFile, targetFile);
  });
}

// Define source and target directories
const wallSourceDir = path.join(__dirname, '../assets/wall');
const wallTargetDir = path.join(__dirname, '../v770/url1/wall');

const payWallSourceDir = path.join(__dirname, '../assets/pay/wall');
const payWallTargetDir = path.join(__dirname, '../v770/url3/pay/wall');

const CategorySourceDir = path.join(__dirname, '../assets/categories');
const CategoryTargetDir = path.join(__dirname, '../v770/url1/list/category/img');
const CategoryTargetDir2 = path.join(__dirname, '../v1025/url1/list/category/img');


// Copy files
copyFiles(wallSourceDir, wallTargetDir);
copyFiles(payWallSourceDir, payWallTargetDir);
copyFiles(CategorySourceDir, CategoryTargetDir, CategoryTargetDir2);

