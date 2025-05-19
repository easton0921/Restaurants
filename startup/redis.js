const { createClient } = require("redis");

let redisClient;

// Redis Connection
module.exports.connectRedis = async () => {
    try {
        redisClient = createClient({
            url: Config.get("Redis").Url,
            socket: {
                connectTimeout: 10000,              // Timeout for initial connection (10 seconds)
                keepAlive: 30000,                   // Keep connection alive (30 seconds)
                reconnectStrategy: (retries) => {
                    const delay = Math.min(retries * 100, 3000);
                    console.log(`Retrying Redis connection in ${delay} ms`);
                    return delay;                  // Exponential backoff with max delay of 3 seconds
                },
            },
            retryStrategy: (attempts) => {
                const delay = Math.min(attempts * 100, 3000);
                console.log(`Redis retry attempt ${attempts}, delaying ${delay} ms`);
                return delay;
            },
        });

        // Event Listeners for Redis Client
        redisClient.on("connect", () => {
            console.log("Connected to Redis successfully.");
        });

        redisClient.on("ready", () => {
            console.log("Redis is ready to use.");
        });

        redisClient.on("error", (error) => {
            console.error("Redis connection error:", error);
        });

        redisClient.on("reconnecting", () => {
            console.warn("Reconnecting to Redis...");
        });

        redisClient.on("end", () => {
            console.warn("Redis connection closed.");
        });

        // Connect to Redis
        await redisClient.connect();

    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1); // Exit process if Redis connection fails in production
    }
};

// Export the Redis client for use in other modules
module.exports.redisClient = () => redisClient;
