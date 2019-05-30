const express = require("express");

class SendRouter {
    constructor(BandwidthClient) {
        this.bwClient = BandwidthClient;
        this.router = express.Router();
        this.router.post("/text", this.someFunc.bind(this));
        this.router.post("/call", this.someFunc.bind(this));
    }
}

module.exports = SendRouter;