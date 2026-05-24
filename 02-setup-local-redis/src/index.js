const express = require("express");
const Redis = require("ioredis");
const mongoose = require("mongoose");

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  try {
    const reply = await redis.ping();
    console.log("Redis PING response:", reply);
    res.json({ redis: reply });
  } catch (error) {
    console.error("Error fetching from Redis:", error);
    res.status(500).send("Error fetching from Redis");
  }
});

app.get("/mongodb", async (req, res) => {
  const url =
    process.env.MONGODB_URL || "mongodb://localhost:27017/chai_aur_redis";

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(url);
      res.json({
        mongodb: "Connected to MongoDB",
        database: mongoose.connection.name,
      });
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      return res.status(500).send("Error connecting to MongoDB");
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
