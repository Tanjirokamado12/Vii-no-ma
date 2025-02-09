const fs = require('fs');
const path = require('path');

// Define the file path for caldaily.txt
const calDailyFilePath = path.join(__dirname, '../files/caldaily.txt');
const outputDir = path.join(__dirname, '../v770/url1/caldaily/');

// Create directories if they don't exist
fs.mkdirSync(outputDir, { recursive: true });

// Helper function to format date as YYYY-MM-DD for XML
function formatDateForXML(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Helper function to format date as YYYYMMDD for file name
function formatDateForFileName(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

// Helper function to get the day of the week abbreviation
function getDayAbbr(date) {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[date.getDay()];
}

// Read and parse the content of caldaily.txt
function readCalDailyFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    const calDailyData = {
        movieid: lines[0].split(':')[1].trim(),
        title: lines[1].split(':')[1].trim(),
        thead: lines[2].split(':')[1].trim(),
        tdetail: lines[3].split(':')[1].trim(),
        tbgm: lines[4].split(':')[1].trim(),
    };

    return calDailyData;
}

// Read the content from caldaily.txt
const calDailyData = readCalDailyFile(calDailyFilePath);

// Generate XML for each day in 2025
const startDate = new Date('2025-01-01');
const endDate = new Date('2025-12-31');

for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const formattedDateForXML = formatDateForXML(date);
    const formattedDateForFileName = formatDateForFileName(date);
    const wday = getDayAbbr(date);

    const xmlContent = `<CalDaily>
  <ver>1</ver>
  <date>${formattedDateForXML}</date>
  <wday>${wday}</wday>
  <holiday>1</holiday>
  <movieinfo>
    <seq>1</seq>
    <movieid>${calDailyData.movieid}</movieid>
    <strdt>2020-02-09T10:08:31</strdt>
    <enddt>2035-02-09T10:08:31</enddt>
    <title>${calDailyData.title}</title>
  </movieinfo>
  <trivia>
    <tindex>1</tindex>
    <thead>${calDailyData.thead}</thead>
    <tdetail>${calDailyData.tdetail}</tdetail>
    <timg>0</timg>
    <timgnum>1</timgnum>
    <tbgm>${calDailyData.tbgm}</tbgm>
  </trivia>
</CalDaily>`;

    const outputPath = path.join(outputDir, `${formattedDateForFileName}.xml`);
    fs.writeFileSync(outputPath, xmlContent.trim(), 'utf8');
}

console.log('CalDaily XML files for 2025 generated successfully!');
