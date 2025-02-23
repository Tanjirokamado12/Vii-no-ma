const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = express();

// Setting the root directory to the parent directory
app.use(express.static(path.join(__dirname, '..')));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger to write to a file
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
   res.send('Hello World!');
});

// Redirect route
app.get('/v770/movie/c:categoryId/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.redirect(301, `/Movie/${imageName}`);
});

// Require and run other Node.js scripts
require('./event.js');
require('./datetime.js');
require('./sppageall.js');
require('./PayEvent.js');
require('./images.js');
require('./MovieLink.js');
require('./PosterMeta.js');
require('./PayPosterMeta.js');
require('./LicenseAgree.js');
require('./caldaily.js');
require('./Calendar.js');
require('./categorylist.js');
require('./NewPayMoves.js');
require('./PayCategoryHeader.js');

const port = process.env.PORT || 80;
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
