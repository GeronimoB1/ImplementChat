import "./style.css";
import "./chat.js";

// Conecta con el webhook.
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/2883c523-b0e6-454c-a1ad-99b43966ae1b"; 

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // evita recargar la página

  statusEl.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  // Toma los valores del formulario
  const formData = new FormData(form);
  const payload = {
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    mensaje: formData.get("mensaje"),
    Fecha: new Date().toISOString(),
  };

  try {
    //Enviamos a n8n como JSON
    const resp = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText} ${text}`);
    }


    statusEl.textContent = "✅ Mensaje enviado. Gracias 🙌";
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent =
      "❌ No se pudo enviar. Revisá la URL del webhook y CORS en n8n.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar";
  }
});