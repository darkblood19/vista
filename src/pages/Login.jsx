import { useState, useEffect } from "react";
import "../styles/login.css";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    // Generate or retrieve deviceId
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user, password, deviceId }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin();
      } else {
        setError(data?.message || "Error en el login");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!name || !email || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setInfo("Registrado. Revisa tu correo para confirmar tu cuenta.");
        setName("");
        setEmail("");
        setPassword("");
        setMode("login");
      } else {
        setError(data?.message || "Error en el registro");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Condominio</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {info && <p style={{ color: "green" }}>{info}</p>}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Ingresar</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Registrarme</button>
          </form>
        )}

        <p style={{ marginTop: 12 }}>
          {mode === "login" ? (
            <>
              ¿No tienes cuenta? <button onClick={() => { setMode("register"); setError(""); setInfo(""); }} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>Regístrate</button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta? <button onClick={() => { setMode("login"); setError(""); setInfo(""); }} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>Ingresar</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
