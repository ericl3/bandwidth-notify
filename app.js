// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const Bandwidth = require("node-bandwidth");
const keys = require("./config/keys");

// Set up apps
const app = express();
const PORT = process.env.PORT || 8080;

// Bring in Routes
const SendRouter = require("./routes/send");
const CallbackRouter = require("./routes/receive");

// Bandwidth client
const BandwidthClient = new Bandwidth({
    userId: keys.userId,
    apiToken: keys.apiToken,
    apiSecret: keys.apiSecret
});

// Body parser for text messages etc.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set view engine
app.set('view engine', 'pug');

// set up stylesheet
app.use(express.static(__dirname + '/public'));

// set up routes
let send = new SendRouter(BandwidthClient);
let receive = new CallbackRouter(BandwidthClient, send);

app.use("/send", send.router);
app.use("/callback", receive.router);

// Home page GET
app.get("/", (req, res) => {
    res.render("index");
});

// Local listen
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

module.exports = app;