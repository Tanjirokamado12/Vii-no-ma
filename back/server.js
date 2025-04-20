const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');
const ytdl = require('ytdl-core');
require("dotenv").config(); // Environment variables for secure credentials
const { exec } = require('child_process');
const youtubei = require('youtubei.js'); // Make sure to install youtubei.js (npm install youtubei.js)
const cheerio = require('cheerio'); // For parsing HTML

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

//Youtube On Wii Part

// Define the base output directory
const outputDirectory = path.resolve(__dirname, 'downloads');

// Ensure the base output directory exists
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

// Sanitize YouTube URL
const sanitizeYoutubeUrl = (url) => {
    // Extract the video ID using regex
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
};

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/wiitv', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'ytwii', 'leanbacklite_wii.swf'));
});


// Ensure the base output directory exists
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

// Middleware to parse JSON request bodies
app.use(express.json());

// YouTubei API endpoints
const YOUTUBE_SEARCH_URL = 'https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
const YOUTUBE_VIDEO_INFO_URL = 'https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';


// Helper class for fetching video information
class GetVideoInfo {
  async build(videoId) {
    const streamUrl = `https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&videoId=${videoId}`;
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    };
    const payload = {
      context: {
        client: {
          hl: 'en',
          gl: 'US',
          clientName: 'WEB',
          clientVersion: '2.20210714.01.00',
        },
      },
      videoId: videoId,
      params: "",
    };

