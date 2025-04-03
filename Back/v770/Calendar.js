const fs = require('fs');
const path = require('path');
const { format, addDays } = require('date-fns');

// Configuration
const startYear = 2025;
const endYear = 2026;
const movieTitle = "Flight of a Shiba";
const movieId = 1;
const outputDir = path.join(__dirname, '../../v770/url1/cal/');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to format weekdays (e.g., "MO", "TU", etc.)
const weekdayNames = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

// Generate XML-like calendar data for each week
const startDate = new Date(`${startYear}-01-01`);
let currentDate = startDate;

// Align the starting day to the nearest Monday if it's not already Monday
while (currentDate.getDay() !== 1) { // 1 = Monday
  currentDate = addDays(currentDate, -1);
}

const endDate = new Date(`${endYear}-12-31`);

while (currentDate <= endDate) {
  const weekStartDate = format(currentDate, 'yyyyMMdd'); // Format as YYYYMMDD
  let weekContent = `<Calendar>\n  <ver>1</ver>\n`;

  for (let i = 0; i < 7; i++) { // 7 days in a week
    if (currentDate > endDate) break; // Stop if beyond endDate
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const weekday = weekdayNames[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]; // Adjust for Sunday = 0

    weekContent += `  <dayinfo>\n`;
    weekContent += `    <date>${dateStr}</date>\n`;
    weekContent += `    <wday>${weekday}</wday>\n`;
    weekContent += `    <holiday>0</holiday>\n`;
    weekContent += `    <thead>0</thead>\n`;
    weekContent += `    <movieinfo>\n`;
    weekContent += `      <seq>1</seq>\n`;
    weekContent += `      <movieid>${movieId}</movieid>\n`;
    weekContent += `      <strdt>2000-01-01T09:00:00</strdt>\n`;
    weekContent += `      <enddt>2000-01-01T11:00:00</enddt>\n`;
    weekContent += `      <title>${movieTitle}</title>\n`;
    weekContent += `    </movieinfo>\n`;
    weekContent += `  </dayinfo>\n`;

    currentDate = addDays(currentDate, 1); // Move to next day
  }
  
  weekContent += `</Calendar>\n`;

  // Save to file in the specified directory, named by the week's start date
  const fileName = `${weekStartDate}.xml`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, weekContent);
}
