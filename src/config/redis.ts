import { createClient } from "redis";

export const redis = createClient();

redis.on("error", (err) => console.error("Redis Error:", err));

redis.connect();