    try {
      const response = await axios.post(streamUrl, payload, { headers });

      if (response.status !== 200) {
        return `Error retrieving video info: ${response.status}`;
      }

      const jsonData = response.data;
      const title = jsonData?.videoDetails?.title || 'Unknown Title';
      const length_seconds = jsonData?.videoDetails?.lengthSeconds || 'Unknown Length';
      const author = jsonData?.videoDetails?.author || 'Unknown Author';

      const fmtList = "43/854x480/9/0/115";
      const fmtStreamMap = "43|";
      const fmtMap = "43/0/7/0/0";
      const thumbnailUrl = `http://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

      const responseStr = `status=ok&length_seconds=${length_seconds}&keywords=a&vq=None&muted=0&avg_rating=5.0&thumbnailUrl=${thumbnailUrl}&allow_ratings=1&hl=en&ftoken=&allow_embed=1&fmtMap=${fmtMap}&fmt_url_map=${fmtStreamMap}&token=null&plid=null&track_embed=0&author=${author}&title=${title}&videoId=${videoId}&fmtList=${fmtList}&fmtStreamMap=${fmtStreamMap.split('|')[0]}`;
      return responseStr;
    } catch (error) {
      return `Error occurred: ${error.message}`;
    }
  }
}

// Instantiate GetVideoInfo class
const videoInfo = new GetVideoInfo();

// Route: /video/info/:videoid
app.get('/video/info/:videoid', async (req, res) => {
  const videoId = req.params.videoid;
  try {
    const result = await videoInfo.build(videoId);
    res.type('text/plain').send(result);
  } catch (error) {
    res.status(500).send(`Server error: ${error.message}`);
  }
});

// Helper function for making YouTubei API requests
const makeYouTubeRequest = async (url, payload, headers) => {
  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`YouTube API request failed: ${error.message}`);
  }
};

// Define fetchVideoDuration function
const fetchVideoDuration = async (videoId, headers) => {
  const payload = {
    context: {
      client: {
        hl: 'en',
        gl: 'US',
        clientName: 'WEB',
        clientVersion: '2.20210714.01.00',
      },
    },
    videoId,
  };

  try {
    const response = await axios.post(YOUTUBE_VIDEO_INFO_URL, payload, { headers });
    return response.data?.videoDetails?.lengthSeconds || null; // Return duration in seconds
  } catch (error) {
    console.error(`Failed to fetch duration for videoId ${videoId}:`, error.message);
    return null;
  }
};

// Route: Fetch search results
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send("Query parameter 'q' is required");
  }

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  const payload = {
    context: {
      client: {
        hl: 'en', // Language
        gl: 'US', // Region
        clientName: 'WEB', // Platform
        clientVersion: '2.20210714.01.00', // Client version
      },
    },
    query, // Search query
  };

  try {
    const response = await axios.post(YOUTUBE_SEARCH_URL, payload, { headers });
    const data = response.data;

    // Navigate through the nested structure to find search results
    const primaryContents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;

    if (!primaryContents || !Array.isArray(primaryContents)) {
      return res.status(500).send('Unexpected response format from YouTube');
    }

    // Extract search results
    const videos = primaryContents
      .flatMap((section) => section.itemSectionRenderer?.contents || [])
      .map(async (item) => {
        const video = item?.videoRenderer; // Check if videoRenderer exists
        if (video) {
          // Fetch real duration
          const durationInSeconds = await fetchVideoDuration(video.videoId, headers);
          const durationFormatted = durationInSeconds
            ? new Date(durationInSeconds * 1000).toISOString().substr(11, 8) // Format as HH:MM:SS
            : 'Unknown Duration';

          return {
            title: video.title?.runs?.[0]?.text || 'No Title', // Safeguard access
            videoId: video.videoId || 'No Video ID',
            author: video.ownerText?.runs?.[0]?.text || 'Unknown Author',
            authorId: video.ownerText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || '',
            thumbnailUrl: video.thumbnail?.thumbnails?.[0]?.url || '',
            viewCount: video.viewCountText?.simpleText || '0 views',
            duration: durationFormatted, // Use real duration
            published: video.publishedTimeText?.simpleText || 'Unknown Time',
          };
        }
        return null; // Skip if videoRenderer is not found
      });

    const resolvedVideos = await Promise.all(videos).then((v) => v.filter(Boolean)); // Resolve promises and filter out nulls

    // Generate XML response
    const feed = xmlbuilder.create('feed', { version: '1.0', encoding: 'UTF-8' })
      .att('xmlns:openSearch', 'http://a9.com/-/spec/opensearch/1.1/')
      .att('xmlns:media', 'http://search.yahoo.com/mrss/')
      .att('xmlns:yt', 'http://www.youtube.com/xml/schemas/2015')
      .ele('title', { type: 'text' }, 'Videos').up()
      .ele('generator', { ver: '1.0', uri: 'http://kamil.cc/' }, 'Liinback data API').up()
      .ele('openSearch:totalResults', resolvedVideos.length).up()
      .ele('openSearch:startIndex', 1).up()
      .ele('openSearch:itemsPerPage', 20).up();

    resolvedVideos.forEach((video) => {
      const entry = feed.ele('entry');
      entry.ele('id', `http://192.168.1.192:443/api/videos/${video.videoId}`).up();
      entry.ele('published', video.published).up();
      entry.ele('title', { type: 'text' }, video.title).up();
      entry.ele('link', { rel: `http://192.168.1.192:443/api/videos/${video.videoId}/related` }).up();
      const author = entry.ele('author');
      author.ele('name', video.author).up();
      author.ele('uri', `https://www.youtube.com/channel/${video.authorId}`).up();
      const mediaGroup = entry.ele('media:group');
      mediaGroup.ele('media:thumbnail', {
        'yt:name': 'hqdefault', // Updated thumbnail name
        url: `http://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`, // Updated to use 'hqdefault'
        height: '240',
        width: '320',
        time: '00:00:00',
      }).up();
      mediaGroup.ele('yt:duration', { seconds: video.duration }).up();
      mediaGroup.ele('yt:uploaderId', { id: video.authorId }, video.authorId).up();
      mediaGroup.ele('yt:videoid', { id: video.videoId }, video.videoId).up();
      mediaGroup.ele('media:credit', { role: 'uploader', name: video.author }, video.author).up();
      entry.ele('yt:statistics', {
        favoriteCount: '0',
        viewCount: video.viewCount,
      }).up();
    });

    const xml = feed.end({ pretty: true });
    res.set('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).send('Failed to fetch search results');
  }
});

