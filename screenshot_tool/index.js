// server/index.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static("../client"));

app.post("/upload", upload.single("image"), async (req, res) => {
  const { buffer, originalname } = req.file;
  const notes = req.body.notes || "";
  const base64Image = buffer.toString("base64");

  const content = `data:image/png;base64,${base64Image}`;
  const today = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const filename = `screenshot-${today}.png`;

  try {
    const repo = "GameOX";
    const owner = "Hamedahmas";
    const token = process.env.GITHUB_TOKEN;

    const result = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/screenshots/${filename}`,
      {
        message: `Add screenshot - ${today}`,
        content: base64Image,
      },
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "GameOX-Client",
        },
      }
    );

    res.send("✅ اسکرین‌شات با موفقیت آپلود شد!");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("❌ خطا در آپلود به GitHub");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
