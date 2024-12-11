import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "../api/apiClient"; // Axios instance

const DashboardPage: React.FC = () => {
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchContactsCount = async () => {
      try {
        const response = await axios.get("/contacts");
        setContactsCount(response.data.length); 
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      }
    };

    const fetchNotesCount = async () => {
      try {
        const response = await axios.get("/notes");
        setNotesCount(response.data.length); 
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      }
    };

    fetchContactsCount();
    fetchNotesCount();
  }, []);

  

  const handleNavigateToContacts = () => {
    navigate("/contacts", { state: { showForm: true } }); 
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">
        Dashboard. All visual placeholders lol
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold">Contacts</h2>
          {error ? (
            <p className="text-red-500">Error loading contacts</p>
          ) : (
            <p className="text-xl">{contactsCount}</p>
          )}
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold">Notes</h2>
          <p className="text-xl">{notesCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold">Pending Tasks</h2>
          <p className="text-xl">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Add Contact</h2>
          <p>Click to add a new contact.</p>
          <button
            onClick={handleNavigateToContacts} 
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg"
          >
            Add Contact
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">View All Contacts</h2>
          <p>See a list of all your contacts.</p>
          <button
            onClick={() => navigate("/contacts")} 
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg"
          >
            View Contacts
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Generate Report</h2>
          <p>Export contact data as a report.</p>
          <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg">
            Generate Report
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li>✔️ Added a new contact: John Doe</li>
          <li>✔️ Logged in at 9:30 AM</li>
          <li>❌ Failed login attempt: unknown@example.com</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
