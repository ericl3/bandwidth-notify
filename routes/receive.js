const express = require("express");
const numbers = require("../config/numbers");
const responses = require("../config/responses");
const SendRouter = require("./send");

class CallbackRouter {
    constructor(BandwidthClient, SendRouter) {
        this.bwClient = BandwidthClient;
        this.sendRouter = SendRouter;
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
                if (numbers.appNumber === (req.body.from)) {
                    await this.handleAnswerOutbound(req.body.callId);
                    responseType = "gatherSent";
                }
                break;
            case "gather":
                if (req.body.digits === "1") {
                    this.sendRouter.sendText("+16099554542", "Thank you for asking. I am OK");
                    console.log("pressed 1");
                    responseType = "quickNotify";
                } else if (req.body.digits === "2") {
                    this.bwClient.Call.enableRecording(req.body.callId).then((res) => { });
                    console.log("pressed 2");
                    responseType = "customNotify";
                } else if (req.body.digits === "#") {
                    this.bwClient.Call.disableRecording(req.body.callId);
                    console.log("pressed pound. stopped recording");
                    responseType = "endRecording";
                }
                break;
            case "recording":
                this.bwClient.Recording.createTranscription(req.body.recordingId).then((transcriptionId) => { console.log(transcriptionId) });
                responseType = "recordingFinished";
                break;
            case "transcription":
                if (req.body.state === "completed") {
                    this.sendRouter.sendText("+16099554542", req.body.text);
                    console.log(req.body.text);
                    console.log("Transcribed");
                }
                responseType = "transcriptionFinished";
                break;
            case "hangup":
                responseType = "hangup";
                break;
            default:
                responseType = "unhandledCase";
        }
        console.log("Response type: " + responseType);
        console.log(responses[responseType]);
        res.json({ msg: responses[responseType] });
    }

    handleIncomingCall(callId) {
        return this.bwClient.Call.answer(callId);
    }

    handleAnswerOutbound(callId) {
        var selectionOptions = {
            "maxDigits": 1,
            "prompt": {
                "sentence": "This is the check in service. To send a quick check in, press 1. To send a custom recorded message, press 2. After recording, press pound to stop recording. Then you may hang up."
            }
        }
        return this.bwClient.Call.createGather(callId, selectionOptions);
    }
}

module.exports = CallbackRouter;