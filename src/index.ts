import express from "express";
import { prismaClient } from "./db";
import { redis } from "./config/redis";
import { requestQueue } from "./config/queue";

export const app = express();

app.use(express.json());
app.post("/sum", async (req, res) => {
  const a = req.body.a;
  const b = req.body.b;

  if (a > 1000000 || b > 1000000) {
    return res.status(422).json({
      message: "Sorry we dont support big numbers"
    });
  }

  const result = a + b;

  // ➤ Push to queue instead of DB + cache work
  const queue = await requestQueue.add("ADD", { a, b, answer: result }, { removeOnComplete:true});
  console.log("Job added to queue:", queue.id);

  res.json({ answer: result });
});


app.post("/mul", async (req, res) => {
    const a = req.body.a;
    const b = req.body.b;

    if (a > 1000000 || b > 1000000) {
        return res.status(422).json({
            message: "Sorry we dont support big numbers"
        });
    }

    const result = a * b;

    const request = await prismaClient.request.create({
        data: { a, b, answer: result, type: "MUL" }
    });

    // Clear cache
    await redis.del("requests_cache");

    res.json({ answer: result, id: request.id });
});


app.get("/requests", async (req, res) => {
    try {
        // 1️⃣ Check Redis first
        const cached = await redis.get("requests_cache");

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                return res.json({ data: parsed, cached: true });
            } catch (parseError) {
                // If cache contains invalid JSON, clear it and fetch from DB
                console.warn("Invalid cache data, clearing cache:", parseError);
                await redis.del("requests_cache");
            }
        }

        // 2️⃣ If not cached or cache invalid → fetch from DB
        const requests = await prismaClient.request.findMany({
        
        });

        // 3️⃣ Store in Redis with TTL (optional)
        await redis.set("requests_cache", JSON.stringify(requests), {
            EX: 30   // cache for 30 seconds
        });

        return res.json({ data: requests, cached: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
