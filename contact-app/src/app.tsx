import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Siderbar";
import LoginSignUpPage from "./pages/LoginSignUpPage";
import ContactsPage from "./pages/ContactsPage";
import DashboardPage from "./pages/DashboardPage";
import Cookies from "js-cookie"; // Import js-cookie to access cookies

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if authToken exists in cookies
    const token = Cookies.get("authToken");

    // If token exists, set authenticated to true, else false
    setIsAuthenticated(token ? true : false); 
  }, []);

  return (
    <Router>
      <div className="flex">
        {isAuthenticated ? (
          <>
            {/* Sidebar should only be shown if authenticated */}
            <Sidebar />
            <div className="flex-grow p-4">
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                {/* Add more routes here */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </>
        ) : (
          // If not authenticated, show Login/Sign-up page
          <LoginSignUpPage setIsAuthenticated={setIsAuthenticated} />
        )}
      </div>
    </Router>
  );
};

export default App;