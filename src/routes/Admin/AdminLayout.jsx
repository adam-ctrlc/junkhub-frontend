import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
}
