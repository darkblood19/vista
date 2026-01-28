import { useState } from "react";
import "../styles/personas.css";

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [editId, setEditId] = useState(null);

  const guardarPersona = (e) => {
    e.preventDefault();

    if (editId === null) {
      setPersonas([
        ...personas,
        {
          id: Date.now(),
          nombre,
          departamento,
        },
      ]);
    } else {
      setPersonas(
        personas.map((p) =>
          p.id === editId ? { ...p, nombre, departamento } : p
        )
      );
      setEditId(null);
    }

    setNombre("");
    setDepartamento("");
  };

  const eliminarPersona = (id) => {
    setPersonas(personas.filter((p) => p.id !== id));
  };

  const editarPersona = (persona) => {
    setNombre(persona.nombre);
    setDepartamento(persona.departamento);
    setEditId(persona.id);
  };

  return (
    <div>
      <h2>Personas / Departamentos</h2>

      <form className="form-persona" onSubmit={guardarPersona}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Departamento"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          required
        />

        <button type="submit">
          {editId ? "Actualizar" : "Guardar"}
        </button>
      </form>

      <table className="table-personas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.departamento}</td>
              <td>
                <button onClick={() => editarPersona(p)}>Editar</button>
                <button onClick={() => eliminarPersona(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
