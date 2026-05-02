async function checkNews() {
  let text = document.getElementById("newsInput").value;
  let resultDiv = document.getElementById("result");

  if (!text) return;

  resultDiv.innerHTML = "🤖 Analyzing...";
  resultDiv.style.color = "yellow";

  try {
    let response = await fetch("https://fake-news-project-c0q8.onrender.com/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    let data = await response.json();

    // 🎯 result
    resultDiv.innerHTML =
      data.result === "Fake"
        ? `❌ Fake News (${data.confidence}%)`
        : `✅ Real News (${data.confidence}%)`;

    // 📊 confidence bar
    resultDiv.innerHTML += `
      <div style="margin-top:10px;height:6px;background:#1e293b;border-radius:6px;">
        <div style="width:${data.confidence}%;height:6px;background:${
          data.result === "Fake" ? "#ef4444" : "#22c55e"
        };border-radius:6px;"></div>
      </div>
    `;

    // 🤖 explanation
    setTimeout(() => {
      resultDiv.innerHTML += `<br><br>🤖 ${data.explanation}`;
    }, 800);

  } catch (err) {
    resultDiv.innerHTML = "❌ Server error";
    resultDiv.style.color = "orange";
  }
}


// 🎤 VOICE INPUT (website version)
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-US";

  recognition.onstart = () => {
    document.getElementById("result").innerHTML = "🎤 Listening...";
  };

  recognition.onresult = (event) => {
    let speechText = event.results[0][0].transcript;

    document.getElementById("newsInput").value = speechText;

    // auto analyze
    checkNews();
  };

  recognition.onerror = () => {
    document.getElementById("result").innerHTML = "❌ Voice error";
  };

  recognition.start();
}