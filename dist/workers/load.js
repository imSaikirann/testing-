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
const autocannon_1 = __importDefault(require("autocannon"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const instance = (0, autocannon_1.default)({
        url: 'http://localhost:4000/api/v1/health',
        connections: 40,
        duration: 20,
    });
    // LIVE BENCHMARK OUTPUT
    autocannon_1.default.track(instance, {
        renderProgressBar: true,
        renderResultsTable: true,
    });
    // FINAL REPORT
    instance.then((result) => {
        console.log("\n-------- Final Report --------");
        console.log(`Avg RPS       : ${result.requests.average}`);
        console.log(`Max RPS       : ${result.requests.max}`);
        console.log(`Errors        : ${result.errors}`);
        console.log(`Timeouts      : ${result.timeouts}`);
        console.log(`Latency (avg) : ${result.latency.average} ms`);
        console.log(`Throughput    : ${(result.throughput.average / 1024).toFixed(2)} KB/s`);
        console.log("------------------------------\n");
        process.exit(0);
    });
});
run();
