const express = require("express");

class CallbackRouter {
    constructor(BandwidthClient) {
        this.bwClient = BandwidthClient;
        this.router = express.Router();
        // this.router.post("/text", this.someFunc.bind(this));
        // this.router.post("/voice", this.someFunc.bind(this));
    }
}

module.exports = CallbackRouter;