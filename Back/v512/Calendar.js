const builder = require('xmlbuilder');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Function to parse Movie info from file
const parsemovieinfo = async (filePath) => {
  const movieinfo = [];
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
      movieinfo.push(currentMovie);
    } else if (line.trim()) { // Check if line is not empty or undefined
      const [key, value] = line.split(':');
      if (key && value) {
        currentMovie[key.trim()] = value.trim();
      }
    }
  }

  return movieinfo;
};

// Function to generate calendar XML for a week
const generateWeeklyCalendar = (startDate, movieinfoList) => {
  const xml = builder.create('Calendar', { headless: true })
    .ele('ver', '1').up();

  let date = new Date(startDate);
  while (date.getDay() !== 1) { // Ensure the start date is MOnday
    date.setDate(date.getDate() + 1);
  }

  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 6);

  while (date <= endDate) {
    const dayinfo = xml.ele('dayinfo');
    const formattedDate = date.toISOString().split('T')[0];
const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2).toUpperCase();
    const enddtFormattedDate = `2036-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T00:00:00`;

    dayinfo.ele('date', formattedDate).up();
    dayinfo.ele('wday', weekDay).up();
    dayinfo.ele('holiday', '0').up();
    dayinfo.ele('thead', '0').up();

    movieinfoList.forEach(info => {
      const movieinfo = dayinfo.ele('movieinfo');
      movieinfo.ele('seq', info.seq).up();
      movieinfo.ele('movieid', info.movieid || 'DefaultMovieID').up();
      movieinfo.ele('strdt', `${formattedDate}T00:00:00`).up();
      movieinfo.ele('enddt', enddtFormattedDate).up();
      movieinfo.ele('title', info.title).up();
    });

    date.setDate(date.getDate() + 1); // MOve to the next day
  }

  // Add <upddt> before closing </Calendar>
  xml.ele('upddt', '2009-04-23T16:30:00').up();

  return xml.end({ pretty: true });
};


// Main function to load Movie info and generate weekly calendars
const main = async () => {
  const movieinfoFilePath = path.join(__dirname, '../../files/v512/caldaily.txt');
  const outputDir = path.join(__dirname, '../../v512/url1/cal/');
  const thisWeekOutputPath = path.resolve(__dirname, '../../v512/url1/cal/this.xml'); // Save current week's file here

  fs.ensureDirSync(outputDir); // Ensure the output directory exists

  const movieinfoList = await parsemovieinfo(movieinfoFilePath);

  const startDate = new Date('2023-01-01');
  const endDate = new Date('2027-12-31');
  let date = new Date(startDate);

  while (date.getDay() !== 1) { // Ensure the start date is MOnday
    date.setDate(date.getDate() + 1);
  }

  const today = new Date();
  const currentMOnday = new Date(today);
  while (currentMOnday.getDay() !== 1) { // Ensure currentMOnday is MOnday
    currentMOnday.setDate(currentMOnday.getDate() - 1);
  }



  while (date <= endDate) {
    const weekStartDate = new Date(date);
    const xml = generateWeeklyCalendar(weekStartDate, movieinfoList);
    const formattedFileName = `${weekStartDate.getFullYear()}${(weekStartDate.getMonth() + 1)
      .toString().padStart(2, '0')}${weekStartDate.getDate().toString().padStart(2, '0')}.xml`;
    const outputFilePath = path.join(outputDir, formattedFileName);

    fs.writeFileSync(outputFilePath, xml); // Save weekly file

    // Save current week's file as this.xml if it matches the current MOnday
    if (weekStartDate.toDateString() === currentMOnday.toDateString()) {
      fs.writeFileSync(thisWeekOutputPath, xml);

    }

    date.setDate(date.getDate() + 7); // MOve to the next week
  }


};

main().catch(console.error);
