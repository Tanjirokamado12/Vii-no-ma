const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dir, callback) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating directory ${dir}: ${err.message}`);
            return;
        }
        callback();
    });
};

const copyFiles = (sourceDir, targetDir, callback) => {
    ensureDirectoryExists(targetDir, () => {
        fs.readdir(sourceDir, (err, files) => {
            if (err) {
                console.error(`Error reading source directory: ${err.message}`);
                return;
            }

            let copyCount = 0;
            files.forEach(file => {
                if (path.extname(file) === '.mov') {
                    const sourcePath = path.join(sourceDir, file);

                    // Copy to *-H.mov
                    const targetPathH = path.join(targetDir, `${path.basename(file, '.mov')}-H.mov`);
                    fs.copyFile(sourcePath, targetPathH, (err) => {
                        if (err) {
                            console.error(`Error copying file ${file} to ${targetPathH}: ${err.message}`);
                        } else {
                        }
                    });

                    // Copy to *-L.mov
                    const targetPathL = path.join(targetDir, `${path.basename(file, '.mov')}-L.mov`);
                    fs.copyFile(sourcePath, targetPathL, (err) => {
                        if (err) {
                            console.error(`Error copying file ${file} to ${targetPathL}: ${err.message}`);
                        } else {
                        }
                    });

                    copyCount += 2; // Since we're copying each file twice
                }
            });

            if (copyCount === 0) {
                callback();
            } else {
                // If any files were copied, wait for the copies to complete
                let completedCopies = 0;
                const checkCompletion = () => {
                    completedCopies++;
                    if (completedCopies === copyCount) {
                        callback();
                    }
                };

                fs.readdir(targetDir, (err, files) => {
                    if (err) {
                        console.error(`Error reading target directory after copy: ${err.message}`);
                        return;
                    }

                    files.forEach(file => {
                        if (file.endsWith('-H.mov') || file.endsWith('-L.mov')) {
                            checkCompletion();
                        }
                    });
                });
            }
        });
    });
};

// Rename files in the wall and intro directories
const renameFiles = (targetDir, introMovieID, callback, isWall = false, isIntro = false) => {
    fs.readdir(targetDir, (err, files) => {
        if (err) {
            console.error(`Error reading target directory: ${err.message}`);
            return;
        }

        let renameCount = 0;
        files.forEach((file, index) => {
            if (path.extname(file) === '.mov') {
                const suffix = isWall ? (index % 2 === 0 ? 'H' : 'L') : (index === 0 ? 'H' : 'L');
                const baseName = isIntro ? introMovieID : path.basename(file, '.mov').replace(/-H|-L$/, '');
                const newFileName = `${baseName}-${suffix}.mov`;
                const oldPath = path.join(targetDir, file);
                const newPath = path.join(targetDir, newFileName);

                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        console.error(`Error renaming file ${file}: ${err.message}`);
                    } else {
                    }
                    renameCount++;
                    if (renameCount === files.filter(f => path.extname(f) === '.mov').length) {
                        callback();
                    }
                });
            }
        });

        if (renameCount === 0) {
            callback();
        }
    });
};


// Directories
const assetsPayWallDir = path.join(__dirname, '../assets/pay/wall');
const v770Url3PayWallDir = path.join(__dirname, '../v770/url3/pay/wall');
const assetsPayIntroDir = path.join(__dirname, '../assets/pay/intro');
const v770Url3PayIntroDir = path.join(__dirname, '../v770/url3/pay/intro');

// Read IntroMovieID from the file
const payeventFilePath = path.join(__dirname, '../files/v770/payevent.txt');
fs.readFile(payeventFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading payevent file: ${err.message}`);
        return;
    }

    const introMovieID = data.match(/IntroMovieID:(\d+)/);
    if (introMovieID && introMovieID[1]) {
        const movieID = introMovieID[1];

        // Copy and rename files
        copyFiles(assetsPayWallDir, v770Url3PayWallDir, () => {
            renameFiles(v770Url3PayWallDir, movieID, () => {
                copyFiles(assetsPayIntroDir, v770Url3PayIntroDir, () => {
                    renameFiles(v770Url3PayIntroDir, movieID, () => {
                    }, false, true);
                });
            }, true);
        });
    } else {
        console.error('IntroMovieID not found in payevent.txt');
    }
});
