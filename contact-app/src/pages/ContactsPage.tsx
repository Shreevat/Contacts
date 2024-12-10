import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "../api/apiClient"; // Axios instance
import Cookies from "js-cookie";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [showForm, setShowForm] = useState(false); // Toggle for add form
  const navigate = useNavigate();
  const location = useLocation(); // Use location hook to access state

  // Check if the 'showForm' state is passed
  useEffect(() => {
    if (location.state?.showForm) {
      setShowForm(true); // If showForm is true in state, show the form
    }
  }, [location.state]);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("/contacts");
        setContacts(response.data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/contacts", newContact);
      setContacts((prev) => [...prev, response.data]); // Add the new contact to the list
      setShowForm(false); // Hide the form
      setNewContact({ name: "", email: "", phone: "" }); // Reset the form
    } catch (err) {
      console.error("Error adding contact:", err);
      setError("Failed to add contact. Please try again.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Contacts</h1>

      {isLoading ? (
        <p>Loading contacts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            {showForm ? (
              <button
                onClick={() => setShowForm(false)}
                className="py-2 px-4 bg-red-600 text-white rounded-lg"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="py-2 px-4 bg-green-600 text-white rounded-lg"
              >
                Add New Contact
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleAddContact} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-lg"
              >
                Save Contact
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-white p-4 rounded-lg shadow-lg"
                >
                  <h2 className="text-xl font-semibold">{contact.name}</h2>
                  <p>Email: {contact.email}</p>
                  <p>Phone: {contact.phone}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="py-2 px-4 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No contacts found. Add a new contact to get started!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContactsPage;
