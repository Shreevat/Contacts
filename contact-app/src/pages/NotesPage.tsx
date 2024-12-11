import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/apiClient";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  date: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "Business",
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Fetch notes on component mount
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
      setNotes((prev) => [...prev, response.data]);
      setShowForm(false);
      setNewNote({ title: "", content: "", category: "Business" });
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add note. Please try again.");
    }
  };

  const handleEditNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      try {
        const response = await axios.put(`/notes/${editingNote._id}`, newNote);
        setNotes((prev) =>
          prev.map((note) =>
            note._id === editingNote._id ? response.data : note
          )
        );
        setEditingNote(null);
        setShowForm(false);
        setNewNote({ title: "", content: "", category: "Business" });
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

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content, category: note.category });
    setShowForm(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Business":
        return "bg-blue-500";
      case "Home":
        return "bg-green-500";
      case "Personal":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
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
                className="py-2 px-4 bg-green-600 text-white rounded-lg flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                <span>Add New Note</span>
              </button>
            )}
          </div>

          {(showForm && !editingNote) || (editingNote && showForm) ? (
            <form
              onSubmit={editingNote ? handleEditNote : handleAddNote}
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
              <select
                value={newNote.category}
                onChange={(e) =>
                  setNewNote({ ...newNote, category: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option value="Business">Business</option>
                <option value="Home">Home</option>
                <option value="Personal">Personal</option>
              </select>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-lg"
              >
                {editingNote ? "Update Note" : "Save Note"}
              </button>
            </form>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center">
                    <span
                      className={`text-white text-sm py-1 px-2 rounded-full ${getCategoryColor(
                        note.category
                      )}`}
                    >
                      {note.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mt-2">{note.title}</h2>
                  <p className="mt-2">{note.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">{note.date}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(note)}
                        className="text-gray-500"
                      >
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                      </button>
                    </div>
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
