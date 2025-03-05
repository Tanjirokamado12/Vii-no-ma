const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const { exec } = require('child_process');

// Prompt the user for their IP address
const userIP = readlineSync.question('Please enter your IP address: ');

console.log(`You entered: ${userIP}`);

const filesToCopy = ['assets/v770first.txt', 'assets/v1025first.txt'];
const placeholderIP = 'ip'; // The placeholder to be replaced
const v770Dir = path.join(__dirname, 'conf');
const v1025Dir = path.join(__dirname, 'v1025');

// Create directories if they don't exist
if (!fs.existsSync(v770Dir)) fs.mkdirSync(v770Dir);
if (!fs.existsSync(v1025Dir)) fs.mkdirSync(v1025Dir);

filesToCopy.forEach(file => {
    const fileName = path.basename(file);
    const destPath = path.join(__dirname, fileName);

    fs.copyFile(file, destPath, (err) => {
        if (err) {
            console.error(`Failed to copy ${file}:`, err);
            return;
        }
        console.log(`${fileName} was copied to ${destPath}`);

        // Read the copied file and replace the placeholder IP
        fs.readFile(destPath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Failed to read ${destPath}:`, err);
                return;
            }

            // Replace the placeholder IP with the user's IP address
            let updatedData = data.replace(new RegExp(placeholderIP, 'g'), `http://${userIP}/`);

            // Correct any extra "http://http://" or "http://192.168.1.152//" in the URLs
            updatedData = updatedData.replace(/http:\/\/http:\/\//g, 'http://').replace(/http:\/\/192\.168\.1\.152\/\//g, 'http://192.168.1.152/');

            // Write the updated content back to the file
            fs.writeFile(destPath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error(`Failed to update ${destPath}:`, err);
                    return;
                }
                console.log(`IP address in ${fileName} was replaced with http://${userIP}/ and corrected`);

                let destDir;
                if (fileName === 'v770first.txt') {
                    destDir = v770Dir;
                } else if (fileName === 'v1025first.txt') {
                    destDir = v1025Dir;
                }

                const destFilePath = path.join(destDir, fileName);

                fs.copyFile(destPath, destFilePath, (err) => {
                    if (err) {
                        console.error(`Failed to copy ${fileName} into ${destDir} directory:`, err);
                        return;
                    }
                    console.log(`${fileName} was copied to ${destDir}`);

                    const command = `openssl aes-128-cbc -e -in "${destFilePath}" -out first.bin -K 943B13DD87468BA5D9B7A8B899F91803 -iv 66B33FC1373FE506EC2B59FB6B977C82`;

                    exec(command, { cwd: destDir }, (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Failed to run openssl command in ${destDir} directory:`, err);
                            return;
                        }
                        console.log(`openssl encryption output (${destDir}): ${stdout}`);
                        console.error(`openssl encryption error (${destDir}, if any): ${stderr}`);
                    });
                });
            });
        });
    });
});
