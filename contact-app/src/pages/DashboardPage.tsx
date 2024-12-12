import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/apiClient";
import Cookies from "js-cookie";

const DashboardPage: React.FC = () => {
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [latestContact, setLatestContact] = useState<string | null>(null);

  // Initialize state from cookies or default to 0
  const [sessionContactsCount, setSessionContactsCount] = useState<number>(
    Number(Cookies.get("sessionContactsCount")) || 0
  );
  const [sessionNotesCount, setSessionNotesCount] = useState<number>(
    Number(Cookies.get("sessionNotesCount")) || 0
  );

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/contacts");
        const contacts = response.data;

        setContactsCount(contacts.length);

        if (contacts.length > 0) {
          const latest = contacts[contacts.length - 1];
          setLatestContact(latest.name || "Unknown Contact");
        } else {
          setLatestContact("No contacts added yet");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        setLatestContact("Failed to fetch contacts");
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

    fetchContacts();
    fetchNotesCount();
  }, []);

  useEffect(() => {
    if (location.state?.contactAdded) {
      setSessionContactsCount((prevCount) => {
        const newCount = prevCount + 1;
        Cookies.set("sessionContactsCount", String(newCount));
        return newCount;
      });
    }

    if (location.state?.noteAdded) {
      setSessionNotesCount((prevCount) => {
        const newCount = prevCount + 1;
        Cookies.set("sessionNotesCount", String(newCount));
        return newCount;
      });
    }

    // Clear navigation state after processing
    if (location.state) {
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const handleAddContact = () => {
    navigate("/contacts", { state: { showForm: true } });
  };

  const handleAddNote = () => {
    navigate("/notes", { state: { showForm: true } });
  };

  const handleLogout = () => {
    // Clear session cookies
    Cookies.remove("sessionContactsCount");
    Cookies.remove("sessionNotesCount");

    // Reset state counts to zero
    setSessionContactsCount(0);
    setSessionNotesCount(0);

    // Navigate to login
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

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
          <h2 className="text-2xl font-semibold">Session Contacts Added</h2>
          <p className="text-xl">{sessionContactsCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Add Contact</h2>
          <p>Click to add a new contact.</p>
          <button
            onClick={handleAddContact}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg"
          >
            Add Contact
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Add Note</h2>
          <p>Click to add a new note.</p>
          <button
            onClick={handleAddNote}
            className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg"
          >
            Add Note
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li>✔️ Latest contact added: {latestContact || "N/A"}</li>
          <li>✔️ {sessionContactsCount || 0} Contacts added this session</li>
          <li>✔️ {sessionNotesCount || 0} Notes added this session </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
