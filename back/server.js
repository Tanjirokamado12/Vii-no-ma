const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require('axios');
require("dotenv").config(); // Environment variables for secure credentials

// Import your custom modules (ensure paths are correct)
const { processPayMovieMeta } = require("./v1025/paymoviemeta.js");

const app = express();

// Setting the root directory to the parent directory
app.use(express.static(path.join(__dirname, "..")));

// Create a write stream (in append mode) for logging
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

// Setup the logger to write to a file
app.use(morgan("combined", { stream: accessLogStream }));

// Enable body parsing
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(bodyParser.text()); // For parsing text/plain

// Email configuration for reservations
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Gmail email
        pass: process.env.EMAIL_PASS // Gmail app password
    }
});

// Define POST endpoint for handling reservations and sending emails
app.post("/smp.cgi", (req, res) => {

    // Destructure fields from request body
    const {
        sppageid, smpid, macadr, wiiid, type, last, first, 
        lkana, fkana, zip, state, city, addr1, addr2, tel, 
        mail, mii1, age1, sex1, blood1
    } = req.body;

    // Check for  required fields
    if (!mail || !last || !first || !type) {
      
        // Return a static file if required fields are missing
        return res.sendFile(path.join(__dirname, "../smp.cgi")); // Ensure '../smp.cgi' exists in the current directory
    }

    // Compose the email body
    const emailBody = `
        Hello ${first} ${last},

        Thank you for providing your details. Here is the information you submitted:

        - SP Page ID: ${sppageid}
        - SMP ID: ${smpid}
        - MAC Address: ${macadr}
        - Wii ID: ${wiiid}
        - Type: ${type}
        - Name: ${last} ${first}
        - Kana (Last): ${lkana}, Kana (First): ${fkana}
        - ZIP Code: ${zip}
        - State: ${state}
        - City: ${city}
        - Address Line 1: ${addr1}
        - Address Line 2: ${addr2}
        - Telephone: ${tel}
        - Email: ${mail}
        - Mii: ${mii1}
        - Age: ${age1}
        - Sex: ${sex1}
        - Blood Type: ${blood1}

        If any of this information is incorrect, please let us know.

        Best regards,
        Your Team
    `;

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email (Gmail)
        to: mail,                     // Recipient's email
        subject: "Your Submitted Details",
        text: emailBody
    };

    // Send email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            error("Error sending email:", error);
            return res.status(500).send("Failed to send email");
        }
        
        // After successfully sending the email, return the static HTML file
        res.sendFile(path.join(__dirname, "../smp.cgi")); // Ensure 'success.html' exists in the current directory
    });
});



// Additional POST and GET handlers for `/ecs/services/ECommerceSOAP`
app.post('/ecs/services/ECommerceSOAP', async (req, res) => {
    try {
        const targetUrl = 'https://oss-auth.blinklab.com/oss/serv/ecs/services/ECommerceSOAP'; // Target URL

        // Forward the POST request to the target URL
        const targetResponse = await axios.post(targetUrl, req.body, {
            headers: req.headers, // Forward headers from the original request
            httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Bypass certificate issues
        });

        // Send back the response from the target URL to the client
        res.status(targetResponse.status).send(targetResponse.data);

    } catch (error) {
        error('Error forwarding POST request:', error.message);

        // Respond with error details
        res.status(500).send({
            error: 'An error occurred while redirecting the POST request.',
            details: error.message,
        });
    }
});

app.get('/ecs/services/ECommerceSOAP', async (req, res) => {
    try {
        const targetUrl = 'https://oss-auth.blinklab.com/oss/serv/ecs/services/ECommerceSOAP'; // Target URL

        // Forward the GET request to the target URL
        const targetResponse = await axios.get(targetUrl, {
            headers: req.headers, // Forward headers from the original request
            httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) // Bypass certificate issues
        });

        // Send back the response from the target URL to the client
        res.status(targetResponse.status).send(targetResponse.data);

    } catch (error) {
        error('Error forwarding GET request:', error.message);

        // Respond with error details
        res.status(500).send({
            error: 'An error occurred while redirecting the GET request.',
            details: error.message,
        });
    }
});

// Import content common for all versions
require("./Delivery.js");
require("./images.js");
require("./Movies.js");
require("./PayMovies.js");
require("./TheatreLogos.js");

