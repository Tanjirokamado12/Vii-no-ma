const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const multer = require('multer');

const app = express();

// Setting the root directory to the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Setup the logger to write to a file
app.use(morgan('combined', { stream: accessLogStream }));

// Enable body parsing
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(bodyParser.text()); // For parsing text/plain

// Import content common for all versions
require('./Movies.js');
require('./images.js');
require('./PayMovies.js');
require('./PayVideos.js');
require('./v1025images.js');
require('./v1025Movies.js');
require('./v512images.js');
require('./v512Movies.js');


// Import Content for v770
require('./v770/Calendar.js');
require('./v770/MiiInfo.js');
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
require('./v770/SpPageList.js');
require('./v770/SpPagebin.js');
require('./v770/DeliveryAgree.js');
require('./v770/CouponAgree.js');
require('./v770/SpPage.js');
require('./v770/Delivery.js');
require('./v770/PicEval.js');
require('./v770/SampleRequest.js');


// Import Content for v1025
require('./v1025/Event.js');
require('./v1025/MovieLink.js');
require('./v1025/PayEvent.js');
require('./v1025/RegionInfo.js');
require('./v1025/SpPageBin.js');
require('./v1025/SpPageList.js');
require('./v1025/PosterMeta.js');
require('./v1025/PayPosterMeta.js');
require('./v1025/LicenseAgree.js');
require('./v1025/MiiInfo.js');
require('./v1025/SampleRequest.js');
require('./v1025/CategoryList.js');
require('./v1025/CategoryMovies.js');
require('./v1025/MovieMeta.js');
require('./v1025/PayCategoryHeader.js');
require('./v1025/RelatedMovies.js');
require('./v1025/SpPage.js');

// Import Content for v512
require('./v512/Event.js');
require('./v512/Calendar.js');
require('./v512/PosterMeta.js');
require('./v512/GenrePopularMovies.js');
require('./v512/AllPopularMovies.js');
require('./v512/GenreNewMovies.js');
require('./v512/AllNewMovies.js');
require('./v512/RecomdMovies.js');
require('./v512/Caldaily.js');
require('./v512/LicenseAgree.js');
require('./v512/MovieMeta.js');


// Serve static files from the '..' directory
app.use(express.static('..'));

// Catch-all POST request handler
app.post('*', (req, res) => {
    const requestedFile = path.join(__dirname, '..', req.path);
    
    fs.access(requestedFile, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            res.status(404).send('File not found');
        } else {
            // File exists, return 200 OK
            res.status(200).sendFile(requestedFile);
        }
    });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
