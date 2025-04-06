const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Predefined file paths for saving files (one per movie)
const filePaths = [
    '../../v1025/url3/pay/movie/c4/1/1.stf',
    '../../v1025/url3/pay/movie/c8/2/2.stf',
    '../../v1025/url3/pay/movie/ec/3/3.stf',
    '../../v1025/url3/pay/movie/a8/4/4.stf',
    '../../v1025/url3/pay/movie/e4/5/5.stf',
    '../../v1025/url3/pay/movie/16/6/6.stf',
    '../../v1025/url3/pay/movie/8f/7/7.stf',
    '../../v1025/url3/pay/movie/c9/8/8.stf',
    '../../v1025/url3/pay/movie/45/9/9.stf',
    '../../v1025/url3/pay/movie/d3/10/10.stf',
    '../../v1025/url3/pay/movie/65/11/11.stf',
    '../../v1025/url3/pay/movie/c2/12/12.stf',
    '../../v1025/url3/pay/movie/c5/13/13.stf',
    '../../v1025/url3/pay/movie/aa/14/14.stf',
    '../../v1025/url3/pay/movie/9b/15/15.stf',
    '../../v1025/url3/pay/movie/c7/16/16.stf',
    '../../v1025/url3/pay/movie/70/17/17.stf',
    '../../v1025/url3/pay/movie/6f/18/18.stf',
    '../../v1025/url3/pay/movie/1f/19/19.stf',
    '../../v1025/url3/pay/movie/98/20/20.stf',
    '../../v1025/url3/pay/movie/3c/21/21.stf',
    '../../v1025/url3/pay/movie/b6/22/22.stf',
    '../../v1025/url3/pay/movie/37/23/23.stf',
    '../../v1025/url3/pay/movie/1f/24/24.stf',
    '../../v1025/url3/pay/movie/8e/25/25.stf',
    '../../v1025/url3/pay/movie/4e/26/26.stf',
    '../../v1025/url3/pay/movie/02/27/27.stf',
    '../../v1025/url3/pay/movie/33/28/28.stf',
    '../../v1025/url3/pay/movie/6e/29/29.stf',
    '../../v1025/url3/pay/movie/34/30/30.stf',
    '../../v1025/url3/pay/movie/c1/31/31.stf',
    '../../v1025/url3/pay/movie/63/32/32.stf',
    '../../v1025/url3/pay/movie/18/33/33.stf',
    '../../v1025/url3/pay/movie/e3/34/34.stf',
    '../../v1025/url3/pay/movie/1c/35/35.stf',
    '../../v1025/url3/pay/movie/19/36/36.stf'
];

// Ensure directories exist before writing files
const ensureDirectoriesExist = (filePath) => {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// Function to process data and save to separate files
function processAndSavePayMovieStaff(inputFilePath) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            error('Error reading file:', err);
            return;
        }

        const lines = data.split('\n');
        let currentMovieId = null;
        let currentStaff = [];
        let fileIndex = 0;

        const writeMovieToFile = (movieId, staff) => {
            if (fileIndex >= filePaths.length) {
                error('Error: Not enough predefined file paths.');
                return;
            }

            const outputFilePath = path.resolve(__dirname, filePaths[fileIndex]);
            ensureDirectoriesExist(outputFilePath); // Ensure directory exists

            const PayMovieStaff = {
                PayMovieStaff: {
                    ver: "1",
                    movieId: movieId,
                    staff: staff.map((member, index) => ({
                        seq: index + 1,
                        role: member.role,
                        name: member.name
                    }))
                }
            };

            const builder = new xml2js.Builder({ headless: true });
            const xml = builder.buildObject(PayMovieStaff);

            fs.writeFile(outputFilePath, xml, err => {
                if (err) {
                    error('Error writing XML file:', err);
                } else {
                    (`File written successfully: ${outputFilePath}`);
                }
            });

            fileIndex++;
        };

        // Process the input file
        lines.forEach(line => {
            if (line.startsWith('Movieid:')) {
                if (currentMovieId !== null) {
                    writeMovieToFile(currentMovieId, currentStaff);
                }
                currentMovieId = line.split(':')[1].trim();
                currentStaff = [];
            } else if (line.startsWith('role:')) {
                const role = line.split(':')[1].trim();
                const nameLine = lines[lines.indexOf(line) + 1]; // Look for 'name' line
                if (nameLine && nameLine.startsWith('name:')) {
                    const name = nameLine.split(':')[1].trim();
                    currentStaff.push({ role, name });
                }
            }
        });

        // Save the last movie
        if (currentMovieId !== null) {
            writeMovieToFile(currentMovieId, currentStaff);
        }
    });
}

// Example usage
const inputFilePath = path.resolve(__dirname, '../../files/v1025/PayMovieStaff.txt'); // Input file path
processAndSavePayMovieStaff(inputFilePath);