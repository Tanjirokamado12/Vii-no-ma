//v770 requirements
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
require('./sppagebin.js');

//v0 and 512 Requirments
require('./v512/AllNew.js');
require('./v512/AllPopular.js');
require('./v512/caldaily.js');
require('./v512/Calendar.js');
require('./v512/Event.js');
require('./v512/LicenseAgree.js');
require('./v512/New.js');
require('./v512/popular.js');
require('./v512/PosterMeta.js');
require('./v512/recomd.js');
require('./v512/sppagelist.js');
require('./v512/This.js');

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

// Middleware to check user-agent
app.use('/conf/first.bin',(req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const regex = /^WM\/9198\/.*/;  // Regular expression to match "WM/9198/*"

    if (req.method === 'GET' && req.url === '/v770/first.bin') {
        if (regex.test(userAgent)) {
            return res.sendFile('/v770/first.bin', { root: __dirname });
        } else {
            return res.status(500).send('Not Found');
        }
    }
    next();
});

// Require and run other Node.js scriptss

const port = process.env.PORT || 80;
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