// Import Content for v770
require("./v770/Datetime.js");
require("./v770/Event.js");
require("./v770/PayEvent.js");
require("./v770/Caldaily.js");
require("./v770/MovieLink.js");
require("./v770/Calendar.js");
require("./v770/PayPosterMeta.js");
require("./v770/PosterMeta.js");
require("./v770/LicenseAgree.js");
require("./v770/ConsiergeMii.js");
require("./v770/NewPayMovies.js");
require("./v770/PayCategoryHeader.js");
require("./v770/MovieMeta.js");
require("./v770/CategoryList.js");
require("./v770/CategoryMovies.js");
require("./v770/Support.js");
require("./v770/Verify.js");
require("./v770/PayTitle.js");
require("./v770/Challenge.js");
require("./v770/PayMovieMeta.js");
require("./v770/PayCategoryList.js");
require("./v770/PayCategoryMovies.js");
require("./v770/AttrPopularPayMovies.js");
require("./v770/PopularPayMovies.js");
require("./v770/paysearchmovies.js");
require("./v770/SpPage.js");
require("./v770/SpPageBin.js");
require("./v770/SpPageList.js");
require("./v770/Enquete.js");
require("./v770/Piceval.js");
require("./v770/DeliveryAgree.js");
require("./v770/CouponAgree.js");
require("./v770/SpContact.js");
require("./v770/AllPopularMovies.js");
require("./v770/AttrPopularMovies.js");
require("./v770/AllNewMovies.js");
require("./v770/RIVToken.js");
require("./v770/SearchMovies.js");
require("./v770/PayEvaluate.js");
require("./v770/Miiinfo.js");
require("./v770/Evaluate.js");
require("./v770/MovieStaff.js");
require("./v770/PayMovieStaff.js");
require("./v770/SampleRequest.js");

// Import Content for v1025
require("./v1025/Event.js");
require("./v1025/MovieLink.js");
require("./v1025/PayEvent.js");
require("./v1025/RegionInfo.js");
require("./v1025/SpPageBin.js");
require("./v1025/SpPageList.js");
require("./v1025/PosterMeta.js");
require("./v1025/LicenseAgree.js");
require("./v1025/MiiInfo.js");
require("./v1025/SampleRequest.js");
require("./v1025/CategoryList.js");
require("./v1025/CategoryMovies.js");
require("./v1025/MovieMeta.js");
require("./v1025/PayCategoryHeader.js");
require("./v1025/RelatedMovies.js");
require("./v1025/SpPage.js");
require("./v1025/PayCategoryList.js");
require("./v1025/PayCategoryMovies.js");
require("./v1025/PopularPayMovies.js");
require("./v1025/AttrPopularPayMovies.js");
require("./v1025/NewPayMovies.js");
require("./v1025/DeliveryAgree.js");
require("./v1025/CouponAgree.js");
require("./v1025/PicEval.js");
require("./v1025/Enquete.js");
require("./v1025/PayPosterMeta.js");
require("./v1025/ConsiergeMii.js");
require("./v1025/SearchMovies.js");
require("./v1025/Challenge.js");
require("./v1025/PayEvaluate.js");
require("./v1025/Evaluate.js");
require("./v1025/PaySearchMovies.js");
require("./v1025/PayReleatedMovies.js");
require("./v1025/PayFlashEvaluate.js");
require("./v1025/FlashEvaluate.js");
require("./v1025/RIVToken.js");
require("./v1025/Verify.js");
require("./v1025/Support.js");
require("./v1025/PayTitle.js");
require("./v1025/AllNewMovies.js");
require("./v1025/AllPopularMovies.js");
require("./v1025/AttrPopularMovies.js");
require("./v1025/MovieStaff.js");
require("./v1025/PayMovieStaff.js");
require("./v1025/SpContact.js");

// Import Content of v0/v512
require("./v512/Calendar.js");
require("./v512/Event.js");
require("./v512/PosterMeta.js");
require("./v512/GenrePopularMovies.js");
require("./v512/AllPopularMovies.js");
require("./v512/GenreNewMovies.js");
require("./v512/AllNewMovies.js");
require("./v512/RecomdMovies.js");
require("./v512/Caldaily.js");
require("./v512/LicenseAgree.js");
require("./v512/SearchMovies.js");
require("./v512/SpPageList.js");
require("./v512/MovieMeta.js");
require("./v512/Evaluate.js");
require("./v512/SpPage.js");
// Catch-all POST request handler
app.post("*", (req, res) => {
    const requestedFile = path.join(__dirname, "..", req.path);

    fs.access(requestedFile, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            res.status(404).send("File not found");
        } else {
            // File exists, return 200 OK
            res.status(200).sendFile(requestedFile);
        }
    });
});

// A simple GET endpoint for testing
app.get("/", (req, res) => {
    res.send("Wii Room Reservation Service is running!");
});

// Start the server
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
