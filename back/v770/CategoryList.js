const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Configure the XML builder without the XML declaration
const builder = new xml2js.Builder({ headless: true });

// Default CategoryList structure
const defaultCategoryList = {
    ver: 1,
    type: 3
};

// Function to read and parse the file
const readFileAndParse = (filePath, callback) => {
    if (!fs.existsSync(filePath)) {
        error('Error: File not found:', filePath);
        return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            error('Error reading file:', err);
            return;
        }
        // Wrap the content with <CategoryList>
        xml2js.parseString(`<CategoryList>${data}</CategoryList>`, (err, result) => {
            if (err) {
                error('Error parsing XML:', err);
                return;
            }
            callback(result);
        });
    });
};

// Function to create directory if it doesn't exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
    return true;
};

// Function to create and save XML files
const createAndSaveXmlFiles = (categinfoList) => {
    for (let i = 0; i < 3; i++) {
        const newContent = builder.buildObject({
            CategoryList: {
                ...defaultCategoryList,
                categinfo: categinfoList
            }
        });
        const filePath = `../v770/url1/list/category/0${i + 1}.xml`;

        // Ensure directory exists before writing the file
        ensureDirectoryExistence(filePath);

        fs.writeFile(filePath, newContent, (err) => {
            if (err) {
                error('Error writing file:', err);
            } else {
            }
        });
    }
};

// Main function
const main = () => {
    const filePath = '../files/v770/categoryList.txt';
    readFileAndParse(filePath, (result) => {
        if (!result || !result.CategoryList || !result.CategoryList.categinfo) {
            error('Invalid file structure: `categinfo` not found');
            return;
        }
        const categinfoList = result.CategoryList.categinfo;
        createAndSaveXmlFiles(categinfoList);
    });
};

main();
