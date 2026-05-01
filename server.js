const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/check", async (req, res) => {
  let text = req.body.text || "";

  try {
    // AI Model (HuggingFace)
    let response = await fetch(
      "https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-fake-news-detection",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: text })
      }
    );

    let data = await response.json();

    // safety check
    if (!data || !data[0]) {
      return res.json({
        result: "Unknown",
        confidence: 0,
        explanation: "AI model did not return valid response"
      });
    }

    let label = data[0][0].label;
    let score = Math.round(data[0][0].score * 100);

    let result = label.toLowerCase().includes("fake") ? "Fake" : "Real";

    let explanation =
      result === "Fake"
        ? "AI detected emotional / misleading patterns in the text."
        : "AI detected factual and structured news-like content.";

    res.json({
      result,
      confidence: score,
      explanation
    });

  } catch (error) {
    res.json({
      result: "Error",
      confidence: 0,
      explanation: "AI service failed or rate limited"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("AI Server running on port " + PORT);
});