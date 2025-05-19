const mongoose = require("mongoose");

module.exports.connectMongoDB = async () => {
    const connectionUrl = Config.get("Database").URL;

    const mongoConfig = {
        autoIndex: false,                   // Disable auto-indexing for better performance
        minPoolSize: 5,                    // Minimum number of connections in the pool
        maxPoolSize: 50,                  // Maximum number of connections in the pool
        serverSelectionTimeoutMS: 5000,  // Shorter timeout to fail fast if DB is unreachable
        socketTimeoutMS: 45000,         // Adjust socket timeout to avoid connection drops
        connectTimeoutMS: 10000,       // Reduce connection timeout for quick failures
        heartbeatFrequencyMS: 10000,  // Improve monitoring and recovery in case of failures
        waitQueueTimeoutMS: 5000,    // Prevent long waits for connections in the pool
    };

    try {
        await mongoose.connect(connectionUrl, mongoConfig);
        Logger.info(`✅ MongoDB Connected Successfully on URL: ${connectionUrl}`);
    } catch (error) {
        Logger.error("❌ MongoDB Connection Failed", { error: error.message });
        process.exit(1); // Exit the process if DB connection fails in production
    }

    // ✅ Handle MongoDB connection events
    mongoose.connection.on("disconnected", () => {
        Logger.warn("⚠️ MongoDB disconnected. Retrying connection...");
    });

    mongoose.connection.on("reconnected", () => {
        Logger.info("✅ MongoDB reconnected successfully");
    });

    mongoose.connection.on("error", (error) => {
        Logger.error("⚠️ MongoDB error:", error);
    });

    // Gracefully handle process termination (useful for Docker, PM2, Kubernetes)
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("🛑 MongoDB connection closed due to app termination");
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        await mongoose.connection.close();
        console.log("🛑 MongoDB connection closed due to SIGTERM");
        process.exit(0);
    });
};
