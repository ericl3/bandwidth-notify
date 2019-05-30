const express = require("express");

class CallbackRouter {
    constructor(BandwidthClient) {
        this.bwClient = BandwidthClient;
        this.router = express.Router();
        //this.router.post("/text", this.someFunc.bind(this));
        this.router.post("/voice", this.receiveCall.bind(this));
    }

    // handles call actions. 
    async receiveCall(req, res) {
        console.log("From: " + req.body.from);
        console.log("Call ID: " + req.body.callId);
        console.log("Event Type: " + req.body.eventType);
        var responseType;
        switch (req.body.eventType) {
            case "incomingcall":
                await this.handleIncomingCall(req.body.callId);
                responseType = "callAnswered";
                break;
            case "answer":
                if (numbers.includes(req.body.to)) {
                    await this.handleAnswerIncoming(req.body.callId);
                    responseType = "audioPlayed";
                } else if (numbers.includes(req.body.from)) {
                    await this.handleAnswerOutbound(req.body.callId, speech.bandwidth);
                    responseType = "speechSent";
                }
                break;
            default:
                responseType = "unhandledCase";
        }
        console.log("Response type: " + responseType);
        console.log(responses[responseType]);
        res.json({ msg: responses[responseType] });
    }
}

module.exports = CallbackRouter;