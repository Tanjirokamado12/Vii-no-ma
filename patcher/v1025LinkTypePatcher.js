const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to delete a folder and its contents
function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const currentPath = path.join(folderPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursively delete subfolders
                deleteFolderRecursive(currentPath);
            } else {
                // Delete file
                fs.unlinkSync(currentPath);
            }
        });
        // Delete the now-empty folder
        fs.rmdirSync(folderPath);
        console.log(`${folderPath} has been deleted.`);
    } else {
        console.log(`Folder ${folderPath} does not exist.`);
    }
}

// Function to run a command
function runCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        if (callback) callback();
    });
}

// Function to find and replace bytes in a file
function findAndReplaceBytes(filePath, searchBytes, replaceBytes) {
    const fileBuffer = fs.readFileSync(filePath);
    const searchBuffer = Buffer.from(searchBytes, 'hex');
    const replaceBuffer = Buffer.from(replaceBytes, 'hex');

    let index = 0;
    while ((index = fileBuffer.indexOf(searchBuffer, index)) !== -1) {
        fileBuffer.fill(replaceBuffer, index, index + searchBuffer.length);
        index += searchBuffer.length;
    }

    fs.writeFileSync(filePath, fileBuffer);
    console.log(`Bytes have been replaced in ${filePath}.`);
}

// Example usage
const tempFolderPath = path.join(__dirname, 'Temp');
deleteFolderRecursive(tempFolderPath);

const command = `"Sharpii.exe" WAD -u v1025_Patched.wad Temp`;
runCommand(command, () => {
    const filePath = path.join(tempFolderPath, '00000002.app');
    if (fs.existsSync(filePath)) {
        console.log(`Accessing file: ${filePath}`);
        // Hex byte sequences to search and replace
        const searchBytes = '687474702A3A2F2F2A2E7769696E6F6D612E636F2E6A702F2A0D0A687474702A3A2F2F2A2E6E696E74656E646F2E636F2E6A702F2A0D0A687474702A3A2F2F2A2E7769696E6F6D612E636F6D2F2A0D0A0D0A687474702A3A2F2F2A2E6578742E776170702E7769692E636F6D2F2A0D0A0D0A5B6578636C7564655D0D0A6F706572613A2A0D0A0000000000000000';
        const replaceBytes = '687474702A3A2F2F2A2F2A00000000000000000000000000000A687474702A3A2F2F2A2F2A0000000000000000000000000000000000687474702A3A2F2F2A2F2A0000000000000000000000000000000D0A687474702A3A2F2F2A2F2A00000000000000000000000000000000000000000D0A5B6578636C7564655D0D0A6F706572613A2A0D0A0000000000000000';

        findAndReplaceBytes(filePath, searchBytes, replaceBytes);

        // Run the final command
        const finalCommand = `"Sharpii.exe" WAD -p Temp v1025_patched.wad`;
        runCommand(finalCommand);
    } else {
        console.log(`File ${filePath} does not exist.`);
    }
});
