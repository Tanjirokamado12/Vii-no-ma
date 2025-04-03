const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const { exec } = require('child_process');
const fsPromises = require('fs').promises;

// Validate the IP address format
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
const userIP = readlineSync.question('Please enter your IP address: ');

if (!ipRegex.test(userIP)) {
    console.error('Invalid IP address format.');
    process.exit(1);
}

console.log(`You entered: ${userIP}`);

const filesToCopy = ['assets/v1025first.txt', 'assets/v770first.txt', 'assets/v512first.txt'];
const placeholderIP = 'ip'; // The placeholder to be replaced
const v1025Dir = path.join(__dirname, 'v1025');
const v770Dir = path.join(__dirname, 'conf');
const v512Dir = path.join(__dirname, 'v512');
const outputDir = path.join(__dirname, 'output'); // Define the output directory

// Ensure required directories exist
const ensureDirExists = async (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        await fsPromises.mkdir(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    } else {
        console.log(`Directory already exists: ${dirPath}`);
    }
};

// Process each file
const processFile = async (file) => {
    try {
        const fileName = path.basename(file);
        const destPath = path.join(outputDir, fileName);

        // Copy the file to the output directory
        await fsPromises.copyFile(file, destPath);
        console.log(`${fileName} was copied to ${destPath}`);

        // Read the copied file and replace the placeholder IP
        let data = await fsPromises.readFile(destPath, 'utf8');
        let updatedData = data.replace(new RegExp(placeholderIP, 'g'), `http://${userIP}/`)
                              .replace(/http:\/\/http:\/\//g, 'http://')
                              .replace(/http:\/\/192\.168\.1\.152\/\//g, 'http://192.168.1.152/');

        await fsPromises.writeFile(destPath, updatedData, 'utf8');
        console.log(`IP address in ${fileName} was replaced with http://${userIP}/ and corrected`);

        // Determine the destination directory
        const destDir = fileName === 'v1025first.txt' ? v1025Dir
                      : fileName === 'v770first.txt' ? v770Dir
                      : v512Dir;

        const destFilePath = path.join(destDir, fileName);

        // Copy the updated file to the appropriate directory
        await fsPromises.copyFile(destPath, destFilePath);
        console.log(`${fileName} was copied to ${destDir}`);

        // Encrypt the file using OpenSSL
        const command = `openssl aes-128-cbc -e -in "${destFilePath}" -out first.bin -K 943B13DD87468BA5D9B7A8B899F91803 -iv 66B33FC1373FE506EC2B59FB6B977C82`;
        exec(command, { cwd: destDir }, (err, stdout, stderr) => {
            if (err) {
                console.error(`Failed to run openssl command in ${destDir} directory:`, err);
                return;
            }
            console.log(`openssl encryption output (${destDir}): ${stdout}`);
            console.error(`openssl encryption error (${destDir}, if any): ${stderr}`);
        });

    } catch (error) {
        console.error(`Error processing ${file}:`, error);
    }
};

// Main function
const main = async () => {
    await ensureDirExists(outputDir);
    await ensureDirExists(v1025Dir);
    await ensureDirExists(v770Dir);
    await ensureDirExists(v512Dir);

    for (const file of filesToCopy) {
        await processFile(file);
    }
};

main().catch((err) => console.error('Error in main function:', err));