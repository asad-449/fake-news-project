function addMessage(text, type) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + type;
  div.innerHTML = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function checkNews() {
  let input = document.getElementById("newsInput");
  let text = input.value;

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // ⚡ instant response
  let loadingMsg = document.createElement("div");
  loadingMsg.className = "msg bot";
  loadingMsg.innerHTML = "⚡ Checking quickly...";
  document.getElementById("chat").appendChild(loadingMsg);

  try {
    let response = await fetch("https://fake-news-project-c0q8.onrender.com/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    let data = await response.json();

    // replace loading with result
    loadingMsg.innerHTML =
      (data.result === "Fake"
        ? `❌ Fake (${data.confidence}%)`
        : `✅ Real (${data.confidence}%)`);

    // 🤖 delayed explanation (AI feel)
    setTimeout(() => {
      addMessage("🤖 " + data.explanation, "bot");
    }, 1200);

  } catch (err) {
    loadingMsg.innerHTML = "❌ Server error";
  }
}