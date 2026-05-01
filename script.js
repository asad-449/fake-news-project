let total = 0;
let fake = 0;
let real = 0;

async function checkNews() {
  let text = document.getElementById("newsInput").value;
  let resultDiv = document.getElementById("result");

  if (!text) {
    resultDiv.innerHTML = "⚠️ Enter text first";
    return;
  }

  resultDiv.innerHTML = "🤖 Analyzing...";

  try {
    let response = await fetch("https://fake-news-project-c0q8.onrender.com/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    let data = await response.json();

    total++;

    let emoji = data.result === "Fake" ? "❌" : "✅";

    if (data.result === "Fake") fake++;
    else real++;

    // UI result
    resultDiv.innerHTML = `
      <h2>${emoji} ${data.result} News</h2>
      <p><b>Confidence:</b> ${data.confidence}%</p>
      <p>${data.explanation}</p>
    `;

    // update dashboard
    document.getElementById("total").innerText = total;
    document.getElementById("fake").innerText = fake;
    document.getElementById("real").innerText = real;

  } catch (error) {
    resultDiv.innerHTML = "❌ Server Error";
  }
}