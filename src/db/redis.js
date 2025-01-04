const Redis = require("ioredis");
const config = require("config");

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.client) {
        return this.client;
      }

      this.client = new Redis({
        ...config.get("redis"),
        lazyConnect: true,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
      });

      // Handle connection events
      this.client.on("connect", () => {
        this.isConnected = true;
        console.log("Redis client connected");
      });

      this.client.on("error", (err) => {
        console.error("Redis client error:", err);
        this.isConnected = false;
      });

      this.client.on("close", () => {
        console.log("Redis client disconnected");
        this.isConnected = false;
      });

      // Initial connection
      await this.client.connect();

      return this.client;
    } catch (error) {
      console.error("Redis connection error:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }

  getClient() {
    if (!this.client || !this.isConnected) {
      throw new Error("Redis client not connected");
    }
    return this.client;
  }
}

// Export singleton instance
const redisClient = new RedisClient();
module.exports = redisClient;
