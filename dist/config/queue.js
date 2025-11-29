"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestQueue = void 0;
const bullmq_1 = require("bullmq");
exports.requestQueue = new bullmq_1.Queue("requestQueue", {
    connection: {
        host: 'localhost',
        port: 6379
    }
});
