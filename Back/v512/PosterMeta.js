const fs = require('fs');
const path = require('path');

// Define templates
const regularTemplate = `
<PosterMeta>
  <ver>1</ver>
  <posterid>{posterid}</posterid>
  <strdt>2009-04-23T16:30:00</strdt>
  <enddt>2035-04-23T16:30:00</enddt>
  <msg>{msg}</msg>
  <movieid>{movieid}</movieid>
  <title>{title}</title>
  <upddt>2009-04-23T16:30:00</upddt>
</PosterMeta>`;

const theatreTemplate = `
<PosterMeta>
  <ver>1</ver>
  <posterid>{posterid}</posterid>
  <strdt>2009-04-23T16:30:00</strdt>
  <enddt>2035-04-23T16:30:00</enddt>
  <msg>{msg}</msg>
  <movieid>{movieid}</movieid>
  <title>{title}</title>
  <upddt>2009-04-23T16:30:00</upddt>
</PosterMeta>`;

// Read the input file
const inputFilePath = path.join(__dirname, '../../files/v512/PosterMeta.txt');
const inputContent = fs.readFileSync(inputFilePath, 'utf8');

// Parse the content assuming it is comma-separated (adjust delimiter as needed)
const lines = inputContent.split('\n').filter(line => line.trim() !== '');
const posters = lines.map(line => {
  const [posterid, msg, movieid, title, type] = line.split(',');
  return { posterid: posterid.trim(), msg: msg.trim(), movieid: movieid.trim(), title: title.trim(), type: type ? type.trim() : 'regular' };
});

// Function to generate and save PosterMeta files
posters.forEach(poster => {
  const template = poster.type === 'theatre' ? theatreTemplate : regularTemplate;
  const data = template
    .replace('{posterid}', poster.posterid)
    .replace('{msg}', poster.msg)
    .replace('{movieid}', poster.movieid)
    .replace('{title}', poster.title);
  
  // Define the file path
  const outputPath = path.join(__dirname, '../../v512/url1/wall', `${poster.posterid}.met`);
  
  // Ensure the output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the data to the file
  fs.writeFileSync(outputPath, data, 'utf8');
  
});