// Route to handle video download and WebM conversion
// Route to handle video download and conversion
app.get('/video/get/:videoId', async (req, res) => {
    const videoId = req.params.videoId; // Extract video ID from route
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`; // Construct YouTube URL
    const tempOutputPath = path.join(outputDirectory, `${videoId}.mp4`); // Temporary MP4 file
    const finalOutputPath = path.join(outputDirectory, `${videoId}.webm`); // Final WebM file

    // Handle request abortion to log aborted downloads
    req.on('aborted', () => {
        console.warn(`Request aborted by the client for video ID: ${videoId}`);
    });

    // Check if the WebM file already exists
    if (fs.existsSync(finalOutputPath)) {
        console.log(`File already exists: ${finalOutputPath}`);
        // Send the existing file to the client
        return res.download(finalOutputPath, (err) => {
            if (err) {
                console.error(`Error sending WebM file: ${err.message}`);
            }
        });
    }

    try {
        // Log that a new download is starting
        console.log(`Downloading video: ${videoId}...`);

        // Download the video as an MP4 file
        const videoStream = ytdl(videoUrl, { quality: '18' }); // Format 18 is commonly 360p
        const writeStream = fs.createWriteStream(tempOutputPath);

        videoStream.pipe(writeStream);

        // Handle download finish
        writeStream.on('finish', () => {
            console.log(`Download complete. Converting ${tempOutputPath} to WebM...`);

            // FFmpeg command to convert MP4 to WebM
            const ffmpegCommand = [
                'ffmpeg', '-i', `"${tempOutputPath}"`,
                '-c:v', 'libvpx', '-b:v', '300k', '-cpu-used', '8',
                '-pix_fmt', 'yuv420p', '-c:a', 'libvorbis', '-b:a', '128k',
                '-r', '30', '-g', '30', `"${finalOutputPath}"`
            ].join(' ');

            // Execute FFmpeg conversion
            exec(ffmpegCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`FFmpeg error: ${error.message}`);
                    return res.status(500).send('Error converting video to WebM.');
                }

                console.log(`Conversion completed: ${finalOutputPath}`);
                // Send the converted WebM file to the client
                return res.download(finalOutputPath, (downloadError) => {
                    if (downloadError) {
                        console.error(`Error sending WebM file: ${downloadError.message}`);
                        return;
                    }

                    console.log('WebM file sent successfully.');

                    // Optional cleanup: Remove temporary MP4 file
                    try {
                        fs.unlinkSync(tempOutputPath);
                        console.log(`Temporary MP4 file removed: ${tempOutputPath}`);
                    } catch (unlinkError) {
                        console.error(`Error removing temporary file: ${unlinkError.message}`);
                    }
                });
            });
        });

        // Handle stream errors during the download process
        writeStream.on('error', (err) => {
            console.error(`Error writing MP4 file: ${err.message}`);
            return res.status(500).send('Error downloading the video.');
        });

        // Handle errors in video stream
        videoStream.on('error', (err) => {
            console.error(`Error in video stream: ${err.message}`);
            return res.status(500).send('Error streaming the video.');
        });
    } catch (err) {
        console.error(`An unexpected error occurred: ${err.message}`);
        res.status(500).send('An unexpected error occurred while processing your request.');
    }
});

// Set root directory as parent (..)
app.use(express.static(path.join(__dirname, '..')));

// Example route to check if it's working
app.get('/wiitv', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'wiitv', 'leanbacklite_wii.swf'));
});

app.get('/api/users/:channelId/icon', async (req, res) => {
    const channelId = req.params.channelId;
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;

    try {
        // Fetch the YouTube channel webpage
        const response = await axios.get(channelUrl);

        // Load the HTML content using Cheerio
        const $ = cheerio.load(response.data);

        // Extract the profile picture URL from the HTML meta tag
        const profilePicUrl = $('link[rel="image_src"]').attr('href');
        
        if (profilePicUrl) {
            res.redirect(profilePicUrl); // Redirect to the profile picture URL
        } else {
            res.status(404).send('Profile picture not found');
        }
    } catch (error) {
        res.status(500).send(`Error fetching the channel webpage: ${error.message}`);
    }
});

// Start the server
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
