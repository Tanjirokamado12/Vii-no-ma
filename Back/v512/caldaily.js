const fs = require('fs');
const path = require('path');
const builder = require('xmlbuilder');

// Function to get all dates in the range from 2025 to 2026
function generateDates(startYear, endYear) {
    const dates = [];
    const start = new Date(`${startYear}-01-01`);
    const end = new Date(`${endYear}-12-31`);
    while (start <= end) {
        dates.push(new Date(start)); // Store a copy of the current date
        start.setDate(start.getDate() + 1); // Increment by one day
    }
    return dates;
}

// Function to get the weekday abbreviation
function getWeekdayAbbreviation(date) {
    const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return weekdays[date.getDay()];
}

// Function to generate the XML structure for a single day
function createCalDailyXML(date, values) {
    const root = builder.create('CalDaily', { headless: true });
    root.ele('ver', 1);
    root.ele('date', date.toISOString().split('T')[0]); // Format YYYY-MM-DD
    root.ele('wday', getWeekdayAbbreviation(date)); // Add weekday abbreviation
    root.ele('holiday', date.getDay() === 0 || date.getDay() === 6 ? 1 : 0); // Mark weekends as holidays (example logic)

    // Add movieinfo elements
    values.movies.forEach((movie, index) => {
        const movieInfo = root.ele('movieinfo');
        movieInfo.ele('seq', index + 1);
        movieInfo.ele('movieid', movie.movieid);
        movieInfo.ele('strdt', '2000-03-22T09:40:54'); // Example static value
        movieInfo.ele('enddt', '2035-03-22T09:40:54'); // Example static value
        movieInfo.ele('title', movie.title);
    });

    // Add trivia elements
    values.triviaInstances.forEach((trivia, index) => {
        const triviaElement = root.ele('trivia');
        triviaElement.ele('tindex', index + 1);
        triviaElement.ele('thead', trivia.thead);
        triviaElement.ele('tdetail', trivia.tdetail || '');
        triviaElement.ele('timg', 1);
        triviaElement.ele('timgnum', 1);
        triviaElement.ele('tbgm', trivia.tbgm || '');
    });

    // Add the <upddt> element before closing
    root.ele('upddt', '2009-04-23T16:30:00'); // Static value as required

    return root.end({ pretty: true });
}


// Function to read movie and trivia values from the text file
function readValuesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8').split('\n');
    const movies = [];
    const triviaInstances = [];

    let currentMovie = {};
    content.forEach(line => {
        if (line.startsWith('Movieid')) {
            if (currentMovie.movieid) {
                movies.push(currentMovie); // Push the previous movie
            }
            currentMovie = { movieid: line.split(':')[1].trim() };
        } else if (line.startsWith('title')) {
            currentMovie.title = line.split(':')[1].trim();
        } else if (line.startsWith('thead')) {
            triviaInstances.push({ thead: line.split(':')[1].trim() }); // Add a new trivia instance
        } else if (line.startsWith('tdetail')) {
            triviaInstances.forEach(trivia => {
                trivia.tdetail = line.split(':')[1].trim();
            });
        } else if (line.startsWith('tbgm')) {
            triviaInstances.forEach(trivia => {
                trivia.tbgm = line.split(':')[1].trim();
            });
        }
    });
    // Push the last movie entry if it exists
    if (currentMovie.movieid) {
        movies.push(currentMovie);
    }

    return { movies, triviaInstances };
}

// Main logic to generate XML files
function generateXMLForDateRange(startYear, endYear, values, outputDir) {
    const dates = generateDates(startYear, endYear);
    dates.forEach(date => {
        const xmlString = createCalDailyXML(date, values);
        const fileName = `${date.toISOString().split('T')[0].replace(/-/g, '')}.xml`; // File name in YYYYMMDD format
        const filePath = path.join(outputDir, fileName);

        // Ensure directory exists
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(filePath, xmlString);

    });
}

// Read values from the specified text file
const inputFilePath = path.join(__dirname, '../../files/v512/Caldaily.txt'); // Input file path
const values = readValuesFromFile(inputFilePath);

// Generate XML files for all days from 2025 to 2026
const outputDirectory = path.join(__dirname, '../../v512/url1/caldaily'); // Output directory path
generateXMLForDateRange(2025, 2026, values, outputDirectory);

