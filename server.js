const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());

app.post("/check", (req, res) => {
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
    reasons
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});