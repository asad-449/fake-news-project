const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/check", (req, res) => {
  let text = (req.body.text || "").toLowerCase();

  let fakeWords = ["shocking", "viral", "exposed", "you won't believe", "breaking"];
  let realWords = ["official", "announced", "government", "report", "confirmed", "study"];

  let score = 0;
  let reasons = [];

  // Fake signals
  fakeWords.forEach(word => {
    if (text.includes(word)) {
      score++;
      reasons.push("⚠️ Clickbait word detected: " + word);
    }
  });

  // Real signals
  realWords.forEach(word => {
    if (text.includes(word)) {
      score--;
      reasons.push("✔ Reliable indicator: " + word);
    }
  });

  // Extra logic
  if (text.length < 20) {
    score++;
    reasons.push("⚠️ Text too short for reliable news");
  }

  let confidence = Math.min(Math.abs(score) * 25 + 40, 95);
  let result = score > 0 ? "Fake" : "Real";

  let explanation =
    result === "Fake"
      ? "This content looks misleading or clickbait based on emotional language and lack of reliable signals."
      : "This content appears structured and more consistent with verified news style.";

  res.json({
    result,
    confidence,
    explanation,
    reasons
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});