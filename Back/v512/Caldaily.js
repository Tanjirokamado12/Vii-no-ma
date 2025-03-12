const fs = require('fs');
const path = require('path');
const builder = require('xmlbuilder');

// Function to format date as YYYYMMDD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Function to format datetime as YYYY-MM-DDTHH:MM:SS
function formatDateTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Check if date is invalid
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return '2000-01-01T00:00:00';
    }

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Function to ensure the directory exists
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

// Define the input path
const inputPath = path.join(__dirname, '../../files/v512/CalDaily.txt');

// Read data from CalDaily.txt
const data = fs.readFileSync(inputPath, 'utf8').split(/\r?\n/);

let currentSection = null;
let currentItem = {};
let movieInfos = [];
let trivias = [];

data.forEach(line => {
    if (line.startsWith('start_movieinfo')) {
        currentSection = 'movieinfo';
        currentItem = {};
    } else if (line.startsWith('start_trivia')) {
        currentSection = 'trivia';
        currentItem = {};
    } else if (line.startsWith('end_movieinfo')) {
        movieInfos.push(currentItem);
        currentSection = null;
    } else if (line.startsWith('end_trivia')) {
        trivias.push(currentItem);
        currentSection = null;
    } else if (currentSection) {
        const [key, value] = line.split(':').map(item => item.trim());
        currentItem[key.toLowerCase()] = value;
    }
});

// Define date ranges
const dates = [
    ...generateDates(new Date('2024-12-01'), new Date('2024-12-31')),
    ...generateDates(new Date('2025-01-01'), new Date('2025-12-31')),
    ...generateDates(new Date('2026-01-01'), new Date('2026-12-31'))
];

// Function to generate dates
function generateDates(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

// Loop through the dates and generate XML files
dates.forEach(date => {
    const formattedDate = formatDate(date);
    const formattedStrdt = formatDateTime(date);

    const enddtDate = new Date(date);
    enddtDate.setFullYear(2035);
    const formattedEnddt = formatDateTime(enddtDate);

    const xml = builder.create('CalDaily', { headless: true })
        .ele('ver', 1).up()
        .ele('date', formattedStrdt.split('T')[0]).up()
        .ele('wday', 'WE').up()
        .ele('holiday', 1).up();

    // Add all movieinfo entries
    movieInfos.forEach(info => {
        const movieStrdt = formatDateTime(new Date(info.strdt));
        const movieEnddt = formatDateTime(new Date(new Date(info.strdt).setFullYear(2035)));

        xml.ele('movieinfo')
            .ele('seq', info.seq).up()
            .ele('movieid', info.movieid).up()
            .ele('strdt', movieStrdt).up()
            .ele('enddt', movieEnddt).up()
            .ele('title', info.title).up()
            .up();
    });

    // Add all trivia entries
    trivias.forEach(trivia => {
        xml.ele('trivia')
            .ele('tindex', trivia.tindex).up()
            .ele('thead', trivia.thead).up()
            .ele('tdetail', trivia.tdetail).up()
            .ele('timg', trivia.timg).up()
            .ele('timgnum', trivia.timgnum).up()
            .ele('tbgm', trivia.bgm).up()
            .up();
    });

    // Add the upddt field before closing the document
    xml.ele('upddt', '2009-04-23T16:30:00').up();

    const xmlString = xml.end({ pretty: true });

    // Define the output path
    const outputPath = path.join(__dirname, `../../v512/url1/caldaily/${formattedDate}.xml`);

    // Ensure the output directory exists and save the XML string to a file
    ensureDirectoryExistence(outputPath);
    fs.writeFileSync(outputPath, xmlString);
});
