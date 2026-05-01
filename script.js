async function checkNews() {
  let text = document.getElementById("newsInput").value;
  let resultDiv = document.getElementById("result");

  if (!text) {
    resultDiv.innerHTML = "⚠️ Enter news text";
    return;
  }

  resultDiv.innerHTML = "🤖 AI Analyzing...";

  try {
    let response = await fetch("https://fake-news-project-c0q8.onrender.com/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    let data = await response.json();

    let emoji = data.result === "Fake" ? "❌" : "✅";

    resultDiv.innerHTML = `
      <h2>${emoji} ${data.result} News (AI)</h2>
      <p><b>Confidence:</b> ${data.confidence}%</p>
      <p><b>AI Explanation:</b> ${data.explanation}</p>
    `;

  } catch (error) {
    resultDiv.innerHTML = "❌ Server Error";
  }
}