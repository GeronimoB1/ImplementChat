import "./style.css";

// Conecta con el webhook.
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/f64a5aed-cfb3-459b-8e3b-9b56909d52ef"; 

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
    Fecha: new Date(),
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
