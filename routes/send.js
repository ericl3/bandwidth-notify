const express = require("express");
const numbers = require("../config/numbers");
const urls = require("../config/urls");

class SendRouter {
    constructor(BandwidthClient) {
        this.bwClient = BandwidthClient;
        this.router = express.Router();
        //this.router.post("/text", this.someFunc.bind(this));
        this.router.post("/call", this.sendCallNotification.bind(this));
    }

    // Simply sends the call
    sendCallNotification(req, res) {
        this.bwClient.Call.create({
            from: numbers.appNumber,
            to: req.body.to,
            callbackUrl: urls.callbackUrlVoice
        }).then(call => console.log(call.id));
        res.json({ msg: "call successfull" });
    }
}


module.exports = SendRouter;