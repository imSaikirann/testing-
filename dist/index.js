"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const redis_1 = require("./config/redis");
const queue_1 = require("./config/queue");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.post("/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const a = req.body.a;
    const b = req.body.b;
    if (a > 1000000 || b > 1000000) {
        return res.status(422).json({
            message: "Sorry we dont support big numbers"
        });
    }
    const result = a + b;
    // ➤ Push to queue instead of DB + cache work
    const queue = yield queue_1.requestQueue.add("ADD", { a, b, answer: result });
    console.log("Job added to queue:", queue.id);
    res.json({ answer: result });
}));
exports.app.post("/mul", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const a = req.body.a;
    const b = req.body.b;
    if (a > 1000000 || b > 1000000) {
        return res.status(422).json({
            message: "Sorry we dont support big numbers"
        });
    }
    const result = a * b;
    const request = yield db_1.prismaClient.request.create({
        data: { a, b, answer: result, type: "MUL" }
    });
    // Clear cache
    yield redis_1.redis.del("requests_cache");
    res.json({ answer: result, id: request.id });
}));
exports.app.get("/requests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1️⃣ Check Redis first
        const cached = yield redis_1.redis.get("requests_cache");
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                return res.json({ data: parsed, cached: true });
            }
            catch (parseError) {
                // If cache contains invalid JSON, clear it and fetch from DB
                console.warn("Invalid cache data, clearing cache:", parseError);
                yield redis_1.redis.del("requests_cache");
            }
        }
        // 2️⃣ If not cached or cache invalid → fetch from DB
        const requests = yield db_1.prismaClient.request.findMany({});
        // 3️⃣ Store in Redis with TTL (optional)
        yield redis_1.redis.set("requests_cache", JSON.stringify(requests), {
            EX: 30 // cache for 30 seconds
        });
        return res.json({ data: requests, cached: false });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}));
