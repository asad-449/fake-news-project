async function checkNews() {
  let text = document.getElementById("newsInput").value;
  let resultDiv = document.getElementById("result");

  if (!text) {
    resultDiv.innerHTML = "⚠️ Please enter news text";
    return;
  }

  resultDiv.innerHTML = "🔍 Analyzing...";

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
      <h2>${emoji} ${data.result} News</h2>
      <p><b>Confidence:</b> ${data.confidence}%</p>
      <p><b>Explanation:</b> ${data.explanation}</p>
      <p><b>Reasons:</b><br>${data.reasons.join("<br>")}</p>
    `;

  } catch (error) {
    resultDiv.innerHTML = "❌ Server Error";
  }
}