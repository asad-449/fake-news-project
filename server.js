const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/check", (req, res) => {
  let text = (req.body.text || "").toLowerCase();

  let fakeWords = [
    "shocking", "viral", "exposed", "breaking", "you won't believe"
  ];

  let realWords = [
    "official", "announced", "government", "report", "confirmed", "study"
  ];

  let score = 0;
  let reasons = [];

  fakeWords.forEach(word => {
    if (text.includes(word)) {
      score++;
      reasons.push("⚠️ Clickbait word: " + word);
    }
  });

  realWords.forEach(word => {
    if (text.includes(word)) {
      score--;
      reasons.push("✔ Reliable indicator: " + word);
    }
  });

  if (text.length < 20) {
    score++;
    reasons.push("⚠️ Too short text (low reliability)");
  }

  let confidence = Math.min(Math.abs(score) * 25 + 40, 95);
  let result = score > 0 ? "Fake" : "Real";

  let explanation =
    result === "Fake"
      ? "AI detected emotional or misleading patterns in the text."
      : "AI detected structured and factual news-like content.";

  res.json({
    result,
    confidence,
    explanation,
    reasons
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("AI Server running on port " + PORT);
});