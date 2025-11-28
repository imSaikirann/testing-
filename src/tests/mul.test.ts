import { beforeAll, describe, expect, it } from "vitest";
import { app } from "..";
import request from "supertest";
import resetDb from "./helpers/reset-db";
import { redis } from "../config/redis";

describe("POST /sum", () => {
    beforeAll(async () => {
        console.log("clearing db");
        await resetDb();
    });

 it("should multiply 2 numbers", async () => {
    const{ status, body } = await request(app).post("/mul").send({
        a: 2,
        b: 3
    });
    expect(status).toBe(200);
    expect(body).toEqual({ answer: 6, id: expect.any(Number)});
 });

 it("should multiply 2 negative numbers", async () => {
    const{ status,body } = await request(app).post("/mul").send({
        a: -3,
        b: -4
    });
    expect(status).toBe(200);
    expect(body).toEqual({ answer: 12, id: expect.any(Number)});
 });

 it("should block the number is too long", async () =>{
    const res = await request(app).post("/mul").send({
        a: 100000008,
        b: 6
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch("Sorry we dont support big numbers");
 });

 it("should clear redis cache", async () => {
    await redis.set("requests_cache", "dummy");

    await request(app).post("/mul").send({ 
        a: 2, 
        b: 3 
    });

    const cache = await redis.get("requests_cache");
    expect(cache).toBe(null); 
  });
   
});
