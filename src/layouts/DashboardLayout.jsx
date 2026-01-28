import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/dashboard.css";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
