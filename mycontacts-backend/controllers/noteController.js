const asyncHandler = require("express-async-handler");
const Note = require("../models/noteModel");

// @desc    Get all notes for the logged-in user
// @route   GET /api/notes
// @access  Private

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user_id: req.user.id });
  res.status(200).json(notes);
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error("Please provide a title and content for the note");
  }
  const note = await Note.create({
    title,
    content,
    user_id: req.user.id, // Link note to logged-in user
  });

  res.status(201).json(note);
});

// @desc    Get a specific note
// @route   GET /api/notes/:id
// @access  Private

const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error("Note not found or access denied");
  }
  res.status(200).json(note);
});

// @desc    Update a specific note
// @route   PUT /api/notes/:id
// @access  Private

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found or access denied");
  }

  if (note.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission");
  }

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } //return updated contact instead of old )
  );

  res.status(200).json(updatedNote);
});

// @desc    Delete a specific note
// @route   DELETE /api/notes/:id
// @access  Private

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404).json({ message: "Note not found" });
    return;
  }
  if (note.user_id.toString() !== req.user.id) {
    res
      .status(403)
      .json({ message: "Access denied. You can only delete your own notes." });
    return;
  }
  await Note.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Note deleted successfully" });
});

module.exports = {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};
