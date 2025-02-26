const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFilePath = path.join(__dirname, '../files/NewPayMovies.txt');
const outputBaseDir = path.join(__dirname, '..', 'v770', 'url3', 'pay', 'movie');

// Map movieid to specific directory and file name
const movieIdMap = {
  '1': 'c4/1/1.met',
  '2': 'c8/2/2.met',
  '3': 'ec/3/3.met',
  '4': 'a8/4/4.met',
  '5': 'e4/5/5.met',
  '6': '16/6/6.met',
  '7': '8f/7/7.met',
  '8': 'c9/8/8.met',
  '9': '45/9/9.met',
  '10': 'd3/10/10.met',
  '11': '65/11/11.met',
  '12': 'c2/12/12.met',
  '13': 'c5/13/13.met',
  '14': 'aa/14/14.met',
  '15': '9b/15/15.met',
  '16': 'c7/16/16.met',
  '17': '70/17/17.met',
  '18': '6f/18/18.met',
  '19': '1f/19/19.met',
  '20': '98/20/20.met',
  '21': '3c/21/21.met',
  '22': 'b6/22/22.met',
  '23': '37/23/23.met',
  '24': '1f/24/24.met',
  '25': '8e/25/25.met',
  '26': '4e/26/26.met',
  '27': '02/27/27.met',
  '28': '33/28/28.met',
  '29': '6e/29/29.met',
  '30': '34/30/30.met',
  '31': 'c1/31/31.met',
  '32': '63/32/32.met',
  '33': '18/33/33.met',
  '34': 'e3/34/34.met',
  '35': '1c/35/35.met',
  '36': '19/36/36.met',
};

// Function to read and parse the content of the input file
function readPosterMetaFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const posterMetaList = [];
    let posterMeta = {};

    lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
            if (key.trim().toLowerCase() === 'movieid') {
                if (posterMeta.movieid) {
                    posterMetaList.push(posterMeta);
                }
                posterMeta = { movieid: value.trim() };
            } else {
                posterMeta[key.trim().toLowerCase()] = value.trim();
            }
        }
    });

    if (posterMeta.movieid) {
        posterMetaList.push(posterMeta);
    }

    return posterMetaList;
}

// Read the content from the input file
const posterMetaList = readPosterMetaFile(inputFilePath);

// Create a function to generate the full path based on the movieid
function getFullPath(movieid) {
    const relativePath = movieIdMap[movieid];
    return path.join(outputBaseDir, relativePath);
}

// Write the XML content to the output files
posterMetaList.forEach(({ movieid, title, kana, refid, note }) => {
    const xmlContent = `<PayMovieMeta>
  <ver>1</ver>
  <movieid>${movieid}</movieid>
  <title>${title}</title>
  <kana>${kana}</kana>
  <len>00:01:59</len>
  <aspect>1</aspect>
  <payenddt>2027-12-12T23:00:00</payenddt>
  <dsdist>0</dsdist>
  <staff>0</staff>
  <note>${note}</note>
  <dimg>0</dimg>
  <eval>0</eval>
  <refid>${refid}</refid>
  <pricecd>1234567</pricecd>
  <term>30</term>
  <price>0</price>
  <sample>1</sample>
  <smpap>1</smpap>
  <released>2011-07-15</released>
  <encrypt>1</encrypt>
  <geofilter>1</geofilter>
</PayMovieMeta>`;
    const filePath = getFullPath(movieid);
    const dirPath = path.dirname(filePath);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, xmlContent.trim(), 'utf8');
});

console.log('XML files for v770 generated successfully!');
