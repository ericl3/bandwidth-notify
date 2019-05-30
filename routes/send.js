const express = require("express");
const numbers = require("../config/numbers");
const urls = require("../config/urls");

// is this for sending calls as well? I suppose that would make sense.
class SendRouter {
    constructor(BandwidthClient) {
        this.bwClient = BandwidthClient;
        this.router = express.Router();
        this.router.post("/text", this.sendText.bind(this));
        this.router.post("/call", this.createCall.bind(this));
    }

    sendText(destination, text) {
        var message = {
            from: numbers.appNumber,
            to: destination,
            text: text
        };
        this.bwClient.Message.send(message).then(message => {
            console.log("Message sent with ID " + message.id);
        });
    }

    createCall(req, res) {
        this.bwClient.Call.create({
            from: numbers.appNumber,
            to: req.body.to,
            callbackUrl: urls.callbackUrlVoice
        }).then(call => console.log(call.id));
        res.json({ msg: "call successfull" });
    }
}

module.exports = SendRouter;