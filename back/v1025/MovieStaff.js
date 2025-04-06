const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Predefined file paths for saving files (one per movie)
const filePaths = [
    '../../v1025/url1/movie/c4/1.stf',
    '../../v1025/url1/movie/c8/2.stf',
    '../../v1025/url1/movie/ec/3.stf',
    '../../v1025/url1/movie/a8/4.stf',
    '../../v1025/url1/movie/e4/5.stf',
    '../../v1025/url1/movie/16/6.stf',
    '../../v1025/url1/movie/8f/7.stf',
    '../../v1025/url1/movie/c9/8.stf',
    '../../v1025/url1/movie/45/9.stf',
    '../../v1025/url1/movie/d3/10.stf',
    '../../v1025/url1/movie/65/11.stf',
    '../../v1025/url1/movie/c2/12.stf',
    '../../v1025/url1/movie/c5/13.stf',
    '../../v1025/url1/movie/aa/14.stf',
    '../../v1025/url1/movie/9b/15.stf',
    '../../v1025/url1/movie/c7/16.stf',
    '../../v1025/url1/movie/70/17.stf',
    '../../v1025/url1/movie/6f/18.stf',
    '../../v1025/url1/movie/1f/19.stf',
    '../../v1025/url1/movie/98/20.stf',
    '../../v1025/url1/movie/3c/21.stf',
    '../../v1025/url1/movie/b6/22.stf',
    '../../v1025/url1/movie/37/23.stf',
    '../../v1025/url1/movie/1f/24.stf',
    '../../v1025/url1/movie/8e/25.stf',
    '../../v1025/url1/movie/4e/26.stf',
    '../../v1025/url1/movie/02/27.stf',
    '../../v1025/url1/movie/33/28.stf',
    '../../v1025/url1/movie/6e/29.stf',
    '../../v1025/url1/movie/34/30.stf',
    '../../v1025/url1/movie/c1/31.stf',
    '../../v1025/url1/movie/63/32.stf',
    '../../v1025/url1/movie/18/33.stf',
    '../../v1025/url1/movie/e3/34.stf',
    '../../v1025/url1/movie/1c/35.stf',
    '../../v1025/url1/movie/19/36.stf'
];

// Function to process data and save to separate files
function processAndSaveMovieStaff(inputFilePath) {
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
            const movieStaff = {
                MovieStaff: {
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
            const xml = builder.buildObject(movieStaff);

            fs.writeFile(outputFilePath, xml, err => {
                if (err) {
                    error('Error writing XML file:', err);
                } else {
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
const inputFilePath = path.resolve(__dirname, '../../files/v1025/MovieStaff.txt'); // Input file path
processAndSaveMovieStaff(inputFilePath);
