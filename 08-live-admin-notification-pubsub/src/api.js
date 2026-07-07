const express = require("express");
const Redis = require("ioredis");
const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const app = express();

app.use(express.json());

app.post("/notifications", async (req, res) => {
  const payload = {
    title: req.body.title,
    createdAt: new Date().toISOString(),
  };
  const receivers = await publisher.publish(
    "notifications",
    JSON.stringify(payload),
  );

  res.status(200).json({
    message: `Notification sent to ${receivers} subscriber!`,
  });
});

app.listen(8528, () => {
  console.log("Server is running on port 8528");
});
