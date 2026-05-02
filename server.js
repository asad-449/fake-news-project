const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Home route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// ✅ Fake News Detection API
app.post("/check", (req, res) => {
  try {
    let text = req.body.text.toLowerCase();

    let fakeWords = ["shocking", "fake", "secret", "exposed"];
    let realWords = ["official", "report", "confirmed"];

    let score = 0;
    let reasons = [];

    fakeWords.forEach(word => {
      if (text.includes(word)) {
        score++;
        reasons.push("Suspicious word: " + word);
      }
    });

    realWords.forEach(word => {
      if (text.includes(word)) {
        score--;
        reasons.push("Reliable word: " + word);
      }
    });

    let confidence = Math.min(Math.abs(score) * 20 + 50, 95);
    let result = score > 0 ? "Fake" : "Real";

    res.json({
      result,
      confidence,
      explanation: "Basic keyword-based analysis",
      reasons
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: "Error",
      confidence: 0,
      explanation: "Server error",
      reasons: []
    });
  }
});

// ✅ Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});