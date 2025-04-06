const readline = require("readline-sync");
const os = require("os");
const child_process = require("child_process");
const path = require("path");
const fs = require("fs");

console.log(`
========

Vii No Ma Auto Patcher

========

Auto Patcher is experimental and may not work


when reporting an issue, send the FULL log
of the command, INCLUDING all the arguments
you may have used and your OS.\n\n\n\n`);

// Add a version selection prompt
const versionOptions = ["v0", "v512", "v770", "v1025"];
console.log("Select a version:");
versionOptions.forEach((version, index) => {
    console.log(`${index + 1}. ${version}`);
});

let versionChoice;
do {
    const input = readline.question("Enter the number corresponding to your choice: ");
    versionChoice = parseInt(input, 10); // Ensuring we parse the input as an integer
    if (isNaN(versionChoice) || versionChoice < 1 || versionChoice > versionOptions.length) {
        console.log("Input valid number, please.");
    }
} while (isNaN(versionChoice) || versionChoice < 1 || versionChoice > versionOptions.length);

const selectedVersion = versionOptions[versionChoice - 1];
const wadFileName = `${selectedVersion}.wad`;
console.log(`You have selected version: ${selectedVersion}`);
console.log(`Please ensure that the ${wadFileName} file is placed in the same directory as the patcher.`);

// Prompt the user to set the IP address
const ipChoice = readline.question("Do you want to use Dolphin (enter 'D') or set a specific IP address (enter 'S')? ");

let ipAddress;
if (ipChoice.toLowerCase() === 'd') {
    ipAddress = '127.0.0.1/';
    console.log("Using IP address: 127.0.0.1/ for Dolphin.");
} else if (ipChoice.toLowerCase() === 's') {
    ipAddress = readline.question("Enter the IP address to patch: ") + '/';
    console.log(`Using IP address: ${ipAddress}`);
} else {
    console.log("Invalid choice. Please restart the script and choose a valid option.");
    process.exit(1);
}

readline.question("Press any key to continue...");

// Detect the operating system
const platform = os.platform();
console.log(`Detected OS: ${platform}`);

const rootDir = path.resolve(__dirname);

if (platform === 'win32') {
    console.log("Launching Sharpii for Windows...");
    const command = `"${rootDir}\\Sharpii.exe" WAD -u "${rootDir}\\${wadFileName}" temp`;
    child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Output: ${stdout}`);
        
        // Copy lzx.exe from root to temp
        const lzxSource = path.join(rootDir, "lzx.exe");
        const lzxDestination = path.join(rootDir, "temp", "lzx.exe");
        fs.copyFileSync(lzxSource, lzxDestination);
        console.log("Copied lzx.exe to temp directory.");
        
        // Run lzx command in temp directory
        const lzxCommand = `cd temp && lzx -d 00000001.app 00000001.app`;
        child_process.exec(lzxCommand, { cwd: rootDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Output: ${stdout}`);
            
            // Open 00000001.app and modify the content
            const appFilePath = path.join(rootDir, "temp", "00000001.app");
            const appFileBuffer = fs.readFileSync(appFilePath);
            let searchUrl;
            if (selectedVersion === "v770") {
                searchUrl = "https://a248.e.akamai.net/f/248/81607/7d/wmp1v2.wapp.wii.com/";
            } else if (selectedVersion === "v1025") {
                searchUrl = "https://a248.e.akamai.net/f/248/93025/7d/wmp3v2.wapp.wii.com/";
            } else {
                searchUrl = "https://a248.e.akamai.net/f/248/70236/7d/wmp1.wapp.wii.com/";
            }
            
            // Modify the URL
            let index = appFileBuffer.indexOf(searchUrl);
            if (index !== -1) {
                const replacementUrl = Buffer.from(`http://${ipAddress}${'\0'.repeat(searchUrl.length - `http://${ipAddress}`.length)}`);
                replacementUrl.copy(appFileBuffer, index, 0, replacementUrl.length);
                console.log("Modified the URL in 00000001.app successfully.");
            } else {
                console.log("URL not found in 00000001.app.");
            }
            
            // Find and replace 'https://wmp2v3.wapp.wii.com/conf/first.bin' with 'http://$ip/v1025/first.bin'
            const specificUrl = "https://wmp2v3.wapp.wii.com/conf/first.bin";
            index = appFileBuffer.indexOf(specificUrl);
            if (index !== -1) {
                const newUrl = `http://${ipAddress}v1025/first.bin`;
                const paddedUrl = newUrl + '\0'.repeat(specificUrl.length - newUrl.length);
                const replacementBuffer = Buffer.from(paddedUrl, 'ascii');
                replacementBuffer.copy(appFileBuffer, index, 0, replacementBuffer.length);
                console.log("Modified 'https://wmp2v3.wapp.wii.com/conf/first.bin' to 'http://${ipAddress}v1025/first.bin'.");
            } else {
                console.log("'https://wmp2v3.wapp.wii.com/conf/first.bin' not found in 00000001.app.");
            }

            // Change .img to .jpg
            const imgToJpgSearch = ".img";
            const imgToJpgReplace = ".jpg";
            index = appFileBuffer.indexOf(imgToJpgSearch);
            while (index !== -1) {
                appFileBuffer.write(imgToJpgReplace, index, imgToJpgReplace.length, 'ascii');
                index = appFileBuffer.indexOf(imgToJpgSearch, index + imgToJpgReplace.length);
            }
            console.log("Modified .img to .jpg in 00000001.app.");

            // Change beacon/%s to beacon/01
            const beaconSearch = "beacon/%s";
            const beaconReplace = "beacon/01";
            index = appFileBuffer.indexOf(beaconSearch);
            while (index !== -1) {
                appFileBuffer.write(beaconReplace, index, beaconReplace.length, 'ascii');
                index = appFileBuffer.indexOf(beaconSearch, index + beaconReplace.length);
            }
            console.log("Modified beacon/%s to beacon/01 in 00000001.app.");

            // For v0/v512, replace conf/first.bin with v512/first.bin
            if (selectedVersion === "v0" || selectedVersion === "v512") {
                const confSearch = "conf/first.bin";
                const confReplace = "v512/first.bin";
                index = appFileBuffer.indexOf(confSearch);
                while (index !== -1) {
                    appFileBuffer.write(confReplace, index, confReplace.length, 'ascii');
                    index = appFileBuffer.indexOf(confSearch, index + confReplace.length);
                }
                console.log("Modified conf/first.bin to v512/first.bin in 00000001.app.");
            }
            
            // Write the modified buffer back to the file
            fs.writeFileSync(appFilePath, appFileBuffer);

            // Run lzx -evb 00000001.app 00000001.app
            const lzxEvbCommand = `cd temp && lzx -evb 00000001.app 00000001.app`;
            child_process.exec(lzxEvbCommand, { cwd: rootDir }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return;
                }
                console.log(`Output: ${stdout}`);

                // Run Sharpii to pack the modified WAD
                const packCommand = `sharpii.exe wad -p temp ${selectedVersion}_patched.wad`;
                child_process.exec(packCommand, { cwd: rootDir }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`Stderr: ${stderr}`);
                        return;
                    }
                    console.log(`Output: ${stdout}`);
                });
            });
        });
    });
} else {
    console.log("Unsupported operating system. The WAD unpacker is only available for Windows.");
}
