const builder = require('xmlbuilder');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Function to parse movie info from file
const parseMovieInfo = async (filePath) => {
  const movieInfo = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentMovie = {};
  for await (const line of rl) {
    if (line.startsWith('start_movieinfo')) {
      currentMovie = {};
    } else if (line.startsWith('end_movieinfo')) {
      movieInfo.push(currentMovie);
    } else if (line.trim()) { // Check if line is not empty or undefined
      const [key, value] = line.split(':');
      if (key && value) {
        currentMovie[key.trim()] = value.trim();
      }
    }
  }

  return movieInfo;
};

// Function to generate calendar XML for a week
const generateWeeklyCalendar = (startDate, movieInfoList) => {
  const xml = builder.create('Calendar', { headless: true })
    .ele('ver', '1').up();

  // Ensure the start date is a Monday
  let date = new Date(startDate);
  while (date.getDay() !== 1) { // 1 represents Monday
    date.setDate(date.getDate() + 1);
  }

  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 6);

  while (date <= endDate) {
    const dayinfo = xml.ele('dayinfo');
    const formattedDate = date.toISOString().split('T')[0];
    const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 2);
    const enddtFormattedDate = `2036-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T00:00:00`;

    dayinfo.ele('date', formattedDate).up();
    dayinfo.ele('wday', weekDay).up();
    dayinfo.ele('holiday', '0').up();
    dayinfo.ele('thead', '0').up();

    movieInfoList.forEach(info => {
      const movieinfo = dayinfo.ele('movieinfo');
      movieinfo.ele('seq', info.seq).up();
      movieinfo.ele('movieid', info.movieid).up();
      movieinfo.ele('strdt', `${formattedDate}T00:00:00`).up();
      movieinfo.ele('enddt', enddtFormattedDate).up();
      movieinfo.ele('title', info.title).up();
    });

    // Move to the next day
    date.setDate(date.getDate() + 1);
  }

  return xml.end({ pretty: true });
};

// Main function to load movie info and generate weekly calendars
const main = async () => {
  const movieInfoFilePath = path.join(__dirname, '../../files/v770/caldaily.txt');
  const outputDir = path.join(__dirname, '../../v770/url1/cal');

  // Ensure the output directory exists
  fs.ensureDirSync(outputDir);

  const movieInfoList = await parseMovieInfo(movieInfoFilePath);

  const startDate = new Date('2024-12-01');
  const endDate = new Date('2026-12-31');

  let date = new Date(startDate);

  // Ensure the start date is a Monday
  while (date.getDay() !== 1) { // 1 represents Monday
    date.setDate(date.getDate() + 1);
  }

  while (date <= endDate) {
    const weekStartDate = new Date(date);
    const xml = generateWeeklyCalendar(weekStartDate, movieInfoList);

    const outputFilePath = path.join(outputDir, `${weekStartDate.getFullYear()}${(weekStartDate.getMonth() + 1).toString().padStart(2, '0')}${weekStartDate.getDate().toString().padStart(2, '0')}.xml`);
    fs.writeFileSync(outputFilePath, xml);


    // Move to the next week
    date.setDate(date.getDate() + 7);
  }
};

main().catch(console.error);
