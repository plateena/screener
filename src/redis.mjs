import redis from 'redis';

const redisHost = '127.0.0.1';
const redisPort = 6379;

const conn = async () => {
    const client = redis.createClient({
        host: redisHost,
        port: redisPort,
    });

    await client.connect()
    client.on('error', err => console.log('Redis Client Error', err));
    return client
}

export { conn }

