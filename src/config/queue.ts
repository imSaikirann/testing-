import {Queue} from 'bullmq'


export const requestQueue = new Queue("requestQueue",{
    connection:{
        host: 'localhost',
        port: 6379
    }
})