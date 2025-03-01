const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = express();

// Setting the root directory to the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Setup the logger to write to a file
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Middleware to check user-agent
app.use('/conf/first.bin', (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const regex = /^WM\/9198\/.*/; // Regular expression to match "WM/9198/*"

    if (req.method === 'GET' && req.url === '/v770/first.bin') {
        if (regex.test(userAgent)) {
            return res.sendFile(path.join(__dirname, 'v770', 'first.bin'));
        } else {
            return res.status(404).send('Not Found');
        }
    }
    next();
});

// POST endpoint for /SMP/smp.cgi
app.post('/SMP/smp.cgi', (req, res) => {

    // Implement the logic that was previously in smp.cgi
    try {
        // Example logic
        const responseMessage = 'Script executed successfully in Node.js';

        // Additional processing logic here...

        res.send(responseMessage);
    } catch (err) {
        console.error('Error executing logic:', err);
        res.status(500).send('Error executing logic');
    }
});

// import content common for all versions
require('./Movies.js');
require('./images.js');
require('./PayMovies.js');
require('./PayVideos.js');

//import Content for v770
require('./v770/Calendar.js');
require('./v770/PosterMeta.js');
require('./v770/datetime.js');
require('./Movies.js');
require('./images.js');
require('./PayMovies.js');
require('./v770/MovieLink.js');
require('./v770/Event.js');
require('./v770/LicenseAgree.js');
require('./v770/PayEvent.js');
require('./v770/PayPosterMeta.js');
require('./v770/NewPayMovies.js');
require('./v770/PayCategoryHeader.js');
require('./v770/Caldaily.js');
require('./v770/CategoryList.js');
require('./v770/CategoryMovies.js');
require('./v770/MovieMeta.js');

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});