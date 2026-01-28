import { Link } from "react-router-dom";
import "../styles/personas.css";

function Sidebar() {
  const logout = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  return (
    <aside className="sidebar card">
      <div className="sidebar-header">
        <div className="logo-circle">C</div>
        <h3 className="sidebar-title">Condominio</h3>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <Link className="nav-link" to="/personas">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Personas
        </Link>
        <Link className="nav-link" to="/carros">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 13l2-6h13l2 6" />
            <path d="M5 13v6" />
            <path d="M19 13v6" />
            <circle cx="7.5" cy="18.5" r="1.5" />
            <circle cx="16.5" cy="18.5" r="1.5" />
          </svg>
          Carros
        </Link>
        <Link className="nav-link" to="/controles">
          Controles
        </Link>
        <Link className="nav-link" to="/pagos">
          Pagos
        </Link>
        <Link className="nav-link" to="/gastos">
          Gastos
        </Link>
        <Link className="nav-link" to="/reportes">
          Reportes
        </Link>
        <Link className="nav-link" to="/notificaciones">
          Notificaciones
        </Link>
        <Link className="nav-link" to="/asambleas">
          Asambleas
        </Link>
        <Link className="nav-link" to="/multas">
          Multas
        </Link>
        <Link className="nav-link" to="/mensajes-deptos">
          Mensajes Deptos
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-ghost" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
