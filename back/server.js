const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Import your custom modules (ensure paths are correct)
const { processPayMovieMeta } = require("./v1025/paymoviemeta.js");

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
require('./Delivery.js');
require('./images.js');
require('./Movies.js');
require('./PayMovies.js');

// Import Content for v770
require('./v770/Datetime.js');
require('./v770/Event.js');
require('./v770/PayEvent.js');
require('./v770/Caldaily.js');
require('./v770/MovieLink.js');
require('./v770/Calendar.js');
require('./v770/PayPosterMeta.js');
require('./v770/PosterMeta.js');
require('./v770/LicenseAgree.js');
require('./v770/ConsiergeMii.js');
require('./v770/NewPayMovies.js');
require('./v770/PayCategoryHeader.js');
require('./v770/MovieMeta.js');
require('./v770/CategoryList.js');
require('./v770/CategoryMovies.js');
require('./v770/Support.js');
require('./v770/Verify.js');
require('./v770/PayTitle.js');
require('./v770/Challenge.js');
require('./v770/PayMovieMeta.js');
require('./v770/PayCategoryList.js');
require('./v770/PayCategoryMovies.js');
require('./v770/AttrPopularPayMovies.js');
require('./v770/PopularPayMovies.js');
require('./v770/paysearchmovies.js');
require('./v770/SpPage.js');
require('./v770/SpPageBin.js');
require('./v770/SpPageList.js');
require('./v770/Enquete.js');
require('./v770/Piceval.js');
require('./v770/DeliveryAgree.js');
require('./v770/CouponAgree.js');
require('./v770/SpContact.js');
require('./v770/AllPopularMovies.js');
require('./v770/AttrPopularMovies.js');
require('./v770/AllNewMovies.js');
require('./v770/RIVToken.js');
require('./v770/SearchMovies.js');
require('./v770/PayEvaluate.js');
require('./v770/Miiinfo.js');
require('./v770/Evaluate.js');
require('./v770/MovieStaff.js');
require('./v770/PayMovieStaff.js');
require('./v770/SampleRequest.js');

// Import Content for v1025
require('./v1025/Event.js');
require('./v1025/MovieLink.js');
require('./v1025/PayEvent.js');
require('./v1025/RegionInfo.js');
require('./v1025/SpPageBin.js');
require('./v1025/SpPageList.js');
require('./v1025/PosterMeta.js');
require('./v1025/LicenseAgree.js');
require('./v1025/MiiInfo.js');
require('./v1025/SampleRequest.js');
require('./v1025/CategoryList.js');
require('./v1025/CategoryMovies.js');
require('./v1025/MovieMeta.js');
require('./v1025/PayCategoryHeader.js');
require('./v1025/RelatedMovies.js');
require('./v1025/SpPage.js');
require('./v1025/PayCategoryList.js');
require('./v1025/PayCategoryMovies.js');
require('./v1025/PopularPayMovies.js');
require('./v1025/AttrPopularPayMovies.js');
require('./v1025/NewPayMovies.js');
require('./v1025/DeliveryAgree.js');
require('./v1025/CouponAgree.js');
require('./v1025/PicEval.js');
require('./v1025/Enquete.js');
require('./v1025/PayPosterMeta.js');
require('./v1025/ConsiergeMii.js');

// Import Content of v0/v512
require('./v512/Calendar.js');
require('./v512/Event.js');
require('./v512/PosterMeta.js');
require('./v512/GenrePopularMovies.js');
require('./v512/AllPopularMovies.js');
require('./v512/GenreNewMovies.js');
require('./v512/AllNewMovies.js');
require('./v512/RecomdMovies.js');
require('./v512/Caldaily.js');
require('./v512/LicenseAgree.js');
require('./v512/SearchMovies.js');
require('./v512/SpPageList.js');
require('./v512/MovieMeta.js');
require('./v512/Evaluate.js');
require('./v512/SpPage.js');

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
