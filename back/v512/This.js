const fs = require('fs');
const xml2js = require('xml2js');
const builder = new xml2js.Builder({ headless: true }); // Removes the XML declaration

const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

function getCurrentWeek() {
  const today = new Date();
  const dayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayIndex === 0 ? 6 : dayIndex - 1)); // Monday

  const weekInfo = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekInfo.push({
      date: date.toISOString().split('T')[0],
      wday: daysOfWeek[i],
      holiday: 0,
      thead: 0,
      movieinfo: {
        seq: 1,
        movieid: 1,
        strdt: date.toISOString(),
        enddt: date.toISOString(),
        title: 'test movie'
      }
    });
  }
  return weekInfo;
}

function updateXMLFile() {
  const currentWeek = getCurrentWeek();

  const calendar = {
    Calendar: {
      ver: 1,
      dayinfo: currentWeek
    }
  };

  const xml = builder.buildObject(calendar);

  // Add <upddt> tag before the closing </Calendar> tag, only once
  const upddtTag = `<upddt>${new Date().toISOString()}</upddt>`;
  const xmlWithUpddt = xml.replace('</Calendar>', `  ${upddtTag}\n</Calendar>`);

  fs.writeFile('../v512/url1/cal/this.xml', xmlWithUpddt, (err) => {
    if (err) {
      console.error('Error writing XML file:', err);
    } else {
      console.log('XML file updated successfully.');
    }
  });
}

// Run the script to update the XML file
updateXMLFile();
