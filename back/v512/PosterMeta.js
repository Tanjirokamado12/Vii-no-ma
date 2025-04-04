const fs = require('fs');
const path = require('path');

// Define template
const regularTemplate = `
<PosterMeta>
  <ver>1</ver>
  <posterid>{posterid}</posterid>
  <strdt>2009-04-23T16:30:00</strdt>
  <enddt>2036-04-23T16:30:00</enddt>
  <msg>{msg}</msg>
  <movieid>{movieid}</movieid>
  <title>{title}</title>
  <upddt>2009-04-23T16:30:00</upddt>
</PosterMeta>`;

// Define the path to the input file
const inputFilePath = path.join(__dirname, '../../files/v512/PosterMeta.txt');

// Read the content from the file
const inputContent = fs.readFileSync(inputFilePath, 'utf8');

// Parse the content into blocks
const blocks = inputContent.split(/\r?\n\r?\n/).filter(block => block.trim() !== '');
const posters = blocks.map((block, index) => {
    const lines = block.split(/\r?\n/).map(line => line.trim());
    const data = {};
    lines.forEach(line => {
        const [key, value] = line.split(':').map(part => part.trim());
        data[key] = value;
    });
    return {
        posterid: data.posterid,
        msg: data.msg,
        movieid: data.movieid,
        title: data.title
    };
});

// Process and write files
posters.forEach((poster, index) => {
    if (poster.posterid && poster.msg && poster.movieid && poster.title) {
        const data = regularTemplate
            .replace('{posterid}', poster.posterid)
            .replace('{msg}', poster.msg)
            .replace('{movieid}', poster.movieid)
            .replace('{title}', poster.title);

        const fileName = `${poster.posterid}.met`;
        const outputPath = path.join(__dirname, '../../v512/url1/wall', fileName);

        // Ensure the output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the file
        fs.writeFileSync(outputPath, data, 'utf8');
    } else {
        console.error(`Missing data for poster at index ${index}:`, poster);
    }
});
