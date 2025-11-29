import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { prismaClient } from "../db";


new Worker("requestQueue", async job => {
    const { a, b, answer } = job.data;

  
     await prismaClient.request.create({
        data: { a, b, answer, type: "ADD" }
    })
 

    console.log(`Processed job ${job.id} of type ${job.name}`);

    await redis.del("requests_cache");
},{
    connection:{
        host: 'localhost',
        port: 6379
    }
})


