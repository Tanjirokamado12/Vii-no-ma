const fs = require("fs");
const path = require("path");
const { create } = require("xmlbuilder2");

// Parse the TXT file and extract movie data
function parseTxtFile(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n");

  const result = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("type:")) {
      // Ignore the type line since we are excluding genres
    } else if (trimmedLine.startsWith("movieid:")) {
      const movieid = trimmedLine.split(":")[1].trim(); // Extract movieid
      const title = lines[index + 1].split(":")[1].trim(); // Extract title (next line)
      result.push({ movieid, title });
    }
  });

  return result;
}

// Generate XML for all movies
function generateAllMoviesXML(movies) {
  const root = create().ele("RecomdMovies"); // Start with the root element
  root.ele("ver").txt("1").up(); // Add <ver>

  let currentRank = 1;

  movies.forEach(movie => {
    const movieNode = root.ele("movieinfo");
    movieNode.ele("rank").txt(currentRank++).up();
    movieNode.ele("movieid").txt(movie.movieid).up();
    movieNode.ele("title").txt(movie.title).up();
    movieNode.ele("strdt").txt("2009-04-23T16:30:00").up(); // Add start date after <title>
    movieNode.ele("enddt").txt("2039-04-23T16:30:00").up(); // Add end date after <strdt>
    movieNode.ele("pay").txt("0").up(); // Add <pay> after <enddt>
    movieNode.up();
  });

  // Add the <upddt> tag before closing the root element
  root.ele("upddt").txt("2009-04-23T16:30:00").up();

  return root.end({ prettyPrint: true, headless: true }); // 'headless: true' omits the XML declaration
}

function main() {
  const txtFilePath = "../files/v512/RecomdMovies.txt"; // Input file path
  const parsedData = parseTxtFile(txtFilePath);

  // Define output directory and file path
  const outputDirectory = "../v512/url1/list/recomd/";
  const outputFilePath = path.join(outputDirectory, "all.xml");

  // Ensure the output directory exists
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  // Generate XML for all movies
  const xmlOutput = generateAllMoviesXML(parsedData);

  // Write the XML to a single file named all.xml
  fs.writeFileSync(outputFilePath, xmlOutput);
}

main();
