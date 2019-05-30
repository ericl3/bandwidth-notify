const express = require("express");
const numbers = require("../config/numbers");

// is this for sending calls as well? I suppose that would make sense.
class SendRouter {
    constructor(BandwidthClient) {
        this.bwClient = BandwidthClient;
        this.router = express.Router();
        // this.router.post("/text", this.someFunc.bind(this));
        // this.router.post("/call", this.someFunc.bind(this));
    }

    sendText(destination, text){
        var message={
            from: numbers.appNumber,
            to: destination,
            text: text
        };

        this.bwClient.Message.send(message).then(message => {
            console.log("Message sent with ID " + message.id);
        });
    }
}

module.exports = SendRouter;