import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "../api/apiClient"; // Axios instance
import Cookies from "js-cookie";

interface Note {
  _id: string;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null); // State for editing an existing note
  const [showForm, setShowForm] = useState(false); // Toggle for add form
  const navigate = useNavigate();
  const location = useLocation(); // Use location hook to access state

  useEffect(() => {
    if (location.state?.showForm) {
      setShowForm(true); // If showForm is true in state, show the form
    }
  }, [location.state]);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("/notes");
        setNotes(response.data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/notes", newNote);
      setNotes((prev) => [...prev, response.data]); // Add the new note to the list
      setShowForm(false); // Hide the form
      setNewNote({ title: "", content: "" }); // Reset the form
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add note. Please try again.");
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNote) {
      try {
        const response = await axios.put(`/notes/${editingNote._id}`, newNote);
        setNotes((prev) =>
          prev.map((note) =>
            note._id === editingNote._id ? response.data : note
          )
        );
        setShowForm(false); // Hide the form after successful update
        setNewNote({ title: "", content: "" }); // Reset form data
        setEditingNote(null); // Clear editing state
      } catch (err) {
        console.error("Error updating note:", err);
        setError("Failed to update note. Please try again.");
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleEditNote = (note: Note) => {
    setNewNote({ title: note.title, content: note.content }); // Pre-fill the form with note data
    setEditingNote(note); // Set the note being edited
    setShowForm(true); // Show the form
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Notes</h1>

      {isLoading ? (
        <p>Loading notes...</p>
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
                Add New Note
              </button>
            )}
          </div>

          {showForm && (
            <form
              onSubmit={editingNote ? handleUpdateNote : handleAddNote}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <textarea
                placeholder="Content"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              />
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-lg"
              >
                {editingNote ? "Update Note" : "Save Note"}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-4 rounded-lg shadow-lg"
                >
                  <h2 className="text-xl font-semibold">{note.title}</h2>
                  <p>{note.content}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="py-2 px-4 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No notes found. Add a new note to get started!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotesPage;
