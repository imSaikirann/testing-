import { describe, beforeEach,it, expect, afterAll } from "vitest";
import { app } from "..";
import request from "supertest";
import resetDb from "./helpers/reset-db";
import { redis } from "../config/redis";
import { prismaClient } from "../db";

describe("GET/requests", () => {
    beforeEach(async () => {
       await redis.del("requests_cache");
        await prismaClient.request.create({
            data: { a: 1, b: 2, answer: 2, type: "MUL" }
        });
    });

    afterAll(async () => {
        await prismaClient.$disconnect();
        await redis.quit();
    });

    it("returns data from db when cache is empty", async ()=> {

        const res = await request(app).get("/requests");
        expect(res.status).toBe(200);
        expect(res.body.cached).toBe(false);
    });

    it("returns cached data when redis as cache", async () => {
        await request(app).get("/requests");

        const res = await request(app).get("/requests");
        expect(res.status).toBe(200);
        expect(res.body.cached).toBe(true);
    });

    // it("should return 500 on server error", async () => {
    //     await redis.quit();
    //     const res = await request(app).get("/requests");
    //     expect(res.status).toBe(500);
    //     expect(res.body.message).toMatch("Server error");
    // });
});