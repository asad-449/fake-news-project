function addMessage(text, type) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + type;
  div.innerHTML = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

// 🤖 realistic typing
function typingAnimation() {
  let msg = addMessage("🤖 Thinking", "bot");

  let dots = 0;
  let interval = setInterval(() => {
    dots = (dots + 1) % 4;
    msg.innerHTML = "🤖 Thinking" + ".".repeat(dots);
  }, 400);

  return { msg, interval };
}

async function checkNews() {
  let input = document.getElementById("newsInput");
  let text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  let { msg, interval } = typingAnimation();

  try {
    let res = await fetch("https://fake-news-project-c0q8.onrender.com/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    let data = await res.json();

    clearInterval(interval);

    // 🎯 result badge
    msg.innerHTML =
      data.result === "Fake"
        ? `❌ Fake News (${data.confidence}%)`
        : `✅ Real News (${data.confidence}%)`;

    // 📊 confidence bar
    let bar = document.createElement("div");
    bar.style.marginTop = "6px";
    bar.innerHTML = `
      <div style="height:6px;background:#1e293b;border-radius:6px;">
        <div style="width:${data.confidence}%;height:6px;background:${
          data.result === "Fake" ? "#ef4444" : "#22c55e"
        };border-radius:6px;"></div>
      </div>
    `;
    msg.appendChild(bar);

    // 🤖 explanation delayed (real AI feel)
    setTimeout(() => {
      addMessage("🤖 " + data.explanation, "bot");
    }, 1200);

  } catch (err) {
    clearInterval(interval);
    msg.innerHTML = "❌ Server error";
  }
}

// 🎤 VOICE (auto-send)
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-US";

  recognition.onstart = () => {
    addMessage("🎤 Listening...", "bot");
  };

  recognition.onresult = (event) => {
    let speechText = event.results[0][0].transcript;

    document.getElementById("newsInput").value = speechText;

    // auto send
    setTimeout(() => {
      checkNews();
    }, 500);
  };

  recognition.onerror = () => {
    addMessage("❌ Voice error", "bot");
  };

  recognition.start();
}