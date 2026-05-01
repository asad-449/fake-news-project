let total = 0;
let fake = 0;
let real = 0;
let chart;

function initChart() {
  const ctx = document.getElementById("myChart");

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Fake", "Real"],
      datasets: [{
        data: [fake, real],
        backgroundColor: ["#ef4444", "#22c55e"]
      }]
    }
  });
}

function updateChart() {
  chart.data.datasets[0].data = [fake, real];
  chart.update();
}

async function checkNews() {
  let text = document.getElementById("newsInput").value;
  let resultDiv = document.getElementById("result");

  if (!text) {
    resultDiv.innerHTML = "⚠️ Enter text first";
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

    total++;

    if (data.result === "Fake") fake++;
    else real++;

    let emoji = data.result === "Fake" ? "❌" : "✅";

    resultDiv.innerHTML = `
      <h2>${emoji} ${data.result}</h2>
      <p><b>Confidence:</b> ${data.confidence}%</p>
      <p>${data.explanation}</p>
    `;

    document.getElementById("total").innerText = total;
    document.getElementById("fake").innerText = fake;
    document.getElementById("real").innerText = real;

    updateChart();

  } catch (err) {
    resultDiv.innerHTML = "❌ Server Error";
  }
}

window.onload = () => {
  initChart();
};