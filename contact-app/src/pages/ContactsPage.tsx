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
  const [editingContact, setEditingContact] = useState<Contact | null>(null); // State for editing an existing contact
  const [showForm, setShowForm] = useState(false); // Toggle for add form
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingContact) {
      try {
        const response = await axios.put(`/contacts/${editingContact._id}`, newContact);
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === editingContact._id ? response.data : contact
          )
        );
        setShowForm(false); // Hide the form after successful update
        setNewContact({ name: "", email: "", phone: "" }); // Reset form data
        setEditingContact(null); // Clear editing state
      } catch (err) {
        console.error("Error updating contact:", err);
        setError("Failed to update contact. Please try again.");
      }
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

  const handleEditContact = (contact: Contact) => {
    setNewContact({ name: contact.name, email: contact.email, phone: contact.phone }); // Pre-fill the form with contact data
    setEditingContact(contact); // Set the contact being edited
    setShowForm(true); // Show the form
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
            <form
              onSubmit={editingContact ? handleUpdateContact : handleAddContact}
              className="space-y-4"
            >
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
                {editingContact ? "Update Contact" : "Save Contact"}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1  gap-4">
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
                      onClick={() => handleEditContact(contact)}
                      className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                    >
                      Edit
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
