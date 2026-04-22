const express = require("express");
const cors = require("cors");
const path = require("path");
const { analyzeContent } = require("./utils");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/analyze", (req, res) => {
  const { content, keyword } = req.body || {};

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Please provide content to analyze." });
  }

  const results = analyzeContent(content, keyword || "");
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Content Optimization Dashboard is running on http://localhost:${PORT}`);
});
