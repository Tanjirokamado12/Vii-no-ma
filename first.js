const fs = require('fs');
const axios = require('axios');
const https = require('https');
const path = require('path');
const { execSync, exec } = require('child_process');

// URLs for downloading first.bin files
const urls = {
    v770: 'https://wmp1v2.wapp.wii.com/conf/first.bin'
};

// Paths to save the downloaded and processed files
const paths = {
    v770: {
        bin: path.join(__dirname, '/v770/first.bin'),
        txt: path.join(__dirname, '/v770/first.txt')
    }
};

// OpenSSL decryption and encryption keys
const opensslKey = '943B13DD87468BA5D9B7A8B899F91803';
const opensslIV = '66B33FC1373FE506EC2B59FB6B977C82';

const agent = new https.Agent({
    rejectUnauthorized: false,
});

// Function to download and save the file
async function downloadAndSave(url, outputPath) {
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        httpsAgent: agent,
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        let error = null;
        writer.on('error', err => {
            error = err;
            writer.close();
            reject(err);
        });

        writer.on('close', () => {
            if (!error) {
                resolve();
            }
        });
    });
}

// Function to decrypt the file
function decryptFile(inputPath, outputPath) {
    execSync(`openssl aes-128-cbc -d -in ${inputPath} -out ${outputPath} -K ${opensslKey} -iv ${opensslIV}`);
}

// Function to encrypt the file
function encryptFile(inputPath, outputPath) {
    execSync(`openssl aes-128-cbc -e -in ${inputPath} -out ${outputPath} -K ${opensslKey} -iv ${opensslIV}`);
}

// Function to open the file in Notepad and wait for it to close
function openInNotepad(filePath) {
    return new Promise((resolve, reject) => {
        exec(`notepad ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            // Wait for Notepad to be closed
            const checkNotepadClosed = setInterval(() => {
                exec('tasklist', (error, stdout, stderr) => {
                    if (error) {
                        clearInterval(checkNotepadClosed);
                        reject(error);
                        return;
                    }

                    if (!stdout.includes('notepad.exe')) {
                        clearInterval(checkNotepadClosed);
                        resolve();
                    }
                });
            }, 1000); // Check every second if Notepad is closed
        });
    });
}

// Function to process the files for a given version
async function processFiles(version) {
    const { bin, txt } = paths[version];

    try {
        console.log(`Starting download for ${version}...`);
        await downloadAndSave(urls[version], bin);
        console.log(`Downloaded and saved ${version}/first.bin`);

        console.log(`Decrypting ${version}/first.bin...`);
        decryptFile(bin, txt);
        console.log(`Decryption complete for ${version}/first.bin`);

        console.log(`Opening ${version}/first.txt in Notepad...`);
        await openInNotepad(txt);
        console.log(`Notepad closed for ${version}/first.txt`);

        console.log(`Encrypting ${version}/first.txt...`);
        encryptFile(txt, bin);
        console.log(`Encryption complete for ${version}/first.txt`);
    } catch (error) {
        console.error(`Error processing files for ${version}:`, error);
    }
}

// Process the files for v770
async function processAllFiles() {
    await processFiles('v770');
}

// Start the processing
processAllFiles();
