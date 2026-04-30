async function checkNews() {
  let text = document.getElementById("newsInput").value;
  let resultDiv = document.getElementById("result");

  resultDiv.innerText = "Analyzing...";
  resultDiv.style.color = "yellow";

  try {
    let response = await fetch("http://localhost:3000/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });

    let data = await response.json();

    if (data.result === "Fake") {
      resultDiv.innerHTML = `❌ Fake News (${data.confidence}%)<br><br>${data.reasons.join("<br>")}`;
      resultDiv.style.color = "red";
    } else {
      resultDiv.innerHTML = `✅ Real News (${data.confidence}%)<br><br>${data.reasons.join("<br>")}`;
      resultDiv.style.color = "lightgreen";
    }

  } catch (error) {
    resultDiv.innerText = "Error connecting to server!";
    resultDiv.style.color = "orange";
  }
}