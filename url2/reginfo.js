const fs = require('fs');

function getCurrentDateTime() {
  const date = new Date();
  // Format the date and time without milliseconds and the 'Z'
  return date.getFullYear() + '-' +
         String(date.getMonth() + 1).padStart(2, '0') + '-' +
         String(date.getDate()).padStart(2, '0') + 'T' +
         String(date.getHours()).padStart(2, '0') + ':' +
         String(date.getMinutes()).padStart(2, '0') + ':' +
         String(date.getSeconds()).padStart(2, '0');
}

function updateRegionInfo() {
  const regionInfo = `
<RegionInfo>
  <ver>399</ver>
  <sdt>${getCurrentDateTime()}</sdt>
  <cdt>${getCurrentDateTime()}</cdt>
  <limited>0</limited>
</RegionInfo>
  `;
  
  fs.writeFileSync('Reginfo.cgi', regionInfo);
  console.log('RegionInfo XML file updated with current date and time.');
}

// Update the RegionInfo file every second (1000 milliseconds)
setInterval(updateRegionInfo, 1000);
