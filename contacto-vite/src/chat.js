
const N8N_CHAT_WEBHOOK_URL = "http://localhost:5678/webhook-test/330542c7-023f-4b49-bd60-077f3fb7e26c";

const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatStatus = document.getElementById("chatStatus");

if (chatBox && chatForm && chatInput && chatSend) {
  const chatHistory = []; // después lo mandamos a n8n si querés contexto

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function setThinking(isThinking) {
    chatSend.disabled = isThinking;
    chatInput.disabled = isThinking;
    chatSend.textContent = isThinking ? "..." : "Enviar";
  }

  // MOCK: hoy responde falso, mañana lo conectamos a n8n
  async function sendToBot(userText) {
  const payload = {
    message: userText,
    // opcional: mandar historial para contexto
    history: chatHistory,
    sessionId: "web-local-1",
    ts: new Date().toISOString(),
  };

  const resp = await fetch(N8N_CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status} ${resp.statusText} ${text}`);
  }

  const data = await resp.json();

  // Esperamos que n8n responda { reply: "..." }
  return data.reply ?? "No recibí 'reply' desde n8n.";
}

  addMessage("bot", "Hola 👋 Soy la IA de Gerito flow. Escribime algo.");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    chatStatus.textContent = "";

    const text = chatInput.value.trim();
    if (!text) return;

    addMessage("user", text);
    chatHistory.push({ role: "user", content: text });

    chatInput.value = "";
    setThinking(true);

    try {
      const reply = await sendToBot(text);
      addMessage("bot", reply);
      chatHistory.push({ role: "assistant", content: reply });
    } catch (err) {
      console.error(err);
      chatStatus.textContent = "❌ No se pudo responder el chat.";
    } finally {
      setThinking(false);
      chatInput.focus();
    }
  });
}