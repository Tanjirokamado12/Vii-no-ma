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
<Datetime>
  <upddt>${getCurrentDateTime()}</upddt>
</Datetime>
  `;
  
  fs.writeFileSync('datetime.xml', regionInfo);
  console.log('RegionInfo XML file updated with current date and time.');
}

// Update the RegionInfo file every second (1000 milliseconds)
setInterval(updateRegionInfo, 1000);
