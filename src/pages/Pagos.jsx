import { useState } from "react";
import { agregarNotificacion } from "../utils/notificaciones";

export default function Pagos() {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [atrasado, setAtrasado] = useState(false);

  const guardarPago = (e) => {
    e.preventDefault();

    if (atrasado) {
      agregarNotificacion(
        "pago",
        `Pago atrasado de ${nombre} por $${monto}`
      );
    }

    setNombre("");
    setMonto("");
    setAtrasado(false);
  };

  return (
    <div>
      <h2>Pagos</h2>

      <form onSubmit={guardarPago}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={atrasado}
            onChange={(e) => setAtrasado(e.target.checked)}
          />
          Pago atrasado
        </label>

        <br />
        <button type="submit">Guardar pago</button>
      </form>
    </div>
  );
}
