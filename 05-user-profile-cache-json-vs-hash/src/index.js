const express = require("express");
const Redis = require("ioredis");
const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
  res.json({ message: "User profile cached as JSON" });
});

app.get("/user/:id/json", async (req, res) => {
  const userJson = await redis.get(`user:${req.params.id}:json`);
  if (!userJson) {
    return res.json({ message: "User profile not found" });
  }
  res.json(JSON.parse(userJson));
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.json({ message: "User profile cached as Hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const userHash = await redis.hgetall(`user:${req.params.id}:hash`);
  if (Object.keys(userHash).length === 0) {
    return res.json({ message: "User profile not found" });
  }
  res.json(userHash);
});

app.listen(8070, () => {
  console.log("Server is running on port http://localhost:8070");
});
