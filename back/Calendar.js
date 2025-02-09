const fs = require('fs');
const path = require('path');

// Define the output directory
const outputDir = path.join(__dirname, '../v770/url1/cal/');

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

// Generate XML files for each week
const startDate = new Date('2024-12-30'); // Start from the last Sunday of 2024
const endDate = new Date('2026-01-04'); // Include the first Saturday of 2026

let seq = 1;
for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
    let xmlContent = `<Calendar>\n  <ver>1</ver>\n`;

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(date);
        currentDate.setDate(date.getDate() + i);

        const formattedDateForXML = formatDateForXML(currentDate);
        const wday = getDayAbbr(currentDate);

        xmlContent += `  <dayinfo>\n    <date>${formattedDateForXML}</date>\n    <wday>${wday}</wday>\n    <holiday>0</holiday>\n    <thead>0</thead>\n    <movieinfo>\n      <seq>1</seq>\n      <movieid>1</movieid>\n      <strdt>2025-02-09T10:23:48</strdt>\n      <enddt>2025-02-09T10:23:48</enddt>\n      <title>test movie</title>\n    </movieinfo>\n  </dayinfo>\n`;
        seq++;
    }

    xmlContent += `</Calendar>`;

    const outputFileName = formatDateForFileName(date);
    const outputPath = path.join(outputDir, `${outputFileName}.xml`);
    fs.writeFileSync(outputPath, xmlContent.trim(), 'utf8');
}

console.log('Weekly calendar XML files generated successfully!');
