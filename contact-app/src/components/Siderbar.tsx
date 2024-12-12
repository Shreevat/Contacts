import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the authentication token
    Cookies.remove("authToken");

    // Remove session counts cookies
    Cookies.remove("sessionContactsCount");
    Cookies.remove("sessionNotesCount");

    // Navigate to the login page and reload the window
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
      <nav className="p-4 space-y-4">
        <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700">
          Dashboard
        </Link>
        <Link to="/contacts" className="block py-2 px-4 hover:bg-gray-700">
          Contacts
        </Link>
        <Link to="/notes" className="block py-2 px-4 hover:bg-gray-700">
          Notes
        </Link>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 rounded-md"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
