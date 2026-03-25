import { useEffect, useState } from "react";
import echo from "../echo";
import axios from "axios";
import "../styles/mensajes.css";

export default function MensajesDeptos() {
  const [mensajes, setMensajes] = useState([]);
  const [de, setDe] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    echo.channel("chat-condominio")
      .listen(".chat.message", (e) => {
        setMensajes((prev) => [
          {
            de: e.from,
            texto: e.message,
            fecha: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      });

    return () => echo.leave("chat-condominio");
  }, []);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!texto || !de) return;

    // Mostrar inmediato
    setMensajes((prev) => [
      {
        de,
        texto,
        fecha: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat/send", {
        from: de,
        message: texto,
      });

      setTexto("");
      setAlert({ show: true, type: "success", message: (res?.data && JSON.stringify(res.data)) || "Mensaje enviado" });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Error al enviar";
      setAlert({ show: true, type: "error", message: msg });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert((a) => ({ ...a, show: false })), 3500);
    }
  };

  return (
    <div>
      <h2>Mensajes entre Departamentos</h2>

      <form onSubmit={enviarMensaje} className="mensajes-form">
        <input
          placeholder="De (A-101)"
          value={de}
          onChange={(e) => setDe(e.target.value)}
          disabled={loading}
        />

        <input
          placeholder="Mensaje"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={loading}
        />

        <button type="submit" className={`btn ${loading ? "loading" : ""}`} disabled={loading}>
          <span className="btn-text">{loading ? "Enviando..." : "Enviar"}</span>
          <span className="spinner" aria-hidden="true"></span>
        </button>

        <div className={`alert ${alert.show ? "show" : ""} ${alert.type}`} role="status">
          {alert.message}
        </div>
      </form>

      {mensajes.map((m, i) => (
        <div key={i}>
          <strong>{m.de}</strong>: {m.texto}
          <br />
          <small>{m.fecha}</small>
        </div>
      ))}
    </div>
  );
}
