const fs = require('fs');
const xmlbuilder = require('xmlbuilder');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to generate XML content
function generateSpPageList(pages, version, upddt) {
    const xml = xmlbuilder.create('SpPageList', { headless: true })  // Remove XML declaration
        .ele('ver', version).up();

    pages.forEach(page => {
        xml.ele('pageinfo')
            .ele('sppageid', page.sppageid).up()
            .ele('name', page.name).up()
            .ele('level', page.level).up()
            .ele('miiid', page.miiid).up()
            .ele('color1', page.color1).up()
            .ele('color2', page.color2).up()
            .ele('logo1id', 'g1234').up()  // Set logo ID to g1234
            .ele('news', page.news).up()
            .up();  // Close pageinfo
    });

    xml.ele('upddt', upddt).up();  // Place upddt directly under SpPageList

    return xml.end({ pretty: true });
}

// Function to prompt user for input for a single page
function promptPage(version, callback) {
    const data = { ver: version };

    rl.question('Enter page ID: ', (sppageid) => {
        data.sppageid = sppageid;

        rl.question('Enter name: ', (name) => {
            data.name = name;

            rl.question('Enter level: ', (level) => {
                data.level = level;

                rl.question('Enter Mii ID: ', (miiid) => {
                    data.miiid = miiid;

                    rl.question('Enter color1: ', (color1) => {
                        data.color1 = color1;

                        rl.question('Enter color2: ', (color2) => {
                            data.color2 = color2;

                            rl.question('Enter news: ', (news) => {
                                data.news = news;
                                callback(data);
                            });
                        });
                    });
                });
            });
        });
    });
}

// Function to prompt for multiple pages
function promptMultiplePages() {
    const pages = [];
    let version;
    let upddt;

    rl.question('Enter version: ', (ver) => {
        version = ver;

        rl.question('Enter update date (YYYY-MM-DDTHH:MM:SS): ', (upd) => {
            upddt = upd;

            function askForNextPage() {
                promptPage(version, (data) => {
                    pages.push(data);

                    rl.question('Do you want to add another page? (yes/no): ', (answer) => {
                        if (answer.toLowerCase() === 'yes') {
                            askForNextPage();
                        } else {
                            rl.close();
                            const xmlContent = generateSpPageList(pages, version, upddt);

                            const outputFile = 'all.xml';  // Set output file name to all.xml
                            fs.writeFile(outputFile, xmlContent, (err) => {
                                if (err) {
                                    console.error('Error writing file:', err);
                                } else {
                                    console.log('XML file created successfully as all.xml!');
                                }
                            });
                        }
                    });
                });
            }

            askForNextPage();
        });
    });
}

promptMultiplePages();
