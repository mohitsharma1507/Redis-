const express = require("express");
const Redis = require("ioredis");
const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUERY_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "NO SUBJECT",
    body: req.body.body || "NO BODY",
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(QUERY_KEY, JSON.stringify(job));
  res.json({ queued: true, job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUERY_KEY);
  if (!rawJob) {
    return res.json({ message: "No email jobs in the queue" });
  }
  const job = JSON.parse(rawJob);
  res.json({ processed: "Email sent", job });
});

app.listen(8070, () => {
  console.log("Server is running on port http://localhost:8070");
});
