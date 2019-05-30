// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const Bandwidth = require("node-bandwidth");
const keys = require("./config/keys");

// Set up apps
const app = express();
const PORT = 8080;

// Bring in Routes
const SendRouter = require("./routes/send");
const CallbackRouter = require("./routes/receive");

// Bandwidth client
const BandwidthClient = new Bandwidth({
    userId: keys.userId,
    apiToken: keys.apiToken,
    apiSecret: keys.apiSecret
})

// Body parser for text messages etc.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up routes
let send = new SendRouter(BandwidthClient);
let receive = new CallbackRouter(BandwidthClient, send);

app.use("/send", send.router);
app.use("/callback", receive.router);

// Home page GET
app.get("/", (req, res) => {
    res.json({ msg: "Hello, and welcome to the notifications app" });
})

// Local listen
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});