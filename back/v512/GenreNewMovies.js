const fs = require("fs");
const { create } = require("xmlbuilder2");

// Parse the TXT file and extract movie data
function parseTxtFile(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n");

  const result = [];
  let genre = null;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("type:")) {
      genre = trimmedLine.split(":")[1]; // Extract the type (genre)
    } else if (trimmedLine.startsWith("movieid:")) {
      const movieid = trimmedLine.split(":")[1].trim(); // Extract movieid
      const title = lines[index + 1].split(":")[1].trim(); // Extract title (next line)
      result.push({ genre, movieid, title });
    }
  });

  return result;
}

// Generate XML for a specific type
function generateTypeXML(type, movies) {
  const root = create().ele("GenreNewMovies"); // Start with the root element
  root.ele("ver").txt("1").up(); // Add <ver>
  root.ele("genre").txt(type).up(); // Add <genre> with the type number

  let currentRank = 1;

  movies.forEach(movie => {
    const movieNode = root.ele("movieinfo");
    movieNode.ele("rank").txt(currentRank++).up();
    movieNode.ele("movieid").txt(movie.movieid).up();
    movieNode.ele("title").txt(movie.title).up();
    movieNode.ele("pay").txt("0").up();
    movieNode.up();
  });

  // Add the <upddt> tag before closing the root element
  root.ele("upddt").txt("2009-04-23T16:30:00").up();

  return root.end({ prettyPrint: true, headless: true }); // 'headless: true' omits the XML declaration
}

function main() {
  const txtFilePath = "../files/v512/GenreNewMovies.txt"; // Input file path
  const parsedData = parseTxtFile(txtFilePath);

  // Define output directory
  const outputDirectory = "../v512/url1/list/new/";

  // Ensure the directory exists
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
    (`Directory created: ${outputDirectory}`);
  }

  // Group movies by type
  const groupedData = parsedData.reduce((acc, movie) => {
    acc[movie.genre] = acc[movie.genre] || [];
    acc[movie.genre].push(movie);
    return acc;
  }, {});

  // Generate and save XML for each type
  Object.keys(groupedData).forEach(type => {
    const movies = groupedData[type];
    const xmlOutput = generateTypeXML(type, movies);

    const fileName = `${outputDirectory}0${type}.xml`; // Save in the specified directory with "0" prefix
    fs.writeFileSync(fileName, xmlOutput);
    (`XML file saved as ${fileName}`);
  });

  // Add new type dynamically and create its file
  const newType = "6"; // Specify the new type
  const newMovies = [
    { genre: newType, movieid: "new1", title: "New Movie 1" },
    { genre: newType, movieid: "new2", title: "New Movie 2" }
  ];

  const newTypeXML = generateTypeXML(newType, newMovies);
  const newTypeFileName = `${outputDirectory}0${newType}.xml`; // Save in the directory with "0" prefix
  fs.writeFileSync(newTypeFileName, newTypeXML);
  (`New type XML file saved as ${newTypeFileName}`);
}

main();
