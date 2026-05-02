function addMessage(text, type) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + type;
  div.innerHTML = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

// ✨ Typing animation
function showTyping() {
  let typing = addMessage("🤖 Typing...", "bot");

  let dots = 0;
  let interval = setInterval(() => {
    dots = (dots + 1) % 4;
    typing.innerHTML = "🤖 Typing" + ".".repeat(dots);
  }, 400);

  return { typing, interval };
}

async function checkNews() {
  let input = document.getElementById("newsInput");
  let text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // show typing
  let { typing, interval } = showTyping();

  try {
    let response = await fetch("https://fake-news-project-c0q8.onrender.com/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    let data = await response.json();

    clearInterval(interval);

    typing.innerHTML =
      (data.result === "Fake"
        ? `❌ Fake (${data.confidence}%)`
        : `✅ Real (${data.confidence}%)`);

    // explanation after delay
    setTimeout(() => {
      addMessage("🤖 " + data.explanation, "bot");
    }, 800);

  } catch (err) {
    clearInterval(interval);
    typing.innerHTML = "❌ Server error";
  }
}

// 🎤 VOICE INPUT
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-US";

  recognition.onstart = () => {
    addMessage("🎤 Listening...", "bot");
  };

  recognition.onresult = (event) => {
    let speechText = event.results[0][0].transcript;
    document.getElementById("newsInput").value = speechText;
  };

  recognition.onerror = () => {
    addMessage("❌ Voice error", "bot");
  };

  recognition.start();
}