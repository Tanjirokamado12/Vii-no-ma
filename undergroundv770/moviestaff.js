const fs = require('fs');
const xml2js = require('xml2js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get user input
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Function to create XML from user input
async function createXML() {
  const movieId = await askQuestion('Enter movie ID: ');
  const staffMembers = [];
  let addMore = true;

  while (addMore) {
    const seq = await askQuestion('Enter sequence number: ');
    const role = await askQuestion('Enter role: ');
    const name = await askQuestion('Enter name: ');

    staffMembers.push({ seq, role, name });

    const more = await askQuestion('Do you want to add another staff member? (yes/no): ');
    addMore = more.toLowerCase() === 'yes';
  }

  // Create the MovieStaff XML structure
  const movieStaff = {
    MovieStaff: {
      ver: '1',
      staff: staffMembers.map(member => ({
        seq: member.seq,
        role: member.role,
        name: member.name
      }))
    }
  };

  // Convert the JSON object to XML without declaration
  const builder = new xml2js.Builder({ headless: true });
  const xml = builder.buildObject(movieStaff);

  // Save the XML data to a file named with the movie ID
  fs.writeFileSync(`${movieId}.stf`, xml);

  console.log(`XML data generated and saved to ${movieId}.stf`);
  rl.close();
}

// Run the function to create XML
createXML();
